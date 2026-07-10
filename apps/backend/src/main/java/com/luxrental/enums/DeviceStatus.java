package com.luxrental.enums;

import lombok.Getter;

@Getter
public enum DeviceStatus {

    PENDING_APPROVAL("Pending Approval", "Product item is pending approval"),
    APPROVED("Approved", "Product item has been approved"),
    REJECTED("Rejected", "Product item has been rejected"),
    HIDDEN("Hidden", "Product item is hidden from public view");


    private final String label;
    private final String value;

    DeviceStatus(String label, String value) {
        this.label = label;
        this.value = value;
    }
}
