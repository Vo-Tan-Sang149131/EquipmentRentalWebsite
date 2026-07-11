package com.luxrental.common.utils;

public class ValidationUtils {
    public static String extractFieldName(String propertyPath) {
        if (propertyPath == null) return "";

        // If the property path contains dots, we take the last segment as the field name
        if (propertyPath.contains(".")) {
            return propertyPath.substring(propertyPath.lastIndexOf(".") + 1);
        }
        return propertyPath;
    }
}
