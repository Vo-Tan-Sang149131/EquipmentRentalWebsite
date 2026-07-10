package com.luxrental.controller.product.dto.core.response;

import java.math.BigDecimal;


public record ProductResponse(
    Long id,
    String name,
    String slug,
    String categoryName,
    String brandName,
    String primaryImageUrl,
    BigDecimal minPricePerDay,
    String status
) {
}
