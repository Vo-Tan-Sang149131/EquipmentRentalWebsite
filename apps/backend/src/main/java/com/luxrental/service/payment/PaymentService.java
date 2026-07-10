package com.luxrental.service.payment;

import com.luxrental.entity.order.Order;
import jakarta.servlet.http.HttpServletRequest;

import java.math.BigDecimal;
import java.util.Map;

public interface PaymentService {
    // Trả về link thanh toán (Hoặc chuỗi thông báo nếu là tiền mặt)
    String createPaymentUrl(Order order, BigDecimal amount, String paymentToken, HttpServletRequest httpServletRequest);

    // Xử lý dữ liệu trả về từ Webhook/IPN
    boolean processCallback(Map<String, String> callbackData);
}
