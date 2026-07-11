package com.luxrental.service.common;

import com.luxrental.exception.AppException;
import com.luxrental.exception.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@Slf4j
public class CaptchaService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${google.recaptcha.secret-key}")
    private String captchaSecret;

    @Value("${google.recaptcha.verify-url}")
    private String googleVerifyUrl;

    public boolean verifyToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new AppException(ErrorCode.INVALID_CAPTCHA, "CAPTCHA trống hoặc thiếu.");
        }

        try {
            var headers = new org.springframework.http.HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_FORM_URLENCODED);

            var body = new org.springframework.util.LinkedMultiValueMap<String, String>();
            body.add("secret", captchaSecret);
            body.add("response", token);

            var request = new org.springframework.http.HttpEntity<>(body, headers);

            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(
                googleVerifyUrl,
                request,
                Map.class
            );

            if (response != null && Boolean.TRUE.equals(response.get("success"))) {
                return true;
            }

            Object errorCodes = response != null ? response.get("error-codes") : null;
            log.warn("CAPTCHA invalid: {}", errorCodes);

            throw new AppException(ErrorCode.INVALID_CAPTCHA, "CAPTCHA không hợp lệ hoặc đã hết hạn.");
        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            throw new AppException(ErrorCode.INVALID_CAPTCHA, "Không thể xác minh CAPTCHA.");
        }
    }
}
