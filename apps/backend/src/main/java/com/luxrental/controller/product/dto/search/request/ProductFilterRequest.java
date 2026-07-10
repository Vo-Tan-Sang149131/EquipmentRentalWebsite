package com.luxrental.controller.product.dto.search.request;

import java.math.BigDecimal;

public record ProductFilterRequest(
    String categoryName,
    String brandNames,
    String search,
    BigDecimal minPrice,
    BigDecimal maxPrice

) {
}
