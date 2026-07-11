package com.luxrental.config.crypto;

import com.luxrental.common.utils.CryptoUtils;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.encrypt.Encryptors;
import org.springframework.security.crypto.encrypt.TextEncryptor;

@Configuration
@EnableConfigurationProperties(CryptoProperties.class)
public class CryptoConfig {

    @Bean
    public TextEncryptor textEncryptor(CryptoProperties props) {
        return Encryptors.text(props.getSecretKey(), props.getSalt());
    }

    @Bean
    public CryptoUtils cryptoUtil(TextEncryptor textEncryptor) {
        return new CryptoUtils(textEncryptor);
    }
}
