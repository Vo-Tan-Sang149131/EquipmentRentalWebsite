package com.example.demo.service.auth;

import com.example.demo.common.annotation.RateLimit;
import com.example.demo.dto.auth.request.ForgotPasswordReq;
import com.example.demo.dto.auth.request.ResetPasswordReq;
import com.example.demo.dto.auth.response.JwtResponse;
import com.example.demo.dto.auth.request.LoginRequest;
import com.example.demo.dto.auth.response.TokenRefreshResponse;
import com.example.demo.entity.User;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.repository.user.UserRepository;
import com.example.demo.security.jwt.JwtTokenProvider;
import com.example.demo.security.UserTokenInfo;
import com.example.demo.service.EmailService;
import com.example.demo.service.TokenService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final AuthenticationManager manager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;

    private final ObjectMapper objectMapper;

    private final EmailService emailService;

    // Use this for dealing with redis, e.g., store refresh tokens, blacklisted tokens, etc.
    private final StringRedisTemplate redisTemplate;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    @RateLimit(limit = 5, duration = 300)
    public JwtResponse login(LoginRequest loginRequest, HttpServletResponse response) {
        try {
            // 1. Verify User Credentials with username and password
            Authentication authentication = manager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );

            // 2. Generate JWT Token if succeeded
            String token = tokenProvider.generateToken(authentication);

            // 3. Retrieve user details from a database and return to the frontend UI
            User user = userRepository.findByUsername(loginRequest.getUsername()).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_FOUND)
            );

            /*
            We will use new Object to store user's role and email' in redis
            so that we not need to query the database every time we need to get the user's role and email.
             */

            // 4. Convert User object to UserTokenInfo object
            List<String> roles = user.getRoles().stream()
                .map(r -> r.getRole().name())
                .toList();

            UserTokenInfo userInfo = UserTokenInfo.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(roles)
                .build();

            String jsonTokenInfo = objectMapper.writeValueAsString(userInfo);

            // Create a refresh token and store it in Redis
            String tokenUuid = UUID.randomUUID().toString();
            String redisKey = String.format("refresh_token:%s:%s", user.getUsername(), tokenUuid);
            long ttl = tokenProvider.getRefreshTokenExpirationTime();
            redisTemplate.opsForValue().set(redisKey, jsonTokenInfo, ttl, TimeUnit.MILLISECONDS);

            // 5. Set redisKey to Cookie
            Cookie cookie = new Cookie("refreshToken", redisKey);
            cookie.setHttpOnly(true);
            cookie.setSecure(false);
            cookie.setPath("/");
            cookie.setMaxAge((int) (ttl / 1000));
            response.addCookie(cookie);

            // Store username to MDC for logging purpose
            MDC.put("user", user.getUsername());

            log.info("Login Successfully");

            // 6. Build and return JWT response
            return JwtResponse.builder()
                .token(token)
                .type("Bearer")
                .expiresIn(tokenProvider.getExpirationTime())
                .username(user.getUsername())
                .roles(roles)
                .build();
        } catch (AuthenticationException e) {
            log.error("Authentication failed: {}", e.getMessage());
            throw new AppException(ErrorCode.UNAUTHORIZED);
        } catch (JsonProcessingException e) {
            log.error("Failed to convert UserTokenInfo to JSON: {}", e.getMessage());
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    public void logout(String authorizationHeader, String redisKeyFromCookie, HttpServletResponse response) {
        // 1. Check and throw Exception if the token is invalid or expired
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // 2. Retrieve token from the header
        String token = authorizationHeader.substring(7);

        // Extra: extract the username from a token and store it to MDC for logging purpose
        try {
            if (tokenProvider.validateToken(token)) {
                String username = tokenProvider.getUsernameFromToken(token);
                MDC.put("user", username);
            }
        } catch (Exception e) {
            log.warn("Cannot extract username from token for MDC logging: {}", e.getMessage());
        }

        try {
            Date expirationDate = tokenProvider.getExpirationDateFromToken(token);
            long expiryTime = expirationDate.getTime(); //
            long currentTime = System.currentTimeMillis();
            long ttl = expiryTime - currentTime;

            if (ttl > 0) {
                // Store token to redis as a key, set expired ttl to the same as
                // the token's remaining time to live (TTL)
                redisTemplate.opsForValue().set("blacklisted:" + token, "true", ttl,
                    TimeUnit.MILLISECONDS);
            }


        } catch (ExpiredJwtException e) {
            // Token expired or invalid
            log.warn("Token has expired or is invalid: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            // Invalid token format cannot be parsed
            throw new AppException(ErrorCode.INVALID_KEY);
        } catch (JwtException e) {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }

        // Even accessToken of user is invalid or expired, we always can remove Session/Cookie that user from Redis
        try {
            // 3. Delete key from redis according to the value get from Cookie
            if (StringUtils.hasText(redisKeyFromCookie)) {
                redisTemplate.delete(redisKeyFromCookie);
                log.info("Refresh token has been released from Redis.");
            }

            // 4. Delete Cookie from a client:
            Cookie cookie = new Cookie("refresh_token", null);
            cookie.setPath("/");
            cookie.setHttpOnly(true);
            cookie.setMaxAge(0);
            response.addCookie(cookie);

            log.info("Logout Successfully");

        } catch (Exception e) {
            log.error("Error clearing session or cookies", e);
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    public TokenRefreshResponse refreshToken(String redisKeyFromCookie, HttpServletResponse response) {

        if (redisKeyFromCookie == null) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // 1. Retrieve json from redis
        String jsonTokenInfo = redisTemplate.opsForValue().get(redisKeyFromCookie);

        if (jsonTokenInfo == null) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        try {
            // 2. Use Jackson to convert a JSON string to a UserTokenInfo object
            UserTokenInfo userInfo = objectMapper.readValue(jsonTokenInfo, UserTokenInfo.class);

            // 3. Generate a new Access Token and Refresh Token
            String newAccessToken = tokenProvider.generateTokenFromUsername(
                userInfo.getUsername(),
                userInfo.getRoles(),
                userInfo.getEmail()
            );

            /*
            Create a turn around cycle of new Token by deleting and then creating a new one:
             */

            // 4. Delete the old Refresh Token from Redis
            redisTemplate.delete(redisKeyFromCookie);

            // 5. Create a new Refresh Token and store it in Redis
            String tokenUuid = UUID.randomUUID().toString();
            String redisKey = String.format("refresh_token:%s:%s", userInfo.getUsername(), tokenUuid);
            long ttl = tokenProvider.getRefreshTokenExpirationTime();
            redisTemplate.opsForValue().set(redisKey, jsonTokenInfo, ttl, TimeUnit.MILLISECONDS);

            // 6. Set redisKey to Cookie:
            Cookie cookie = new Cookie("refreshToken", redisKey);
            cookie.setHttpOnly(true);
            cookie.setSecure(false);
            cookie.setPath("/");
            cookie.setMaxAge((int) (ttl / 1000));
            response.addCookie(cookie);

            log.info("Refresh token has been updated in Redis.");

            // 7. Return the new Access Token and Refresh Token to the client
            return TokenRefreshResponse.builder()
                .accessToken(newAccessToken)
                .build();

        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            log.error("Failed to parse JSON from Redis: {}", redisKeyFromCookie, e);
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    @RateLimit(limit = 3, duration = 300)
    public void forgotPassword(ForgotPasswordReq request) {

        // Store user email to MDC for logging purpose
        MDC.put("user", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
            .orElseGet(() -> {
                log.warn("Email not found: {}", request.getEmail());
                return null;
            });

        if (user != null) {
            // Delegate to tokenService to generate and send the reset token
            String token = tokenService.createResetToken(user.getEmail());
            String resetLink = "http://localhost:5173/reset-password?token=" + token;
            emailService.sendResetPasswordEmail(user.getEmail(), resetLink);
        }

        log.info("Reset password email sent to: {}", request.getEmail());
    }


    @Transactional
    public void resetPassword(ResetPasswordReq request) {
        String email = tokenService.validateToken(request.getToken());

        User user = userRepository.findByEmail(email).orElseThrow(
            () -> new AppException(ErrorCode.USER_NOT_FOUND)
        );

        // Store username of the user to MDC for logging purpose
        MDC.put("user", user.getUsername());

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        tokenService.deleteToken(request.getToken());
        emailService.sendSuccessEmail(email);

        log.info("Password reset successfully for user: {}", user.getUsername());
    }

}
