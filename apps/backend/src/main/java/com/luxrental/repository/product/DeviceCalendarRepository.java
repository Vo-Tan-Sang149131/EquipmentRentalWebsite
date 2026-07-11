package com.luxrental.repository.product;

import com.luxrental.entity.device.DeviceCalendar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DeviceCalendarRepository extends JpaRepository<DeviceCalendar, Long> {

    // Query to count blocked dates basic:
    @Query("SELECT COUNT(c) FROM DeviceCalendar c WHERE c.device.id = :itemId AND c.eventDate IN :requestedDates")
    long countBlockedDates(@Param("itemId") Long itemId, @Param("requestedDates") List<LocalDate> requestedDates);

    @Query("SELECT c FROM DeviceCalendar c WHERE c.device.id = :deviceId AND c.eventDate = :date")
    Optional<DeviceCalendar> findByDeviceIdAndEventDate(@Param("deviceId") Long deviceId, @Param("date") LocalDate date);

    @Query("SELECT c.eventDate FROM DeviceCalendar c WHERE c.device.id = :deviceId AND c.eventDate >= CURRENT_DATE")
    List<LocalDate> findFutureBlockedDatesByDeviceId(@Param("deviceId") Long deviceId);

}
