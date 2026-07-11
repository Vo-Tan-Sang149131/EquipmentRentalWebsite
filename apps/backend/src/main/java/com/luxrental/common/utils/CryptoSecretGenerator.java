package com.luxrental.common.utils;

import java.security.SecureRandom;
import java.util.HexFormat;

public class CryptoSecretGenerator {
    public static void main(String[] args) {
        // 32 bytes = 256 bits, Standard for AES encryption
        byte[] cryptoSecretBytes = new byte[32];

        // Generate a random byte array to use as the cryptographic secret key
        SecureRandom secureRandom = new SecureRandom();
        secureRandom.nextBytes(cryptoSecretBytes);

        // Convert the byte array to a hexadecimal string for storage
        String secretKey = HexFormat.of().formatHex(cryptoSecretBytes);

        System.out.println("====================================================================");
        System.out.println("Your Crypto Secret Key generated successfully:");
        System.out.println("====================================================================");
        System.out.println(secretKey);
        System.out.println("====================================================================");
    }
}
