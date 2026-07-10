package com.luxrental.config.crypto;

import com.luxrental.common.utils.CryptoUtils;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AesConverterInitializer {

    private final CryptoUtils cryptoUtil;

    public AesConverterInitializer(CryptoUtils cryptoUtil) {
        this.cryptoUtil = cryptoUtil;
    }

    @PostConstruct
    public void init() {
        AesDataConverter.setCryptoUtil(cryptoUtil);
    }
}
