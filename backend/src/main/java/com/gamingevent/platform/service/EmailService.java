package com.gamingevent.platform.service;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

import java.nio.charset.StandardCharsets;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

/**
 * Sends the OTP email and the "new login" notification email.
 * If MAIL_USERNAME is not configured, nothing is sent and the content
 * is printed to the backend console (development fallback).
 */
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private static final DateTimeFormatter TIME_FMT =
            DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a z", Locale.ENGLISH);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${app.mail.from:no-reply@gamepass.local}")
    private String from;

    @Value("${app.mail.brand:GamePass}")
    private String brand;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public boolean isConfigured() {
        return mailUsername != null && !mailUsername.isBlank();
    }

    /** Sends the OTP email. Throws an exception if delivery fails. */
    public void sendOtpEmail(String to, String name, String otp, int expiryMinutes) throws Exception {
        if (!isConfigured()) {
            log.warn("SMTP not configured (MAIL_USERNAME empty). DEV MODE -> OTP for {} is: {}", to, otp);
            System.out.println(">>> [DEV MODE] Login OTP for " + to + " = " + otp
                    + " (valid " + expiryMinutes + " min)");
            return;
        }

        String html = wrap("Your login verification code",
                "<p>Hi <b>" + esc(name) + "</b>,</p>"
              + "<p>Use the one-time password (OTP) below to finish signing in to " + esc(brand) + ":</p>"
              + "<p style=\"font-size:34px;font-weight:bold;letter-spacing:10px;background:#f1f5f9;"
              + "border-radius:10px;padding:14px 0;text-align:center;color:#111827;\">" + esc(otp) + "</p>"
              + "<p>This code is valid for <b>" + expiryMinutes + " minutes</b> and can be used only once.</p>"
              + "<p style=\"color:#b91c1c;\">Never share this code with anyone. "
              + "If you did not try to log in, please ignore this email and change your password.</p>");

        send(to, brand + " login OTP: " + otp, html);
    }

    /** Sends a "new login to your account" notification. Runs in the background. */
    @Async
    public void sendLoginNotification(String to, String name, String ip, String device) {
        String time = ZonedDateTime.now(ZoneId.systemDefault()).format(TIME_FMT);

        if (!isConfigured()) {
            System.out.println(">>> [DEV MODE] Login notification for " + to
                    + " | time=" + time + " | ip=" + ip + " | device=" + device);
            return;
        }

        String html = wrap("New login to your account",
                "<p>Hi <b>" + esc(name) + "</b>,</p>"
              + "<p>We noticed a successful login to your " + esc(brand) + " account.</p>"
              + "<table style=\"border-collapse:collapse;margin:12px 0;\">"
              + row("Time", time)
              + row("IP address", ip)
              + row("Device", device)
              + "</table>"
              + "<p>If this was you, no action is needed.</p>"
              + "<p style=\"color:#b91c1c;\">If this was <b>not</b> you, change your password immediately.</p>");

        try {
            send(to, "New login to your " + brand + " account", html);
        } catch (Exception ex) {
            log.error("Could not send login notification to {}: {}", to, ex.getMessage());
        }
    }

    private void send(String to, String subject, String html) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, false, StandardCharsets.UTF_8.name());
        helper.setFrom(from);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(html, true);
        mailSender.send(message);
    }

    private String row(String label, String value) {
        return "<tr><td style=\"padding:4px 16px 4px 0;color:#6b7280;\">" + esc(label) + "</td>"
             + "<td style=\"padding:4px 0;\"><b>" + esc(value) + "</b></td></tr>";
    }

    private String wrap(String title, String body) {
        return "<div style=\"font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:auto;"
             + "border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;\">"
             + "<div style=\"background:#111827;color:#fff;padding:16px 20px;font-size:20px;\">&#9889; "
             + esc(brand) + "</div>"
             + "<div style=\"padding:20px;color:#111827;font-size:15px;line-height:1.5;\">"
             + "<h2 style=\"margin-top:0;\">" + esc(title) + "</h2>" + body + "</div>"
             + "<div style=\"background:#f9fafb;color:#6b7280;padding:12px 20px;font-size:12px;\">"
             + "This is an automated message, please do not reply.</div></div>";
    }

    private static String esc(String s) {
        return HtmlUtils.htmlEscape(s == null ? "" : s);
    }
}
