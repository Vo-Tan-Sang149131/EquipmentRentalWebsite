package com.luxrental.controller.product.dto.device.response;

// Khớp với interface ProductImage trên FE
public record DeviceImageDTO(
    Long id,
    String imageUrl,
    boolean isPrimary
) {
}
