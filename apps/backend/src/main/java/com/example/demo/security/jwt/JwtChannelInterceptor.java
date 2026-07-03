package com.example.demo.security.jwt;

import com.example.demo.security.normal.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtChannelInterceptor implements ChannelInterceptor {

    private final JwtTokenProvider tokenProvider;
    private final UserDetailsService userDetailsService;

    @Override
    public Message<?> preSend(@NonNull Message<?> message, @NonNull MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            String bearerToken = accessor.getFirstNativeHeader("Authorization");

            if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
                String token = bearerToken.substring(7);

                try {
                    if (tokenProvider.validateToken(token)) {
                        String username = tokenProvider.getUsernameFromToken(token);
                        Long userId = tokenProvider.getUserIdFromToken(token);
                        List<String> roles = tokenProvider.getRolesFromToken(token);

                        // STRATEGY 1: Nếu token có userId (Traditional login via JWT)
                        if (userId != null) {
                            List<SimpleGrantedAuthority> authorities = roles.stream()
                                .map(SimpleGrantedAuthority::new)
                                .collect(Collectors.toList());

                            CustomUserDetails userDetails = new CustomUserDetails(
                                username,
                                userId,
                                authorities
                            );

                            UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(userDetails, null, authorities);

                            accessor.setUser(authentication);
                            log.info("WebSocket Authenticated (from token) thành công cho user: {} (ID: {})", username, userId);
                            return message;
                        }

                        // STRATEGY 2: Fallback - Query DB nếu không có userId
                        log.debug("userId not found in WebSocket token, querying database for user: {}", username);
                        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                        if (!(userDetails instanceof CustomUserDetails customUserDetails)) {
                            log.error("WebSocket: UserDetails không phải CustomUserDetails!");
                            return message;
                        }

                        List<SimpleGrantedAuthority> authorities = roles.stream()
                            .map(SimpleGrantedAuthority::new)
                            .collect(Collectors.toList());

                        UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(customUserDetails, null, authorities);

                        accessor.setUser(authentication);
                        log.info("WebSocket Authenticated (from DB) thành công cho user: {} (ID: {})", username, customUserDetails.getId());
                    }
                } catch (Exception e) {
                    log.error("Xác thực JWT trên WebSocket thất bại: {}", e.getMessage());
                }
            }
        }
        return message;
    }
}
