package com.luxrental.controller.product.dto.device.request;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class DeviceUpdateRequest {
    private BigDecimal pricePerDay;
    private BigDecimal depositValue;
    private String description;
}

