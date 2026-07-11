package com.luxrental.enums;

import lombok.Getter;

@Getter
public enum PaymentStatus {

    PENDING("Pending", "Payment is pending"),
    SUCCESS("Success", "Payment has been successful"),
    FAILED("Failed", "Payment has failed"),
    REFUNDED("Refunded", "Payment has been refunded");

    private final String label;
    private final String value;

    PaymentStatus(String label, String value) {
        this.label = label;
        this.value = value;
    }
}
