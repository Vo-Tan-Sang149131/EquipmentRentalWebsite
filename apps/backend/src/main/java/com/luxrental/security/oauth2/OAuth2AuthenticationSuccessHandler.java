package com.luxrental.security.oauth2;

import com.luxrental.entity.user.User;
import com.luxrental.repository.user.UserRepository;
import com.luxrental.security.UserTokenInfo;
import com.luxrental.security.jwt.JwtTokenProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final StringRedisTemplate redisTemplate;

    @Value("${app.oauth2.authorized-redirect-uri}")
    private String authorizedRedirectUri;

    @Override
    public void onAuthenticationSuccess(@NonNull HttpServletRequest request, HttpServletResponse response,
                                        @NonNull Authentication authentication) throws IOException, ServletException {


        if (response.isCommitted()) {
            log.debug("Response has already been committed. Unable to redirect to {}", authorizedRedirectUri);
            return;
        }


        try {

            MDC.put("user", authentication.getName());

            log.info("OAuth2 Đăng nhập thành công! Tiến hành khởi tạo Token và cấu trúc Redis.");

            // 1. Create JWT Token
            String accessToken = jwtTokenProvider.generateToken(authentication);

            // 2. Extract User information from the Authentication object
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ServletException("Không tìm thấy người dùng mạng xã hội trong hệ thống."));

            List<String> rolesList = user.getRoles().stream()
                .map(r -> r.getRole().name())
                .toList();

            // 3. Build UserTokenInfo object
            UserTokenInfo userInfo = UserTokenInfo.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(rolesList)
                .build();

            String jsonTokenInfo = objectMapper.writeValueAsString(userInfo);

            // 4. Generate Refresh Token and store in Redis
            String tokenUuid = UUID.randomUUID().toString();
            String redisKey = String.format("refresh_token:%s:%s", user.getUsername(), tokenUuid);
            long ttl = jwtTokenProvider.getRefreshTokenExpirationTime();
            redisTemplate.opsForValue().set(redisKey, jsonTokenInfo, ttl, TimeUnit.MILLISECONDS);

            // 5. Put the redisKey into Cookie:
            Cookie cookie = new Cookie("refreshToken", redisKey);
            cookie.setHttpOnly(true); // Prevents client-side JavaScript from accessing the cookie
            cookie.setSecure(false); // Set to true if using HTTPS
            cookie.setPath("/"); // Set the cookie path to the root of the application
            cookie.setMaxAge((int) (ttl / 1000)); // Convert milliseconds to seconds
            response.addCookie(cookie);

            String rolesString = String.join(",", rolesList);

            // 6. Build URL with query parameters
            String targetUrl = UriComponentsBuilder.fromUriString(authorizedRedirectUri)
                .queryParam("token", accessToken)
                .queryParam("username", user.getUsername())
                .queryParam("roles", rolesString)
                .build().toUriString();

            // 7. Redirect to the target URL
            getRedirectStrategy().sendRedirect(request, response, targetUrl);

            log.info("Login Successful! Redirecting to {}", targetUrl);
        } finally {
            // Clear MDC after processing to avoid leaking user information
            MDC.clear();
        }
    }
}
