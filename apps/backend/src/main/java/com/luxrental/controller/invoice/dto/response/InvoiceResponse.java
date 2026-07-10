package com.luxrental.controller.invoice.dto.response;

import lombok.Builder;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Builder
public record InvoiceResponse(
    Long orderId,
    String orderStatus,
    LocalDate startDate,
    LocalDate endDate,
    BigDecimal totalPrice,
    String renterName,
    String renterEmail,
    String renterPhone,
    List<InvoiceItem> items,
    List<InvoicePayment> payments,
    Instant createdAt
) {
    @Builder
    public record InvoiceItem(
        Long deviceId,
        String deviceName,
        BigDecimal pricePerDay,
        Integer rentalDays,
        BigDecimal subtotal,
        BigDecimal depositAmount
    ) {
    }

    @Builder
    public record InvoicePayment(
        Long paymentId,
        String paymentMethod,
        BigDecimal amount,
        String status,
        Instant paidAt
    ) {
    }
}
