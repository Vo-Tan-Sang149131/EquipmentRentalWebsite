package com.example.demo.repository.product;

import com.example.demo.entity.Device;
import com.example.demo.enumValues.DeviceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DeviceRepository extends JpaRepository<Device, Long> {

    // Find devices belonging to a specific owner
    @Query("SELECT d FROM Device d WHERE d.owner.id = :ownerId")
    List<Device> findByOwnerId(Long ownerId);

    @Query(value = "SELECT d FROM Device d WHERE d.owner.id = :ownerId",
           countQuery = "SELECT COUNT(d) FROM Device d WHERE d.owner.id = :ownerId")
    Page<Device> findByOwnerIdPaged(@Param("ownerId") Long ownerId, Pageable pageable);

    // Find detail of the device by id
    @Query("SELECT d FROM Device d " +
        "JOIN FETCH d.product p " +
        "JOIN FETCH p.category " +
        "JOIN FETCH p.brand " +
        "JOIN FETCH d.owner " +
        "WHERE d.id = :id AND d.status = 'APPROVED'")
    Optional<Device> findDetailById(@Param("id") Long id);

    Optional<Device> findFirstByProductIdAndStatus(Long productId, DeviceStatus status);
}
