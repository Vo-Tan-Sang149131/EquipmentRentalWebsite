package com.luxrental.controller.product.dto.owner;

public record OwnerDTO(
    Long id,
    String fullName,
    String avatarUrl,
    boolean verified
) {
}

