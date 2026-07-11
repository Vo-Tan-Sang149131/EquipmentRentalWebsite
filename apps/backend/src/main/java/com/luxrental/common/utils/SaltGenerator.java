package com.luxrental.common.utils;

import java.security.SecureRandom;
import java.util.HexFormat;

public class SaltGenerator {
    public static void main(String[] args) {
        byte[] saltBytes = new byte[16];
        new SecureRandom().nextBytes(saltBytes);
        String salt = HexFormat.of().formatHex(saltBytes);
        System.out.println(salt);
    }
}
