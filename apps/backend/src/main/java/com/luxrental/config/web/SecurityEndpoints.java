package com.luxrental.config.web;

public final class SecurityEndpoints {

    private SecurityEndpoints() {
    }

    // Endpoints that should be publicly accessible (permitAll)
    public static final String[] PUBLIC_MATCHERS = {
        "/auth/**",
        "/products/**",
        "/lookups/**",
        "/devices/*/detail",
        "/swagger-ui/**",
        "/v3/api-docs/**",
        "/swagger-resources/**",
        "/webjars/**",
        "/actuator/**",
        "/ws-chat/**",
        "/h2-console/**"
    };

    // Endpoints that should bypass JWT filter entirely
    public static final String[] JWT_FILTER_EXCLUDED = {
        "/swagger-ui",
        "/v3/api-docs",
        "/swagger-resources",
        "/webjars",
        "/h2-console",
        "/auth"
    };
}
