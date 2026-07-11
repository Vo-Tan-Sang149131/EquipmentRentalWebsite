package com.luxrental.common.constants;

public class ValidationConstants {

    public static final String USERNAME_PATTERN = "^[a-zA-Z0-9_]+$"; // Username must be alphanumeric and can include underscores
    public static final String PASSWORD_PATTERN = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";
    public static final String PHONE_NUMBER_PATTERN = "^[0-9]{10}$"; // 10 digits only
}
