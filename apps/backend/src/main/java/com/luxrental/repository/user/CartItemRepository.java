package com.luxrental.repository.user;

import com.luxrental.entity.cart.CartItem;
import com.luxrental.enums.CartItemStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    @Query("SELECT c FROM CartItem c WHERE c.user.id = :userId AND c.status = :status")
    List<CartItem> findByUserIdAndStatus(Long userId, CartItemStatus status);

    @Query("SELECT c FROM CartItem c WHERE c.user.id = :userId " +
        "AND c.device.id = :deviceId " +
        "AND c.startDate = :startDate " +
        "AND c.endDate = :endDate " +
        "AND c.status = :status")
    Optional<CartItem> findDuplicateItem(
        @Param("userId") Long userId,
        @Param("deviceId") Long deviceId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        @Param("status") CartItemStatus status
    );
}
