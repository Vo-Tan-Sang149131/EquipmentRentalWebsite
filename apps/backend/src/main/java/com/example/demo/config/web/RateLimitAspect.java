package com.example.demo.config.web;

import com.example.demo.common.annotation.RateLimit;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.concurrent.TimeUnit;

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class RateLimitAspect {
    private final StringRedisTemplate redisTemplate;

    @Around("@annotation(rateLimit)")
    public Object checkRateLimit(ProceedingJoinPoint joinPoint, RateLimit rateLimit) throws Throwable {
        // 1. Lấy định danh (có thể dùng Email từ request hoặc IP người dùng)
        // Ở đây mình ví dụ lấy IP để chặn cả người dùng chưa login
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        String ip = attributes.getRequest().getRemoteAddr();
        String methodName = joinPoint.getSignature().getName();
        String key = "rate_limit:" + methodName + ":" + ip;

        // 2. Tăng bộ đếm trong Redis
        Long count = redisTemplate.opsForValue().increment(key);

        if (count != null && count == 1) {
            // Lần đầu tiên gọi API, set thời gian hết hạn cho bộ đếm
            redisTemplate.expire(key, rateLimit.duration(), TimeUnit.SECONDS);
        }

        if (count != null && count > rateLimit.limit()) {
            log.warn("IP {} bị chặn do spam API {}", ip, methodName);
            throw new AppException(ErrorCode.TOO_MANY_REQUESTS);
        }

        return joinPoint.proceed();
    }
}
