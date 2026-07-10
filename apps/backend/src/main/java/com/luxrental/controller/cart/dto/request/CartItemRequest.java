package com.luxrental.controller.cart.dto.request;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record CartItemRequest(
    @NotNull(message = "Device ID không được để trống")
    Long deviceId,

    @NotNull(message = "Ngày bắt đầu thuê không được để trống")
    LocalDate startDate,

    @NotNull(message = "Ngày trả máy không được để trống")
    LocalDate endDate
) {
}
