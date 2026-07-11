package com.luxrental.controller.product.dto.device.response;

import com.luxrental.controller.product.dto.core.response.ProductInformation;
import com.luxrental.controller.product.dto.core.response.ProductResponse;
import com.luxrental.controller.product.dto.owner.OwnerDTO;
import com.luxrental.controller.product.dto.review.ReviewDTO;

import java.util.List;

public record DeviceDetailResponse(
    ProductInformation product,
    DeviceInformation device,
    OwnerDTO owner,
    List<ReviewDTO> reviews,
    List<ProductResponse> relatedProducts
) {
}
