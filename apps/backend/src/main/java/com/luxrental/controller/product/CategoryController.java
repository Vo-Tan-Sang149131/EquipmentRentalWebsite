package com.luxrental.controller.product;

import com.luxrental.controller.BaseController;
import com.luxrental.common.dto.MyApiResponse;
import com.luxrental.controller.product.dto.core.response.LookupResponse;
import com.luxrental.entity.common.Category;
import com.luxrental.service.product.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController extends BaseController {
    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<MyApiResponse<List<LookupResponse>>> getAllCategories() {
        return createResponse(HttpStatus.OK, 1000, "Success", categoryService.getAllCategories());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<MyApiResponse<Category>> createCategory(@RequestBody Category category) {
        return createResponse(HttpStatus.CREATED, 1000, "Category created", categoryService.createCategory(category));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<MyApiResponse<Category>> updateCategory(@PathVariable Long id, @RequestBody Category category) {
        return createResponse(HttpStatus.OK, 1000, "Category updated", categoryService.updateCategory(id, category));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<MyApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return createResponse(HttpStatus.OK, 1000, "Category deleted", null);
    }
}
