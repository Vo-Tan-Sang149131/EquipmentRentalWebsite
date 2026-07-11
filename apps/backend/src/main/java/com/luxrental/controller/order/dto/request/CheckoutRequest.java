package com.luxrental.controller.order.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CheckoutRequest(
    @NotEmpty(message = "Danh sách món đồ thanh toán không được trống")
    List<Long> cartItemIds,

    @NotNull(message = "Vui lòng chọn phương thức thanh toán")
    String paymentMethod
) {
}
