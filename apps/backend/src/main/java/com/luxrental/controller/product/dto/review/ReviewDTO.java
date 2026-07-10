package com.luxrental.controller.product.dto.review;

import java.time.Instant;

public record ReviewDTO(
    Long id,
    String username,
    int rating,
    String comment,
    Instant createdAt
) {
}
