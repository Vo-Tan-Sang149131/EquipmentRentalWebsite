package com.luxrental.controller.product.dto.device.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeviceRequest {
    @NotNull(message = "{product_id.not.null}")
    private Long productId;

    @NotBlank(message = "{serial_number.not.blank}")
    private String serialNumber;

    @NotNull(message = "{condition_percent.not.null}")
    private Integer conditionPercent;

    @NotNull(message = "{price_per_day.not.null}")
    private BigDecimal pricePerDay;

    @NotNull(message = "{deposit_value.not.null}")
    private BigDecimal depositValue;

    // Primary image with type REAL_SHOT
    @NotBlank(message = "{primary_image.not.blank}")
    private String primaryImageUrl;

    // Additional images with type REAL_SHOT or SERIAL_PROOF
    private List<DeviceImageRequest> subImages;
}
