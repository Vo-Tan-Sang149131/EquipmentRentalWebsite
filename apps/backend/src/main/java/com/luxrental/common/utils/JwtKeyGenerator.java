package com.luxrental.common.utils; // Thay đổi package cho đúng với cấu trúc dự án của bạn

import java.security.SecureRandom;
import java.util.Base64;

public class JwtKeyGenerator {
    public static void main(String[] args) {
        // Create a new array byte with the length about 32 bytes (256 bits) or 64 bytes (512 bits)
        // HS256 Algorithm requires at least 256 bits
        byte[] apiKeySecretBytes = new byte[64];

        // Use SecureRandom to generate random bytes to enhance security
        SecureRandom secureRandom = new SecureRandom();
        secureRandom.nextBytes(apiKeySecretBytes);

        // Encode the byte array to a Base64 string to make it easier to store and use
        String secretKey = Base64.getEncoder().encodeToString(apiKeySecretBytes);

        // Print the string to the console for you to copy
        System.out.println("====================================================================");
        System.out.println("Your JWT Secret Key:");
        System.out.println("====================================================================");
        System.out.println(secretKey);
        System.out.println("====================================================================");
    }
}
