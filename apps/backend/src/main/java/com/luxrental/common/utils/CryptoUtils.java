package com.luxrental.common.utils;

import org.springframework.security.crypto.encrypt.TextEncryptor;

public class CryptoUtils {

    private final TextEncryptor textEncryptor;

    public CryptoUtils(TextEncryptor textEncryptor) {
        this.textEncryptor = textEncryptor;
    }

    public String encrypt(String plainText) {
        if (plainText == null) return null;
        return textEncryptor.encrypt(plainText);
    }

    public String decrypt(String cipherText) {
        if (cipherText == null) return null;
        return textEncryptor.decrypt(cipherText);
    }
}
