package com.luxrental.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import lombok.Getter;

@Getter
public enum ErrorCode {
    // ==== Common / System ====
    INVALID_KEY(9999, "error.invalid.key", HttpStatus.BAD_REQUEST),
    UNCATEGORIZED_EXCEPTION(9998, "error.uncategorized", HttpStatus.INTERNAL_SERVER_ERROR),
    SERVICE_UNAVAILABLE(1019, "error.service_unavailable", HttpStatus.SERVICE_UNAVAILABLE),

    // ==== Auth / User ====
    DEFAULT_ROLE_NOT_FOUND(1001, "error.default_role.not_found", HttpStatus.NOT_FOUND),
    USER_EXISTED(1002, "error.user.existed", HttpStatus.CONFLICT),
    USER_NOT_FOUND(1003, "error.user.not_found", HttpStatus.NOT_FOUND),
    PASSWORD_INCORRECT(1004, "error.password.incorrect", HttpStatus.BAD_REQUEST),
    PASSWORD_REQUIRED(1005, "error.password.required", HttpStatus.BAD_REQUEST),
    PASSWORD_NOT_SET(1006, "error.password.not_set", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED(1007, "error.unauthorized", HttpStatus.UNAUTHORIZED),
    FORBIDDEN(1008, "error.forbidden", HttpStatus.FORBIDDEN),
    VALIDATION_ERROR(1009, "error.validation", HttpStatus.BAD_REQUEST),
    UNPROCESSABLE(1010, "error.unprocessable", HttpStatus.UNPROCESSABLE_CONTENT),
    TOKEN_INVALID_OR_EXPIRED(1012, "error.token.invalid_or_expired", HttpStatus.UNAUTHORIZED),

    EMAIL_ALREADY_EXISTS(1101, "error.email.already_exists", HttpStatus.CONFLICT),
    PHONE_ALREADY_EXISTS(1102, "error.phone.already_exists", HttpStatus.CONFLICT),
    SOCIAL_ACCOUNT_ALREADY_LINKED(1103, "error.social_account.already_linked", HttpStatus.CONFLICT),
    USER_DISABLED(1104, "error.user.disabled", HttpStatus.FORBIDDEN),
    USER_NOT_VERIFIED(1105, "error.user.not_verified", HttpStatus.FORBIDDEN),

    // ==== KYC ====
    KYC_ALREADY_PENDING(1011, "error.kyc_already_pending", HttpStatus.CONFLICT),
    KYC_NOT_FOUND(1201, "error.kyc.not_found", HttpStatus.NOT_FOUND),
    KYC_ALREADY_VERIFIED(1202, "error.kyc.already_verified", HttpStatus.CONFLICT),
    KYC_REJECTED(1203, "error.kyc.rejected", HttpStatus.FORBIDDEN),

    // ==== Roles ====
    ROLE_NOT_FOUND(1301, "error.role.not_found", HttpStatus.NOT_FOUND),
    ROLE_ALREADY_ASSIGNED(1302, "error.role.already_assigned", HttpStatus.CONFLICT),

    // ==== Products & Devices ====
    PRODUCT_NOT_FOUND(1401, "error.product.not_found", HttpStatus.NOT_FOUND),
    DEVICE_NOT_FOUND(1402, "error.device.not_found", HttpStatus.NOT_FOUND),
    DEVICE_NOT_APPROVED(1403, "error.device.not_approved", HttpStatus.FORBIDDEN),
    SERIAL_NUMBER_DUPLICATED(1404, "error.device.serial_number_duplicated", HttpStatus.CONFLICT),
    DEVICE_ALREADY_BOOKED(1405, "error.device.already_booked", HttpStatus.CONFLICT),

    // ==== Orders ====
    ORDER_NOT_FOUND(1501, "error.order.not_found", HttpStatus.NOT_FOUND),
    ORDER_ALREADY_CANCELLED(1502, "error.order.already_cancelled", HttpStatus.CONFLICT),
    ORDER_DATE_INVALID(1503, "error.order.date_invalid", HttpStatus.BAD_REQUEST),
    ORDER_OVERLAP(1504, "error.order.overlap", HttpStatus.CONFLICT),

    // ==== Payments ====
    PAYMENT_NOT_FOUND(1601, "error.payment.not_found", HttpStatus.NOT_FOUND),
    PAYMENT_FAILED(1602, "error.payment.failed", HttpStatus.BAD_REQUEST),
    PAYMENT_ALREADY_REFUNDED(1603, "error.payment.already_refunded", HttpStatus.CONFLICT),

    // ==== Reviews ====
    REVIEW_NOT_FOUND(1701, "error.review.not_found", HttpStatus.NOT_FOUND),
    REVIEW_ALREADY_SUBMITTED(1702, "error.review.already_submitted", HttpStatus.CONFLICT),
    REVIEW_INVALID_TARGET(1703, "error.review.invalid_target", HttpStatus.BAD_REQUEST),

    // ==== Chat ====
    CHAT_ROOM_ALREADY_EXISTS(1801, "error.chat_room.already_exists", HttpStatus.CONFLICT),
    CHAT_ROOM_NOT_FOUND(1802, "error.chat_room.not_found", HttpStatus.NOT_FOUND),
    CHAT_MESSAGE_NOT_FOUND(1803, "error.chat_message.not_found", HttpStatus.NOT_FOUND),
    CHAT_UNAUTHORIZED(1804, "error.chat.unauthorized", HttpStatus.FORBIDDEN),

    // ==== Rate Limit ====
    TOO_MANY_REQUESTS(1901, "error.too_many_requests", HttpStatus.TOO_MANY_REQUESTS),

    NEED_CAPTCHA(2001, "error.need_captcha", HttpStatus.BAD_REQUEST),
    INVALID_CAPTCHA(2002, "error.invalid_captcha", HttpStatus.BAD_REQUEST);

    private final int code;            // Internal code
    private final String keyMessage;   // Key for multi-language
    private final HttpStatusCode statusCode; // Real status code

    ErrorCode(int code, String keyMessage, HttpStatusCode statusCode) {
        this.code = code;
        this.keyMessage = keyMessage;
        this.statusCode = statusCode;
    }
}
