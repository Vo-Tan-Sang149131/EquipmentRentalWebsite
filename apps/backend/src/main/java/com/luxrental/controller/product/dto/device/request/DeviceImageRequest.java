package com.luxrental.controller.product.dto.device.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record DeviceImageRequest(
    @NotBlank(message = "{image_url.not.blank}")
    String imageUrl,

    @NotBlank(message = "{image_type.not.blank}")
    @Pattern(regexp = "REAL_SHOT|SERIAL_PROOF", message = "{image_type.invalid}")
    String imageType
) {
}
