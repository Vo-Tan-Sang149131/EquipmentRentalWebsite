package com.luxrental.controller;

import com.luxrental.common.dto.MyApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public abstract class BaseController {
    protected <T> ResponseEntity<MyApiResponse<T>> createResponse(HttpStatus status, T data) {
        MyApiResponse<T> response = MyApiResponse.<T>builder()
            .appCode(1000)
            .result(data)
            .build();
        return ResponseEntity.status(status).body(response);
    }

    // This method is the extension of the previous one, allowing you to specify a custom message and code
    protected <T> ResponseEntity<MyApiResponse<T>> createResponse(HttpStatus status, int code, String message, T data) {
        MyApiResponse<T> response = MyApiResponse.<T>builder()
            .appCode(code)
            .message(message)
            .result(data)
            .build();
        return ResponseEntity.status(status).body(response);
    }
}
