package com.luxrental.exception;

import lombok.Getter;

@Getter
public class AppException extends RuntimeException {

    private final ErrorCode errorCode;
    private String message;

    public AppException(ErrorCode errorCode) {
        super(errorCode.getKeyMessage()); // Move up to super class
        this.errorCode = errorCode;
    }

    public AppException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
        this.message = message;
    }
}
