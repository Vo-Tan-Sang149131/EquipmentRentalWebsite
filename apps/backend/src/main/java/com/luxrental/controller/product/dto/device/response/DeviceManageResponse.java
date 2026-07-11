package com.luxrental.controller.product.dto.device.response;

import com.luxrental.controller.product.dto.device.request.DeviceImageRequest;

import java.math.BigDecimal;
import java.util.List;

public record DeviceManageResponse(
    Long id,
    Long productId,
    String productName,
    String serialNumber,
    Integer conditionPercent,
    BigDecimal pricePerDay,
    BigDecimal depositValue,
    String status, // PENDING_APPROVAL, APPROVED, REJECTED
    List<DeviceImageRequest> allImages
) {
}
