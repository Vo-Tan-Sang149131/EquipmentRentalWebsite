package com.luxrental.service.common;

import com.luxrental.exception.AppException;
import com.luxrental.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final StringRedisTemplate redisTemplate;

    public String createResetToken(String email) {
        String token = UUID.randomUUID().toString();
        String redisKey = "reset_token:" + token;
        redisTemplate.opsForValue().set(redisKey, email, 15, TimeUnit.MINUTES);
        return token;
    }

    // If the token is valid, return the email associated with it
    public String validateToken(String token) {
        String redisKey = "reset_token:" + token;
        String email = redisTemplate.opsForValue().get(redisKey);
        if (email == null) {
            throw new AppException(ErrorCode.TOKEN_INVALID_OR_EXPIRED);
        }
        return email;
    }

    public void deleteToken(String token) {
        String redisKey = "reset_token:" + token;
        redisTemplate.delete(redisKey);
    }
}
