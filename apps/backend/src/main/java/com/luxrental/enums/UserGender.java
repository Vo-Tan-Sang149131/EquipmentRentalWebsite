package com.luxrental.enums;

import lombok.Getter;

@Getter
public enum UserGender {

    MALE("Male", "Male"),
    FEMALE("Female", "Female"),
    OTHER("Other", "Other");

    private final String label;
    private final String value;

    UserGender(String label, String value) {
        this.label = label;
        this.value = value;
    }
}
