package com.luxrental.exception;

import com.luxrental.common.dto.MyApiResponse;
import com.luxrental.common.utils.ValidationUtils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@RequiredArgsConstructor
@Slf4j
public class GlobalExceptionHandler {
    private final MessageSource messageSource;

    // Use for status code of business logic: E.g: 401, 403, 404, 429, 500
    @ExceptionHandler(value = AppException.class)
    public ResponseEntity<MyApiResponse<Object>> handleAppException(AppException e) {
        ErrorCode errorCode = e.getErrorCode();

        // --- CONTROL AND CATEGORY LOGGING ---
        // If just SPAM API or CAPTCHA, log it as INFO level, otherwise log it as ERROR level
        if (errorCode == ErrorCode.TOO_MANY_REQUESTS || errorCode == ErrorCode.NEED_CAPTCHA) {
            log.info("Rate Limiter Triggered: {} - Message: {}", errorCode.name(), e.getMessage());
        } else {
            log.error("Nghiệp vụ ứng dụng gặp lỗi [{}]: {}", errorCode.name(), e.getMessage());
        }

        MyApiResponse<Object> myApiResponse = MyApiResponse.builder()
            .statusCode(errorCode.getCode())
            .message(messageSource.getMessage(errorCode.getKeyMessage(),
                null, LocaleContextHolder.getLocale()))
            .build();

        return ResponseEntity
            .status(errorCode.getStatusCode())
            .body(myApiResponse);
    }

    // Specific case for 400 Bad Request
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public ResponseEntity<MyApiResponse<Object>> handleValidationException(MethodArgumentNotValidException e) {

        // 1. Create a Map to store the errors response to the client
        Map<String, String> errors = new HashMap<>();
        e.getBindingResult().getFieldErrors().forEach(
            error -> {
                String errorField = ValidationUtils.extractFieldName(error.getField());
                errors.put(errorField, error.getDefaultMessage());
            });


        // 2. Encapsulate the errors in a MyApiResponse
        MyApiResponse<Object> myApiResponse = MyApiResponse.builder()
            .statusCode(HttpStatus.BAD_REQUEST.value())
            .message("Validation Failed")
            .result(errors)
            .build();

        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(myApiResponse);
    }

    // Specific case for Constraint Exception
    @ExceptionHandler(value = ConstraintViolationException.class)
    public ResponseEntity<MyApiResponse<Object>> handleConstraintViolationException(ConstraintViolationException e) {
        Map<String, String> errors = new HashMap<>();
        e.getConstraintViolations().forEach(
            violation -> {
                String field = ValidationUtils.extractFieldName(violation.getPropertyPath().toString());
                errors.put(field, violation.getMessage());
            });

        MyApiResponse<Object> myApiResponse = MyApiResponse.builder()
            .statusCode(HttpStatus.BAD_REQUEST.value())
            .message("Validation Failed")
            .result(errors)
            .build();

        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(myApiResponse);
    }

    @ExceptionHandler(value = EntityNotFoundException.class)
    public ResponseEntity<MyApiResponse<Object>> handleEntityNotFoundException(jakarta.persistence.EntityNotFoundException e) {

        MyApiResponse<Object> myApiResponse = MyApiResponse.builder()
            .statusCode(HttpStatus.NOT_FOUND.value())
            .message(e.getMessage())
            .build();

        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(myApiResponse);
    }

    @ExceptionHandler(value = HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<MyApiResponse<Object>> handleMethodNotSupportedException(HttpRequestMethodNotSupportedException e) {

        log.info("Method not allowed: {} | Supported methods: {}", e.getMessage(), e.getSupportedHttpMethods());

        MyApiResponse<Object> myApiResponse = MyApiResponse.builder()
            .statusCode(HttpStatus.METHOD_NOT_ALLOWED.value())
            .message("Phương thức HTTP không được hỗ trợ: " + e.getMethod())
            .build();

        return ResponseEntity
            .status(HttpStatus.METHOD_NOT_ALLOWED)
            .body(myApiResponse);
    }

    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<MyApiResponse<Object>> handleGenericException(Exception e) {

        log.error("Hệ thống gặp lỗi nghiêm trọng (Uncaught Exception): ", e);

        MyApiResponse<Object> myApiResponse = MyApiResponse.builder()
            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
            .message("Hệ thống có lỗi xảy ra, vui lòng thử lại sau.")
            .build();

        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(myApiResponse);
    }
}
