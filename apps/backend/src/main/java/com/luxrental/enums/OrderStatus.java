package com.luxrental.enums;

import lombok.Getter;

@Getter
public enum OrderStatus {

    PENDING_PAYMENT("Pending", "Order is pending and awaiting confirmation"),
    PAID("Paid", "Order has been fully paid"),
    CONFIRMED("Confirmed", "Order has been confirmed by the owner"),
    PICKED_UP("Picked Up", "Order has been picked up by the renter"),
    CANCELLED("Cancelled", "Order has been cancelled by the renter or owner"),
    RETURNED("Returned", "Order has been returned by the renter"),
    OVERDUE("Overdue", "Order has been overdue and needs attention");

    private final String label;
    private final String value;

    OrderStatus(String label, String value) {
        this.label = label;
        this.value = value;
    }

}
