package com.luxrental.controller.product.dto.search.response;

import java.math.BigDecimal;

public record PriceRangeResponse(BigDecimal minPrice, BigDecimal maxPrice) {
}
