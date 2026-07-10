package com.luxrental.controller.cart.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record CartResponse(
    List<CartItemResponse> items,
    BigDecimal totalRentalFeeAll, // Tổng tiền thuê của tất cả các món cộng lại
    BigDecimal totalDepositAll,   // Tổng tiền cọc của tất cả các món cộng lại
    BigDecimal grandTotal         // Tổng chi phí tạm tính cuối cùng = totalRentalFeeAll + totalDepositAll
) {
}
