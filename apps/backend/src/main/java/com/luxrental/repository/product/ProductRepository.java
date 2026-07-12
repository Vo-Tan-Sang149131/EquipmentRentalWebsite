package com.luxrental.repository.product;

import com.luxrental.controller.product.dto.search.response.PriceRangeResponse;
import com.luxrental.entity.product.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    @Query(value = """
            SELECT
                COALESCE(MIN(p.base_price), 50000.00) as minPrice,
                COALESCE(MAX(p.base_price), 3000000.00) as maxPrice
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
                AND (:categoryName IS NULL OR c.name = :categoryName)
            WHERE p.base_price IS NOT NULL
              AND p.base_price > 0
              AND (:categoryName IS NULL OR c.id IS NOT NULL)
        """, nativeQuery = true)
    PriceRangeResponse findPriceRangeByCategory(@Param("categoryName") String categoryName);


    @Query("SELECT p FROM Product p WHERE p.category.name = :categoryName AND p.id <> :currentProductId")
    List<Product> findByCategoryNameAndIdNot(
        @Param("categoryName") String categoryName,
        @Param("currentProductId") Long currentProductId,
        Pageable pageable
    );
}
