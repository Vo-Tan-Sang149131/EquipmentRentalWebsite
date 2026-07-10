package com.luxrental.controller.order.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderSummaryResponse {
    private Long orderId;
    private String status;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal totalPrice;
    private String renterUsername;
    private String renterPhone;
    private String renterEmail;
    private List<String> deviceNames; // for simplicity
}

