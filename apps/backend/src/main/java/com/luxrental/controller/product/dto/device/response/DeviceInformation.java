package com.luxrental.controller.product.dto.device.response;

import java.math.BigDecimal;
import java.util.List;

public record DeviceInformation(
    Long id,
    Long ownerId,
    int conditionPercent,
    String availability,
    BigDecimal pricePerDay,
    BigDecimal depositValue,
    BigDecimal insurance,
    List<DeviceImageDTO> images,
    List<String> bookDatesStr) {
}

