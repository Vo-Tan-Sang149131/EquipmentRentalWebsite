package com.luxrental.enums;

import lombok.Getter;

@Getter
public enum ImageType {

    REAL_SHOT("Real Shot", "Real shot image"),
    SERIAL_PROOF("Serial Proof", "Serial proof image");

    private final String label;
    private final String value;

    ImageType(String label, String value) {
        this.label = label;
        this.value = value;
    }

}
