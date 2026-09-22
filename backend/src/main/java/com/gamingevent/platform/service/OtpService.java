package com.gamingevent.platform.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Generates and verifies one-time passwords (OTP) for login.
 * OTPs are kept in memory (per email), expire after a few minutes and
 * are limited to a maximum number of wrong attempts.
 */
@Service
public class OtpService {

    public enum VerifyResult { OK, INVALID, EXPIRED, TOO_MANY_ATTEMPTS, NOT_FOUND }

    private static class Entry {
        final String code;
        final Instant sentAt;
        final Instant expiresAt;
        int attempts = 0;

        Entry(String code, Instant sentAt, Instant expiresAt) {
            this.code = code;
            this.sentAt = sentAt;
            this.expiresAt = expiresAt;
        }
    }

    private final Map<String, Entry> store = new ConcurrentHashMap<>();
    private final SecureRandom random = new SecureRandom();

    @Value("${app.otp.expiry-minutes:5}")
    private int expiryMinutes;

    @Value("${app.otp.max-attempts:5}")
    private int maxAttempts;

    @Value("${app.otp.resend-seconds:30}")
    private int resendSeconds;

    public int getExpiryMinutes() {
        return expiryMinutes;
    }

    public int getResendSeconds() {
        return resendSeconds;
    }

    private static String key(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    /** Seconds the caller must still wait before a new OTP can be sent (0 = can send now). */
    public long cooldownRemaining(String email) {
        Entry e = store.get(key(email));
        if (e == null) return 0;
        long passed = Duration.between(e.sentAt, Instant.now()).getSeconds();
        return Math.max(0, resendSeconds - passed);
    }

    /** True if an OTP was already issued for this email (used to allow "resend"). */
    public boolean hasPending(String email) {
        return store.containsKey(key(email));
    }

    /** True if a still-valid (not expired) OTP exists for this email. */
    public boolean hasActive(String email) {
        Entry e = store.get(key(email));
        return e != null && Instant.now().isBefore(e.expiresAt);
    }

    /** Creates a fresh 6-digit OTP for the email (replaces any old one) and returns it. */
    public String issue(String email) {
        cleanup();
        String code = String.format("%06d", random.nextInt(1_000_000));
        Instant now = Instant.now();
        store.put(key(email), new Entry(code, now, now.plus(Duration.ofMinutes(expiryMinutes))));
        return code;
    }

    /** Forget the OTP (e.g. after successful login or failed email delivery). */
    public void clear(String email) {
        store.remove(key(email));
    }

    public VerifyResult verify(String email, String otp) {
        Entry e = store.get(key(email));
        if (e == null) return VerifyResult.NOT_FOUND;

        if (Instant.now().isAfter(e.expiresAt)) {
            store.remove(key(email));
            return VerifyResult.EXPIRED;
        }

        synchronized (e) {
            if (e.attempts >= maxAttempts) {
                store.remove(key(email));
                return VerifyResult.TOO_MANY_ATTEMPTS;
            }
            e.attempts++;

            boolean match = otp != null && MessageDigest.isEqual(
                    e.code.getBytes(StandardCharsets.UTF_8),
                    otp.trim().getBytes(StandardCharsets.UTF_8));

            if (match) {
                store.remove(key(email)); // one-time use
                return VerifyResult.OK;
            }
            if (e.attempts >= maxAttempts) {
                store.remove(key(email));
                return VerifyResult.TOO_MANY_ATTEMPTS;
            }
            return VerifyResult.INVALID;
        }
    }

    /** Remove entries that expired more than 30 minutes ago. */
    private void cleanup() {
        Instant cutoff = Instant.now().minus(Duration.ofMinutes(30));
        store.entrySet().removeIf(en -> en.getValue().expiresAt.isBefore(cutoff));
    }
}
