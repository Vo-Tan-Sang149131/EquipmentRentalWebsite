package com.example.demo.exception;

import com.example.demo.dto.MyApiResponse;
import com.example.demo.utils.ValidationUtils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

        // --- GIAI ĐOẠN KIỂM SOÁT VÀ PHÂN LOẠI LOG (QUAN TRỌNG) ---
        // Nếu là lỗi spam API hoặc bắt giải CAPTCHA, chỉ log nhẹ dòng INFO (không in đống Stack Trace dài)
        if (errorCode == ErrorCode.TOO_MANY_REQUESTS || errorCode == ErrorCode.NEED_CAPTCHA) {
            log.info("Rate Limiter Triggered: {} - Message: {}", errorCode.name(), e.getMessage());
        } else {
            // Các lỗi logic nghiệp vụ nghiêm trọng khác (ví dụ lỗi DB ngầm) mới in ERROR kèm chi tiết để debug
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

    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<MyApiResponse<Object>> handleGenericException(Exception e) {

        // BẮT BUỘC PHẢI LOG ERROR Ở ĐÂY: Để đẩy toàn bộ dấu vết (Stack Trace) vào file error.log phục vụ việc fix bug
        log.error("Hệ thống gặp lỗi nghiêm trọng (Uncaught Exception): ", e);

        MyApiResponse<Object> myApiResponse = MyApiResponse.builder()
            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
            .message("Hệ thống có lỗi xảy ra, vui lòng thử lại sau.") // Không trả e.getMessage() ra ngoài cho Client để tránh lộ thông tin bảo mật của code
            .build();

        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(myApiResponse);
    }
}
