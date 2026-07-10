package com.luxrental.controller.product.dto.device.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeviceEditResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String serialNumber;
    private Integer conditionPercent;
    private BigDecimal pricePerDay;
    private BigDecimal depositValue;
    private String status;
    private List<DeviceImageDTO> images;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DeviceImageDTO {
        private Long id;
        private String imageUrl;
        private boolean isPrimary;
    }
}

