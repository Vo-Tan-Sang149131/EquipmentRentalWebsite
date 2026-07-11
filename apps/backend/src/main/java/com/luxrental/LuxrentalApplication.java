package com.luxrental;

import com.luxrental.config.web.VnPayConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync // Enable Asynchronous Task for the whole application
@EnableConfigurationProperties(VnPayConfig.class)
public class LuxrentalApplication {

    public static void main(String[] args) {
        SpringApplication.run(LuxrentalApplication.class, args);
    }

}
