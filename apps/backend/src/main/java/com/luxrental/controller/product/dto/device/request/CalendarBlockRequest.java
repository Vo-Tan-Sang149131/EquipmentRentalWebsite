package com.luxrental.controller.product.dto.device.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CalendarBlockRequest {
    private LocalDate startDate;
    private LocalDate endDate;
}

