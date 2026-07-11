package com.luxrental.controller;

import com.luxrental.common.dto.MyApiResponse;
import com.luxrental.controller.product.dto.review.ReviewDTO;
import com.luxrental.security.normal.CustomUserDetails;
import com.luxrental.service.review.ReviewService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController extends BaseController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<MyApiResponse<ReviewDTO>> createProductReview(
        @RequestBody CreateReviewRequest request,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        var review = reviewService.createProductReview(
            request.orderId, userDetails.getId(), request.productId, request.rating, request.comment
        );
        var dto = new ReviewDTO(review.getId(), review.getRenter().getUsername(), review.getRating(), review.getComment(), review.getCreatedAt());
        return createResponse(HttpStatus.CREATED, 1000, "Review created successfully", dto);
    }

    public record CreateReviewRequest(
        @NotNull Long orderId,
        @NotNull Long productId,
        @NotNull @Min(1) @Max(5) Integer rating,
        String comment
    ) {
    }
}
