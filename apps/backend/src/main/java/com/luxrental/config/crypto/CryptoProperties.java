package com.luxrental.config.crypto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Setter
@Getter
@ConfigurationProperties(prefix = "app.crypto")
public class CryptoProperties {
    private String secretKey;
    private String salt;

}
