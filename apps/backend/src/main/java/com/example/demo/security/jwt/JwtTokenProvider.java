package com.example.demo.security.jwt;

import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import javax.crypto.SecretKey;

import com.example.demo.security.normal.CustomUserDetails;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

@ConfigurationProperties(prefix = "app.jwt")
@Getter
@Setter
@Component
@Slf4j
public class JwtTokenProvider {
    private String secretKey;
    private long accessTokenExpirationMs;
    private long refreshTokenExpirationMs;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(Authentication authentication) {
        Date expiryDate = new Date(System.currentTimeMillis() + accessTokenExpirationMs);
        String username = authentication.getName();

        List<String> roles = authentication.getAuthorities()
            .stream()
            .map(GrantedAuthority::getAuthority)
            .toList();

        // FIX: Extract userId and email from Principal
        Long userId = extractUserIdFromPrincipal(authentication.getPrincipal());
        String email = extractEmailFromPrincipal(authentication.getPrincipal());

        return Jwts.builder()
            .subject(username)
            .claim("userId", userId)  // ← LƯU userId VÀO TOKEN
            .claim("roles", roles)
            .claim("email", email)
            .issuedAt(new Date())
            .expiration(expiryDate)
            .signWith(getSigningKey())
            .compact();
    }

    // NEW METHOD: Extract userId từ Principal
    private Long extractUserIdFromPrincipal(Object principal) {
        if (principal instanceof CustomUserDetails customUser) {
            return customUser.getId();
        }
        log.warn("Cannot extract userId from principal type: {}", principal.getClass().getSimpleName());
        return null;
    }

    private String extractEmailFromPrincipal(Object principal) {
        if (principal instanceof CustomUserDetails customUser) {
            return customUser.getEmail();
        }
        if (principal instanceof org.springframework.security.oauth2.core.user.OAuth2User oAuth2User) {
            return oAuth2User.getAttribute("email");
        }
        if (principal instanceof org.springframework.security.core.userdetails.UserDetails userDetails) {
            return userDetails.getUsername();
        }
        return null;
    }

    public String generateTokenFromUsername(String username, Collection<String> roles, String email) {
        Date expiryDate = new Date(System.currentTimeMillis() + accessTokenExpirationMs);
        return Jwts.builder()
            .subject(username)
            .claim("roles", roles)
            .claim("email", email)
            .issuedAt(new Date())
            .expiration(expiryDate)
            .signWith(getSigningKey())
            .compact();
    }

    public String getUsernameFromToken(String token) {
        try {
            return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
        } catch (JwtException | IllegalArgumentException e) {
            log.error("Failed to get username from JWT token: {}", e.getMessage());
            return null;
        }
    }

    // NEW METHOD: Extract userId từ token
    public Long getUserIdFromToken(String token) {
        try {
            Object userIdObj = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("userId");

            if (userIdObj != null) {
                return Long.valueOf(userIdObj.toString());
            }
            return null;
        } catch (JwtException | IllegalArgumentException e) {
            log.error("Failed to get userId from JWT token: {}", e.getMessage());
            return null;
        }
    }

    @SuppressWarnings("unchecked")
    public List<String> getRolesFromToken(String token) {
        try {
            return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("roles", List.class);
        } catch (JwtException | IllegalArgumentException e) {
            log.error("Failed to get role from JWT token: {}", e.getMessage());
            return List.of();
        }
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.error("Expired JWT token: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("Unsupported JWT token: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.error("Malformed JWT token: {}", e.getMessage());
        } catch (JwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }

    public Long getExpirationTime() {
        return accessTokenExpirationMs;
    }

    public Date getExpirationDateFromToken(String token) {
        try {
            return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration();
        } catch (JwtException | IllegalArgumentException e) {
            log.error("Failed to get expiration date from JWT token: {}", e.getMessage());
            throw new AppException(ErrorCode.INVALID_KEY);
        }
    }

    public Long getRefreshTokenExpirationTime() {
        return refreshTokenExpirationMs;
    }
}
