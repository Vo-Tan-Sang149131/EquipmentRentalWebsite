package com.luxrental.controller.product.dto.core.response;

import java.util.List;

public record ProductInformation(
    Long id,
    String name,
    String slug,
    String categoryName,  // Từ bảng categories thông qua JOIN
    String brandName,     // Từ bảng brands thông qua JOIN
    String description,
    List<SpecificationDTO> specifications, // Parse từ trường JSON trong DB
    List<String> includedItems             // Split từ trường accessories_included trong DB
) {
}
