package com.luxrental.repository.product;

import com.luxrental.controller.product.dto.core.response.LookupResponse;
import com.luxrental.entity.common.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BrandRepository extends JpaRepository<Brand, Long> {

    @Query("SELECT DISTINCT new com.luxrental.controller.product.dto.core.response.LookupResponse(b.id, b.name) " +
        "FROM Product p JOIN p.brand b " +
        "WHERE (:categoryName IS NULL OR p.category.name = :categoryName)")
    List<LookupResponse> findBrandsByCategory(@Param("categoryName") String categoryName);

}
