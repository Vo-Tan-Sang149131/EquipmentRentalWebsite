package com.luxrental.controller.order.dto.response;

import java.math.BigDecimal;

public record CheckoutResponse(
    Long orderId,
    BigDecimal totalPrice,
    String paymentUrl, // Link to sandbox payment page
    String paymentToken // UUID for payment
) {
}
