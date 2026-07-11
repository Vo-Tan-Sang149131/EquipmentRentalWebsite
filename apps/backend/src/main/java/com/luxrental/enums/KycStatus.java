package com.luxrental.enums;

import lombok.Getter;

@Getter
public enum KycStatus {

    PENDING("Pending", "KYC is pending"),
    VERIFIED("Verified", "KYC has been verified"),
    REJECTED("Rejected", "KYC has been rejected");

    private final String label;
    private final String value;

    KycStatus(String label, String value) {
        this.label = label;
        this.value = value;
    }
}
