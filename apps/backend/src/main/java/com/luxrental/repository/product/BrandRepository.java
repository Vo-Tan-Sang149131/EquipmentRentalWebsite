package com.luxrental.repository.product;

import com.luxrental.entity.common.Brand;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BrandRepository extends JpaRepository<Brand, Long> {
}
