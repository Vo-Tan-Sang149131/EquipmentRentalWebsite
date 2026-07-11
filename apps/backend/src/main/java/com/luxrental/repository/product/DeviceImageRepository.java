package com.luxrental.repository.product;

import com.luxrental.entity.device.DeviceImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeviceImageRepository extends JpaRepository<DeviceImage, Long> {

    // Find images belonging to a specific device
    @Query("SELECT di FROM DeviceImage di WHERE di.device.id = :deviceId")
    List<DeviceImage> findByDeviceId(Long deviceId);
}
