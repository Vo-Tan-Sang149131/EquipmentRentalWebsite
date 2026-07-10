package com.luxrental.config.web;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "vnpay")
@Data
public class VnPayConfig {
    private boolean enabled;
    private String tmnCode;
    private String hashSecret;
    private String payUrl;
    private String queryUrl;
    private String returnUrl;
    private String ipnUrl;
    private String version;
    private String command;
    private String currCode;
    private String locale;
    private String orderType;
    private int expireMinutes;
}
