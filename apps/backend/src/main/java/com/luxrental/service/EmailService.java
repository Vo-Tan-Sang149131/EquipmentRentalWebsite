package com.luxrental.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendResetPasswordEmail(String destMail, String resetLink) {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(destMail);
            helper.setSubject("Yêu cầu đặt lại mật khẩu");

            String htmlContent = "<h3>Xin chào,</h3>"
                + "<p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>"
                + "<p>Vui lòng nhấn vào liên kết bên dưới để tiến hành đổi mật khẩu:</p>"
                + "<p><a href=\"" + resetLink + "\" style=\"background-color: #007bff; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;\">Đặt lại mật khẩu</a></p>"
                + "<p>Nếu bạn không gửi yêu cầu này, vui lòng bỏ qua email.</p>";

            helper.setText(htmlContent, true);
            mailSender.send(message);

        } catch (MessagingException e) {
            log.error("Failed to create MIME message: {}", e.getMessage());
        }
    }

    @Async
    public void sendSuccessEmail(String destMail) {
        MimeMessage message = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(destMail);
            helper.setSubject("Mật khẩu đã được thay đổi thành công");

            String htmlContent = "<h3>Xin chào,</h3>"
                + "<p>Mật khẩu của bạn đã được thay đổi thành công.</p>"
                + "<p>Nếu bạn không thực hiện hành động này, vui lòng liên hệ ngay với bộ phận hỗ trợ để đảm bảo an toàn cho tài khoản.</p>"
                + "<p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>";

            helper.setText(htmlContent, true);
            mailSender.send(message);

            log.info("Success email sent to: {}", destMail);

        } catch (MessagingException e) {
            log.error("Failed to send success email: {}", e.getMessage());
        }
    }

}
