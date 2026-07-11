package com.luxrental.enums;

import lombok.Getter;

@Getter
public enum CartItemStatus {

    ACTIVE("Active", "Cart item is active"),
    EXPIRED("Expired", "Cart item has expired"),
    CHECKED_OUT("Checked Out", "Cart item has been checked out");

    private final String label;
    private final String value;

    CartItemStatus(String label, String value) {
        this.label = label;
        this.value = value;
    }
}
