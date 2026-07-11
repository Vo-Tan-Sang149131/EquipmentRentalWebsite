package com.luxrental.config.web;

import com.cloudinary.Cloudinary;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import lombok.extern.slf4j.Slf4j;
import jakarta.annotation.PostConstruct;

import java.util.HashMap;
import java.util.Map;

@Configuration
@ConfigurationProperties(prefix = "cloudinary")
@Data
@Slf4j
public class CloudinaryConfig {

    private String cloudName;
    private String apiKey;
    private String apiSecret;

    // Log the configuration
//    @PostConstruct
//    public void logConfig() {
//        log.info("Cloudinary: {} / {} / {}", cloudName, apiKey, apiSecret);
//    }

    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", this.cloudName);
        config.put("api_key", this.apiKey);
        config.put("api_secret", this.apiSecret);
        return new Cloudinary(config);
    }
}
