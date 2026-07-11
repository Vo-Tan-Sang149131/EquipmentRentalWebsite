package com.luxrental.service;

import com.luxrental.controller.invoice.dto.response.InvoiceResponse;
import com.luxrental.entity.order.Order;
import com.luxrental.entity.order.OrderDetail;
import com.luxrental.entity.payment.Payment;
import com.luxrental.repository.order.OrderRepository;
import com.luxrental.repository.payment.PaymentRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    @Transactional(readOnly = true)
    public InvoiceResponse getInvoiceByOrderId(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new EntityNotFoundException("Order not found"));

        boolean isRenter = order.getRenter().getId().equals(userId);
        if (!isRenter) {
            throw new org.springframework.security.access.AccessDeniedException("You are not the renter of this order");
        }

        return buildInvoiceResponse(order);
    }

    @Transactional(readOnly = true)
    public List<InvoiceResponse> getMyInvoices(Long userId) {
        return orderRepository.findByRenterIdOrderByCreatedAtDesc(userId)
            .stream().map(this::buildInvoiceResponse).toList();
    }

    private InvoiceResponse buildInvoiceResponse(Order order) {
        List<InvoiceResponse.InvoiceItem> items = order.getOrderDetails().stream()
            .map(this::toInvoiceItem)
            .toList();

        List<InvoiceResponse.InvoicePayment> payments = order.getPayments().stream()
            .map(this::toInvoicePayment)
            .toList();

        return InvoiceResponse.builder()
            .orderId(order.getId())
            .orderStatus(order.getStatus().name())
            .startDate(order.getStartDate())
            .endDate(order.getEndDate())
            .totalPrice(order.getTotalPrice())
            .renterName(order.getRenter().getFullName())
            .renterEmail(order.getRenter().getEmail())
            .renterPhone(order.getRenter().getPhoneNumber())
            .items(items)
            .payments(payments)
            .createdAt(order.getCreatedAt())
            .build();
    }

    private InvoiceResponse.InvoiceItem toInvoiceItem(OrderDetail detail) {
        int rentalDays = (int) ChronoUnit.DAYS.between(
            detail.getOrder().getStartDate(), detail.getOrder().getEndDate()) + 1;
        BigDecimal subtotal = detail.getPricePerDay().multiply(BigDecimal.valueOf(rentalDays));

        return InvoiceResponse.InvoiceItem.builder()
            .deviceId(detail.getDevice().getId())
            .deviceName(detail.getDevice().getProduct().getName())
            .pricePerDay(detail.getPricePerDay())
            .rentalDays(rentalDays)
            .subtotal(subtotal)
            .depositAmount(detail.getDepositAmount())
            .build();
    }

    private InvoiceResponse.InvoicePayment toInvoicePayment(Payment payment) {
        return InvoiceResponse.InvoicePayment.builder()
            .paymentId(payment.getId())
            .paymentMethod(payment.getPaymentMethod().name())
            .amount(payment.getAmount())
            .status(payment.getStatus().name())
            .paidAt(payment.getPaidAt())
            .build();
    }
}
