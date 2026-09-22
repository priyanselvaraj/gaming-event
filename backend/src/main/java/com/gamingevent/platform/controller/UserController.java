package com.gamingevent.platform.controller;

import com.gamingevent.platform.model.User;
import com.gamingevent.platform.repository.UserRepository;
import com.gamingevent.platform.service.EmailService;
import com.gamingevent.platform.service.OtpService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;
    private final OtpService otpService;
    private final EmailService emailService;

    public UserController(UserRepository userRepository, OtpService otpService, EmailService emailService) {
        this.userRepository = userRepository;
        this.otpService = otpService;
        this.emailService = emailService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (user.getName() == null || user.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Name is required"));
        }
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
        }
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password is required"));
        }

        // Check for duplicate email
        if (userRepository.existsByEmail(user.getEmail().trim())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Email is already registered! Please log in."));
        }

        user.setName(user.getName().trim());
        user.setEmail(user.getEmail().trim());
        if (user.getRole() == null || user.getRole().trim().isEmpty()) {
            user.setRole("USER");
        } else {
            user.setRole(user.getRole().trim().toUpperCase());
        }

        User savedUser = userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("id", savedUser.getId());
        response.put("name", savedUser.getName());
        response.put("email", savedUser.getEmail());
        response.put("role", savedUser.getRole());
        response.put("message", "Registration successful!");

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * STEP 1 of login: check email + password, then email a 6-digit OTP.
     * The user is NOT logged in yet - they must call /verify-otp next.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and password are required"));
        }

        Optional<User> userOpt = userRepository.findByEmail(email.trim());
        if (userOpt.isEmpty() || !userOpt.get().getPassword().equals(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        }

        User user = userOpt.get();
        return sendOtpResponse(user, false);
    }

    /** Send the OTP again (only possible after a successful password check in /login). */
    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
        }

        Optional<User> userOpt = userRepository.findByEmail(email.trim());
        if (userOpt.isEmpty() || !otpService.hasPending(userOpt.get().getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Please log in with your email and password first."));
        }

        return sendOtpResponse(userOpt.get(), true);
    }

    /**
     * STEP 2 of login: verify the OTP. On success the user is logged in and a
     * "new login" notification email is sent to their address.
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body, HttpServletRequest request) {
        String email = body.get("email");
        String otp = body.get("otp");

        if (email == null || email.trim().isEmpty() || otp == null || otp.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and OTP are required"));
        }

        Optional<User> userOpt = userRepository.findByEmail(email.trim());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid OTP"));
        }
        User user = userOpt.get();

        OtpService.VerifyResult result = otpService.verify(user.getEmail(), otp);
        switch (result) {
            case OK:
                break;
            case INVALID:
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Incorrect OTP. Please try again."));
            case EXPIRED:
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "OTP has expired. Please request a new one."));
            case TOO_MANY_ATTEMPTS:
                return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                        .body(Map.of("message", "Too many wrong attempts. Please request a new OTP."));
            default:
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "No OTP found. Please log in again."));
        }

        // OTP correct -> send "new login" notification email (in background)
        emailService.sendLoginNotification(
                user.getEmail(), user.getName(), getClientIp(request), describeDevice(request.getHeader("User-Agent")));

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());
        response.put("message", "Login successful!");

        return ResponseEntity.ok(response);
    }

    /** Creates + emails an OTP (respecting the resend cool-down) and builds the JSON reply. */
    private ResponseEntity<?> sendOtpResponse(User user, boolean isResend) {
        String email = user.getEmail();
        Map<String, Object> response = new HashMap<>();
        response.put("otpRequired", true);
        response.put("email", email);
        response.put("resendSeconds", otpService.getResendSeconds());

        long wait = otpService.cooldownRemaining(email);
        if (wait > 0) {
            if (isResend) {
                response.put("message", "Please wait " + wait + " seconds before requesting another OTP.");
                response.put("resendSeconds", wait);
                return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(response);
            }
            if (otpService.hasActive(email)) {
                // A valid OTP was just emailed - do not spam the inbox, reuse it.
                response.put("message", "An OTP was already sent to " + maskEmail(email) + ". Please check your email.");
                response.put("resendSeconds", wait);
                return ResponseEntity.ok(response);
            }
        }

        String otp = otpService.issue(email);
        try {
            emailService.sendOtpEmail(email, user.getName(), otp, otpService.getExpiryMinutes());
        } catch (Exception ex) {
            otpService.clear(email);
            System.err.println(">>> Failed to send OTP email to " + email + ": " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Could not send the OTP email. Please try again in a moment."));
        }

        response.put("message", "OTP sent to " + maskEmail(email) + ". It is valid for "
                + otpService.getExpiryMinutes() + " minutes.");
        return ResponseEntity.ok(response);
    }

    private static String maskEmail(String email) {
        int at = email.indexOf('@');
        if (at <= 1) return email;
        return email.charAt(0) + "*".repeat(Math.max(1, at - 2)) + email.substring(at - 1);
    }

    private static String getClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        String ip = (forwarded != null && !forwarded.isBlank())
                ? forwarded.split(",")[0].trim()
                : request.getRemoteAddr();
        if ("0:0:0:0:0:0:0:1".equals(ip) || "::1".equals(ip) || "127.0.0.1".equals(ip)) {
            return "127.0.0.1 (localhost)";
        }
        return ip;
    }

    private static String describeDevice(String ua) {
        if (ua == null || ua.isBlank()) return "Unknown device";
        String browser = ua.contains("Edg/") ? "Edge"
                : ua.contains("OPR/") ? "Opera"
                : ua.contains("Firefox/") ? "Firefox"
                : ua.contains("Chrome/") ? "Chrome"
                : ua.contains("Safari/") ? "Safari"
                : "Unknown browser";
        String os = ua.contains("Windows") ? "Windows"
                : ua.contains("Android") ? "Android"
                : (ua.contains("iPhone") || ua.contains("iPad")) ? "iOS"
                : ua.contains("Mac OS X") ? "macOS"
                : ua.contains("Linux") ? "Linux"
                : "Unknown OS";
        return browser + " on " + os;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    Map<String, Object> res = new HashMap<>();
                    res.put("id", user.getId());
                    res.put("name", user.getName());
                    res.put("email", user.getEmail());
                    res.put("role", user.getRole());
                    return ResponseEntity.ok((Object) res);
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "User with ID " + id + " not found")));
    }
}
