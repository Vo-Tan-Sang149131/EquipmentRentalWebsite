package com.luxrental.controller.common;

import com.luxrental.common.dto.MyApiResponse;
import com.luxrental.controller.BaseController;
import com.luxrental.controller.product.dto.core.response.LookupResponse;
import com.luxrental.controller.product.dto.search.response.PriceRangeResponse;
import com.luxrental.service.product.BrandService;
import com.luxrental.service.product.CategoryService;
import com.luxrental.service.product.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/lookups")
@RequiredArgsConstructor
public class LookupController extends BaseController {
    private final CategoryService categoryLookupService;
    private final BrandService brandLookupService;
    private final ProductService productService;

    @GetMapping("/categories")
    public ResponseEntity<MyApiResponse<List<LookupResponse>>> getCategories() {
        return createResponse(HttpStatus.OK, 1000, "Success", categoryLookupService.getAllCategories());
    }

    // This api can be used to get brands by category name or all brands
    @GetMapping("/brands")
    public ResponseEntity<MyApiResponse<List<LookupResponse>>> getBrands(
        @RequestParam(required = false) String categoryName) {
        String cleanCategory = (categoryName != null && !categoryName.isBlank() && !"All".equalsIgnoreCase(categoryName.trim()))
            ? categoryName.trim()
            : null;

        List<LookupResponse> brands = (cleanCategory == null)
            ? brandLookupService.getAllBrands()
            : brandLookupService.getBrandsByCategory(cleanCategory);

        return createResponse(HttpStatus.OK, 1000, "Success", brands);
    }


    @GetMapping("/price-range")
    public ResponseEntity<MyApiResponse<PriceRangeResponse>> getPriceRange(@RequestParam(required = false) String categoryName) {
        String cleanCategory = (categoryName != null && !categoryName.isBlank() && !"All".equalsIgnoreCase(categoryName.trim()))
            ? categoryName.trim()
            : null;

        return createResponse(HttpStatus.OK, 1000, "Success", productService.getProductPriceRange(cleanCategory));
    }

    @GetMapping("/get-top-brands")
    public ResponseEntity<MyApiResponse<List<LookupResponse>>> getTopBrands(@RequestParam(required = false, defaultValue = "10") int limit) {

        if (limit >= 20) limit = 20;

        return createResponse(HttpStatus.OK, 1000, "Success", brandLookupService.getTopBrands(limit));
    }

}
