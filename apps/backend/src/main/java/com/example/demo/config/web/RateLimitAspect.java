package com.example.demo.config.web;

import com.example.demo.common.annotation.RateLimit;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.service.CaptchaService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.TimeUnit;

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class RateLimitAspect {
    private final StringRedisTemplate redisTemplate;
    private final CaptchaService captchaService;

    @Around("@annotation(rateLimit)")
    public Object checkRateLimit(ProceedingJoinPoint joinPoint, RateLimit rateLimit) throws Throwable {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            return joinPoint.proceed();
        }

        HttpServletRequest request = attributes.getRequest();
        HttpServletResponse response = attributes.getResponse();

        String ip = request.getRemoteAddr();
        String methodName = joinPoint.getSignature().getName();

        String counterKey = "rate_limit:" + methodName + ":" + ip;
        String blockKey = "block:" + methodName + ":" + ip;
        String penaltyKey = "penalty:" + methodName + ":" + ip;

        // --- BƯỚC 1: KIỂM TRA XEM CÓ ĐANG TRONG THỜI GIAN BỊ KHÓA KHÔNG ---
        Boolean isBlocked = redisTemplate.hasKey(blockKey);
        if (Boolean.TRUE.equals(isBlocked)) {
            long ttl = redisTemplate.getExpire(blockKey, TimeUnit.SECONDS);
            if (ttl < 0) ttl = rateLimit.blockDuration();

            // Sinh HTTP-date chuẩn quốc tế trả về cho header Retry-After
            ZonedDateTime retryTime = ZonedDateTime.now(ZoneOffset.UTC).plusSeconds(ttl);
            String httpDate = DateTimeFormatter.RFC_1123_DATE_TIME.format(retryTime);

            if (response != null) {
                response.setHeader("Retry-After", httpDate);
            }

            throw new AppException(ErrorCode.TOO_MANY_REQUESTS, "Retry after " + httpDate);
        }

        // --- BƯỚC 2: TĂNG BỘ ĐẾM REQUEST TRONG KHUNG THỜI GIAN ---
        Long count = redisTemplate.opsForValue().increment(counterKey);
        if (count != null && count == 1) {
            redisTemplate.expire(counterKey, rateLimit.duration(), TimeUnit.SECONDS);
        }

        // --- BƯỚC 3: NẾU VƯỢT QUÁ GIỚI HẠN REQUEST CHO PHÉP ---
        if (count != null && count > rateLimit.limit()) {
            Long penaltyCount = redisTemplate.opsForValue().increment(penaltyKey);
            if (penaltyCount != null && penaltyCount == 1) {
                redisTemplate.expire(penaltyKey, 1, TimeUnit.HOURS); // Reset lịch sử vi phạm sau 1 giờ
            }

            long pCount = (penaltyCount != null) ? penaltyCount : 1;

            // KỊCH BẢN NÂNG CAO: Nếu cố tình vi phạm vượt quá 3 lần liên tiếp ➔ ÉP GIẢI CAPTCHA
            if (pCount > 3) {
                String captchaToken = request.getHeader("X-Captcha-Token");

                // Gửi token lên Google kiểm tra xem ông này đã giải CAPTCHA chưa
                if (!captchaService.verifyToken(captchaToken)) {
                    log.error("[SECURITY-ALERT] IP {} gửi mã CAPTCHA giả mạo/hết hạn lên API {}!", ip, methodName);
                    // Ném lỗi bắt buộc giải mã CAPTCHA (Frontend sẽ bắt mã này để hiện ô tích reCAPTCHA)
                    throw new AppException(ErrorCode.NEED_CAPTCHA, "Vui lòng hoàn thành CAPTCHA để tiếp tục.");
                }

                // NẾU GIẢI THÀNH CÔNG: Khoan hồng xóa sạch án phạt trong Redis và cho đi tiếp
                redisTemplate.delete(penaltyKey);
                redisTemplate.delete(counterKey);
                log.info("IP {} đã vượt qua thử thách CAPTCHA thành công. Đã gỡ bỏ lệnh phạt.", ip);
                return joinPoint.proceed();
            }

            // KỊCH BẢN THƯỜNG (Dưới 3 lần vi phạm): Khóa lũy tiến nhân đôi thời gian
            long blockDuration = rateLimit.blockDuration() * (long) Math.pow(2, pCount - 1);
            redisTemplate.opsForValue().set(blockKey, "1", blockDuration, TimeUnit.SECONDS);

            ZonedDateTime retryTime = ZonedDateTime.now(ZoneOffset.UTC).plusSeconds(blockDuration);
            String httpDate = DateTimeFormatter.RFC_1123_DATE_TIME.format(retryTime);

            if (response != null) {
                response.setHeader("Retry-After", httpDate);
            }

            log.warn("IP {} bị khóa tạm thời {} giây (Mức phạt {}) tại API {}", ip, blockDuration, pCount, methodName);
            throw new AppException(ErrorCode.TOO_MANY_REQUESTS, "You are blocked until " + httpDate);
        }

        return joinPoint.proceed();
    }
}
