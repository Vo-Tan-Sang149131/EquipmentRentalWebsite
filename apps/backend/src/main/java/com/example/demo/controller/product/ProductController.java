package com.example.demo.controller.product;

import com.example.demo.controller.BaseController;
import com.example.demo.dto.MyApiResponse;
import com.example.demo.dto.product.search.request.ProductFilterRequest;
import com.example.demo.dto.product.core.response.ProductResponse;
import com.example.demo.repository.review.ProductReviewRepository;
import com.example.demo.service.product.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.demo.dto.product.review.ReviewDTO;
import com.example.demo.security.CustomUserDetails;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController extends BaseController {

    private final ProductService productService;
    private final MessageSource messageSource;
    private final ProductReviewRepository productReviewRepository;

    @GetMapping
    @io.swagger.v3.oas.annotations.security.SecurityRequirements
    public ResponseEntity<MyApiResponse<Page<ProductResponse>>> getAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) String sortBy,
        @RequestParam(defaultValue = "ASC") String orderBy,

        ProductFilterRequest filter
    ) {
        Sort.Direction direction = "DESC".equalsIgnoreCase(orderBy) ? Sort.Direction.DESC : Sort.Direction.ASC;

        Pageable rawPageable = (sortBy != null && !sortBy.trim().isEmpty())
            ? PageRequest.of(page, size, Sort.by(direction, sortBy))
            : PageRequest.of(page, size);

        return createResponse(HttpStatus.OK, 1000, "Success", productService.getProducts(filter, rawPageable));
    }

    @GetMapping("/reviews/my")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<MyApiResponse<Page<ReviewDTO>>> getMyReviews(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long ownerId = userDetails.getId();
        var reviewPage = productReviewRepository.findByOwnerIdPaged(ownerId, PageRequest.of(page, size));
        var dtos = reviewPage.getContent().stream()
            .map(rev -> new ReviewDTO(
                rev.getId(),
                rev.getRenter() != null ? rev.getRenter().getUsername() : "Ẩn danh",
                rev.getRating(),
                rev.getComment(),
                rev.getCreatedAt()
            ))
            .toList();
        return createResponse(HttpStatus.OK, 1000, "Success", new PageImpl<>(dtos, PageRequest.of(page, size), reviewPage.getTotalElements()));
    }

}
