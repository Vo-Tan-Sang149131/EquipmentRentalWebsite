package com.luxrental.enums;

import lombok.Getter;

@Getter
public enum RoleType {
    OWNER("Owner", "User with the role of owner, who can list products and manage orders"),
    RENTER("Renter", "User with the role of renter, who can rent products"),
    ADMIN("Admin", "User with the role of admin, who has full access to the system");

    private final String label;
    private final String value;

    RoleType(String label, String value) {
        this.label = label;
        this.value = value;
    }
}
