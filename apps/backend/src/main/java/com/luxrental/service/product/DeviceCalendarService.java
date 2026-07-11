package com.luxrental.service.product;

import com.luxrental.entity.order.Order;
import com.luxrental.entity.device.Device;
import com.luxrental.entity.device.DeviceCalendar;
import com.luxrental.enums.CalendarStatus;
import com.luxrental.repository.product.DeviceCalendarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DeviceCalendarService {
    private final DeviceCalendarRepository calendarRepository;

    private List<LocalDate> generateDateList(LocalDate startDate, LocalDate endDate) {
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date must be before end date");
        }
        return startDate.datesUntil(endDate.plusDays(1)).toList();
    }

    @Transactional
    public void lockCalendarForOrder(Device device, LocalDate startDate, LocalDate endDate, Order order) {
        List<LocalDate> requestedDates = generateDateList(startDate, endDate);

        // Check if any of the requested dates are already booked
        long blockedCount = calendarRepository.countBlockedDates(device.getId(), requestedDates);
        if (blockedCount > 0) {
            throw new IllegalStateException("Equipment is already booked for some dates");
        }

        // Store sequentially ordered dates
        for (LocalDate date : requestedDates) {
            DeviceCalendar calendar = DeviceCalendar.builder()
                .device(device)
                .eventDate(date)
                .status(CalendarStatus.BOOKED)
                .order(order)
                .build();
            calendarRepository.save(calendar);
        }
    }
}
