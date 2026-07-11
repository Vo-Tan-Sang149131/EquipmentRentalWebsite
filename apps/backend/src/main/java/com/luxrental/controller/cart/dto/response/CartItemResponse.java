package com.luxrental.controller.cart.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CartItemResponse(
    Long cartItemId,
    LocalDate startDate,
    LocalDate endDate,
    Integer rentalDays,
    BigDecimal subTotalRentalFee, // Tiền thuê của item này = rentalDays * pricePerDay
    CartDeviceDTO device
) {
}
