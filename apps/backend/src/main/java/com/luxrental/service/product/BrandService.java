package com.luxrental.service.product;

import com.luxrental.controller.product.dto.core.response.LookupResponse;
import com.luxrental.entity.common.Brand;
import com.luxrental.repository.product.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BrandService {
    private final BrandRepository brandRepository;

    @Transactional(readOnly = true)
    public List<LookupResponse> getAllBrands() {
        return brandRepository.findAll().stream()
            .map(b -> new LookupResponse(b.getId(), b.getName()))
            .toList();
    }

    @Transactional
    public Brand createBrand(Brand brand) {
        return brandRepository.save(brand);
    }

    @Transactional
    public Brand updateBrand(Long id, Brand brandDetails) {
        Brand brand = brandRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Brand not found"));
        brand.setName(brandDetails.getName());
        brand.setSlug(brandDetails.getSlug());
        return brandRepository.save(brand);
    }

    @Transactional
    public void deleteBrand(Long id) {
        brandRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<LookupResponse> getBrandsByCategory(String categoryName) {
        return brandRepository.findBrandsByCategory(categoryName);
    }

}
