package com.luxrental.security.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jspecify.annotations.NonNull;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE) // Đảm bảo chạy đầu tiên để mọi log đều có traceId/ip
public class LoggingContextFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        try {
            // Lấy IP
            String ip = request.getRemoteAddr();
            MDC.put("ip", ip);

            // Lấy traceId cho mỗi request
            MDC.put("traceId", UUID.randomUUID().toString());

            // Gán mặc định cho user chưa login
            MDC.put("user", "anonymous");

            filterChain.doFilter(request, response);
        } finally {
            // Chỉ xóa khi request đã kết thúc hoàn toàn
            MDC.clear();
        }
    }
}
