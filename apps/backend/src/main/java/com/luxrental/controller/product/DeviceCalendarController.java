package com.luxrental.controller.product;

import com.luxrental.controller.BaseController;
import com.luxrental.common.dto.MyApiResponse;
import com.luxrental.entity.device.DeviceCalendar;
import com.luxrental.enums.CalendarStatus;
import com.luxrental.security.normal.CustomUserDetails;
import com.luxrental.repository.product.DeviceCalendarRepository;
import com.luxrental.repository.product.DeviceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/devices/{deviceId}/calendar")
@RequiredArgsConstructor
public class DeviceCalendarController extends BaseController {

    private final DeviceCalendarRepository calendarRepository;
    private final DeviceRepository deviceRepository;

    @PreAuthorize("hasRole('OWNER')")
    @GetMapping("/future")
    public ResponseEntity<MyApiResponse<List<String>>> getFutureBlockedDates(@PathVariable Long deviceId,
                                                                             @AuthenticationPrincipal CustomUserDetails userDetails) {
        // Ensure owner owns the device
        var device = deviceRepository.findById(deviceId).orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Device not found"));
        if (!device.getOwner().getId().equals(userDetails.getId())) {
            return createResponse(HttpStatus.FORBIDDEN, 4001, "Not allowed", null);
        }

        List<java.time.LocalDate> dates = calendarRepository.findFutureBlockedDatesByDeviceId(deviceId);
        List<String> dateStrings = dates.stream().map(LocalDate::toString).toList();
        return createResponse(HttpStatus.OK, 1000, "Success", dateStrings);
    }

    @PreAuthorize("hasRole('OWNER')")
    @PostMapping("/block")
    public ResponseEntity<MyApiResponse<Void>> blockDates(@PathVariable Long deviceId,
                                                          @RequestBody java.util.Map<String, String> request,
                                                          @AuthenticationPrincipal CustomUserDetails userDetails) {
        var device = deviceRepository.findById(deviceId).orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Device not found"));
        if (!device.getOwner().getId().equals(userDetails.getId())) {
            return createResponse(HttpStatus.FORBIDDEN, 4001, "Not allowed", null);
        }

        java.time.LocalDate startDate = java.time.LocalDate.parse(request.get("startDate"));
        java.time.LocalDate endDate = java.time.LocalDate.parse(request.get("endDate"));
        java.util.List<java.time.LocalDate> requested = startDate.datesUntil(endDate.plusDays(1)).toList();
        long blocked = calendarRepository.countBlockedDates(deviceId, requested);
        if (blocked > 0) {
            return createResponse(HttpStatus.CONFLICT, 4002, "Some dates already blocked/booked", null);
        }

        for (java.time.LocalDate date : requested) {
            DeviceCalendar c = DeviceCalendar.builder()
                .device(device)
                .eventDate(date)
                .status(CalendarStatus.OWNER_BLOCK)
                .build();
            calendarRepository.save(c);
        }

        return createResponse(HttpStatus.OK, 1000, "Blocked dates successfully", null);
    }

    @PreAuthorize("hasRole('OWNER')")
    @DeleteMapping("/unblock")
    public ResponseEntity<MyApiResponse<Void>> unblockDates(@PathVariable Long deviceId,
                                                            @RequestParam String start,
                                                            @RequestParam String end,
                                                            @AuthenticationPrincipal CustomUserDetails userDetails) {
        var device = deviceRepository.findById(deviceId).orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Device not found"));
        if (!device.getOwner().getId().equals(userDetails.getId())) {
            return createResponse(HttpStatus.FORBIDDEN, 4001, "Not allowed", null);
        }

        java.time.LocalDate startDate = java.time.LocalDate.parse(start);
        java.time.LocalDate endDate = java.time.LocalDate.parse(end);

        var toDelete = calendarRepository.findAll().stream()
            .filter(c -> c.getDevice().getId().equals(deviceId))
            .filter(c -> !c.getEventDate().isBefore(startDate) && !c.getEventDate().isAfter(endDate))
            .filter(c -> c.getStatus() == CalendarStatus.OWNER_BLOCK)
            .toList();

        calendarRepository.deleteAll(toDelete);
        return createResponse(HttpStatus.OK, 1000, "Unblocked dates successfully", null);
    }
}


