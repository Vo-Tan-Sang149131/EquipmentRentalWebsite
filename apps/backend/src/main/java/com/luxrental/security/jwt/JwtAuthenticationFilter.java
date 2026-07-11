package com.luxrental.security.jwt;

import java.io.IOException;
import java.util.List;

import com.luxrental.common.dto.MyApiResponse;
import com.luxrental.exception.ErrorCode;
import com.luxrental.security.normal.CustomUserDetails;
import com.luxrental.security.normal.CustomUserDetailsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jspecify.annotations.NonNull;
import org.slf4j.MDC;
import org.springframework.context.MessageSource;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final StringRedisTemplate redisTemplate;
    private final MessageSource messageSource;
    private final CustomUserDetailsService customUserDetailsService;

    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) {
        String path = request.getServletPath();
        return path.startsWith("/swagger-ui")
            || path.startsWith("/v3/api-docs")
            || path.startsWith("/swagger-resources")
            || path.startsWith("/webjars")
            || path.startsWith("/h2-console")
            || path.startsWith("/api/auth");
    }

    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);

            if (!StringUtils.hasText(jwt)) {
                filterChain.doFilter(request, response);
                return;
            }

            // Check blacklist
            if (Boolean.TRUE.equals(redisTemplate.hasKey("blacklisted:" + jwt))) {
                log.warn("Token be logout (Blacklisted): {}", jwt);
                sendErrorResponse(response, ErrorCode.UNAUTHORIZED);
                return;
            }

            // Validate token
            if (jwtTokenProvider.validateToken(jwt)) {
                String username = jwtTokenProvider.getUsernameFromToken(jwt);
                Long userId = jwtTokenProvider.getUserIdFromToken(jwt);
                List<String> roles = jwtTokenProvider.getRolesFromToken(jwt);

                MDC.put("user", username);

                // STRATEGY 1: If userId is present in token, use it to query DB
                if (userId != null) {
                    CustomUserDetails userDetails = buildCustomUserDetailsFromToken(username, userId, roles);
                    List<SimpleGrantedAuthority> authorities = roles.stream().map(SimpleGrantedAuthority::new).toList();
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, authorities);
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    log.debug("Set Spring Security Authenticated user from token: {} (ID: {})", username, userId);

                    filterChain.doFilter(request, response);
                    return;
                }

                // STRATEGY 2: For OAuth2 login, userId is not present in token, query DB
                log.debug("userId not found in token, querying database for user: {}", username);
                UserDetails userDetailsFromDb = customUserDetailsService.loadUserByUsername(username);

                if (!(userDetailsFromDb instanceof CustomUserDetails customUserDetails)) {
                    log.error("UserDetails từ database không phải CustomUserDetails!");
                    sendErrorResponse(response, ErrorCode.UNAUTHORIZED);
                    return;
                }

                List<SimpleGrantedAuthority> authorities = roles.stream().map(SimpleGrantedAuthority::new).toList();
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(customUserDetails, null, authorities);
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);

                log.debug("Set Spring Security Authenticated user from database: {} (ID: {})", username, customUserDetails.getId());
            }

        } catch (Exception ex) {
            log.error("Could not set user authentication in security context", ex);
            sendErrorResponse(response, ErrorCode.UNAUTHORIZED);
            return;
        }

        filterChain.doFilter(request, response);
    }


    /**
     * Build CustomUserDetails from token claims but not from database.
     * Apply to traditional login via JWT filter
     */
    private CustomUserDetails buildCustomUserDetailsFromToken(String username, Long userId, List<String> roles) {
        List<SimpleGrantedAuthority> authorities = roles.stream()
            .map(SimpleGrantedAuthority::new)
            .toList();

        // Create abstract custom user details
        return new CustomUserDetails(
            username,
            userId,
            authorities
        );
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    private void sendErrorResponse(HttpServletResponse response, ErrorCode errorCode) throws IOException {
        String localizedMessage = messageSource.getMessage(
            errorCode.getKeyMessage(),
            null,
            org.springframework.context.i18n.LocaleContextHolder.getLocale()
        );

        MyApiResponse<Object> errorApiResponse = MyApiResponse.builder()
            .appCode(errorCode.getCode())
            .message(localizedMessage)
            .build();

        response.setStatus(errorCode.getStatusCode().value());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String jsonResponse = new ObjectMapper().writeValueAsString(errorApiResponse);
        response.getWriter().write(jsonResponse);
    }
}
