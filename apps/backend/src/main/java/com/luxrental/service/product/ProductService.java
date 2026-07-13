package com.luxrental.service.product;

import com.luxrental.controller.product.dto.search.request.ProductFilterRequest;
import com.luxrental.controller.product.dto.search.response.PriceRangeResponse;
import com.luxrental.controller.product.dto.core.response.ProductResponse;
import com.luxrental.entity.product.Product;
import com.luxrental.entity.product.ProductImage;
import com.luxrental.entity.device.Device;
import com.luxrental.enums.DeviceStatus;
import com.luxrental.repository.product.ProductRepository;
import com.luxrental.service.common.PaginationHelper;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final PaginationHelper paginationHelper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("id", "name", "basePrice", "status");

    @Transactional(readOnly = true)
    public Page<ProductResponse> getProducts(ProductFilterRequest filter, Pageable rawPageable) {
        Pageable safePageable = paginationHelper.makeSafePagination(rawPageable, ALLOWED_SORT_FIELDS, "name", Sort.Direction.ASC);
        Specification<Product> spec = getProductSpecification(filter);
        Page<Product> productPaged = productRepository.findAll(spec, safePageable);

        return productPaged.map(product -> {
            // 1. Retrieve the primary image URL
            String primaryUrl = product.getImages().stream()
                .filter(ProductImage::isPrimary)
                .map(ProductImage::getImageUrl)
                .findFirst()
                .orElse(null);

            // 2. Check if there are approved devices in the product
            boolean hasApprovedDevice = product.getDevices().stream()
                .anyMatch(device -> device.getStatus() == DeviceStatus.APPROVED);
            String statusText = hasApprovedDevice ? "AVAILABLE" : "OUT_OF_STOCK";

            return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getSlug(),
                product.getCategory() != null ? product.getCategory().getName() : null,
                product.getBrand() != null ? product.getBrand().getName() : null,
                primaryUrl,
                product.getBasePrice() != null ? product.getBasePrice() : BigDecimal.ZERO,
                statusText
            );
        });
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getTop4RelatedProducts(String categoryName, Long currentProductId) {
        List<Product> rawRelated = productRepository.findByCategoryNameAndIdNot(
            categoryName,
            currentProductId,
            PageRequest.of(0, 4)
        );

        return rawRelated.stream().map(product -> {
            String primaryUrl = product.getImages().stream()
                .filter(ProductImage::isPrimary)
                .map(ProductImage::getImageUrl)
                .findFirst()
                .orElse(null);

            boolean hasApprovedDevice = product.getDevices().stream()
                .anyMatch(device -> device.getStatus() == DeviceStatus.APPROVED);
            String statusText = hasApprovedDevice ? "AVAILABLE" : "OUT_OF_STOCK";

            return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getSlug(),
                categoryName,
                product.getBrand() != null ? product.getBrand().getName() : null,
                primaryUrl,
                product.getBasePrice() != null ? product.getBasePrice() : BigDecimal.ZERO,
                statusText
            );
        }).toList();
    }


    private static Specification<Product> getProductSpecification(ProductFilterRequest filter) {
        return (root, query, cb) -> {
            Predicate predicate = cb.conjunction();

            // 1. Filter by category name
            if (filter.categoryName() != null && !filter.categoryName().isBlank()) {
                predicate = cb.and(predicate,
                    cb.equal(root.get("category").get("name"), filter.categoryName())
                );
            }

            // 2. Filter by brand names
            if (filter.brandNames() != null && !filter.brandNames().isBlank()) {
                String[] brandArray = filter.brandNames().split(",");

                CriteriaBuilder.In<String> inClause = cb.in(root.get("brand").get("name"));
                for (String brand : brandArray) {
                    inClause.value(brand.trim());
                }
                predicate = cb.and(predicate, inClause);
            }

            // 3. Other filters for minPrice, maxPrice, and search remain
            if (filter.search() != null && !filter.search().isBlank()) {
                String keyword = "%" + filter.search().toLowerCase() + "%";
                predicate = cb.and(predicate, cb.like(cb.lower(root.get("name")), keyword));
            }
            if (filter.minPrice() != null) {
                predicate = cb.and(predicate, cb.greaterThanOrEqualTo(root.get("basePrice"), filter.minPrice()));
            }
            if (filter.maxPrice() != null) {
                predicate = cb.and(predicate, cb.lessThanOrEqualTo(root.get("basePrice"), filter.maxPrice()));
            }

            return predicate;
        };
    }

    @Transactional(readOnly = true)
    public PriceRangeResponse getProductPriceRange(String categoryName) {
        String formattedCategory = (categoryName != null && !categoryName.isBlank()) ? categoryName.trim() : null;

        return productRepository.findPriceRangeByCategory(formattedCategory);
    }


    @Transactional
    public void updateBasePrice(Long productId) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        BigDecimal minPrice = product.getDevices().stream()
            .filter(device -> device.getStatus() == DeviceStatus.APPROVED)
            .map(Device::getPricePerDay)
            .min(BigDecimal::compareTo)
            .orElse(null);

        // Only update if minPrice is not null
        product.setBasePrice(Objects.requireNonNullElse(minPrice, BigDecimal.ZERO));

        productRepository.save(product);
    }

}
