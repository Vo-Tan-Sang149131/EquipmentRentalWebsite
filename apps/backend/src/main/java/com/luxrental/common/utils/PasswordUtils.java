package com.luxrental.common.utils;

import static com.luxrental.common.constants.ValidationConstants.PASSWORD_PATTERN;

public class PasswordUtils {

    public boolean isValidPassword(String password) {
        return password.matches(PASSWORD_PATTERN);
    }
}
