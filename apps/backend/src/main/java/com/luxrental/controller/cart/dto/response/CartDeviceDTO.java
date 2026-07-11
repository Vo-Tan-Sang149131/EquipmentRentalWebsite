package com.luxrental.controller.cart.dto.response;

import java.math.BigDecimal;

public record CartDeviceDTO(
    Long id,
    String name,
    String primaryImageUrl,
    String ownerName,
    BigDecimal pricePerDay,
    BigDecimal depositValue
) {
}
