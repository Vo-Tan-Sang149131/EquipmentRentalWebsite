package com.luxrental.enums;

import lombok.Getter;

@Getter
public enum PaymentMethod {

    VNPAY("VNPAY", "Payment via VNPAY"),
    MOMO("MOMO", "Payment via MOMO"),
    BANK_TRANSFER("Bank Transfer", "Payment via Bank Transfer"),
    CASH("Cash", "Payment via Cash");

    private final String label;
    private final String value;

    private PaymentMethod(String label, String value) {
        this.label = label;
        this.value = value;
    }
}
