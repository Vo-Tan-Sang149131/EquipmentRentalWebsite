package com.luxrental.enums;

import lombok.Getter;

@Getter
public enum CalendarStatus {
    BOOKED("Booked", "This product item is booked"),
    OWNER_BLOCK("Owner Block", "This product item is blocked by the owner"),
    MAINTENANCE("Maintenance", "This product item is under maintenance");

    private final String label;
    private final String value;

    CalendarStatus(String label, String value) {
        this.label = label;
        this.value = value;
    }

}
