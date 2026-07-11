package com.luxrental.service.payment.impl;

import com.luxrental.entity.order.Order;
import com.luxrental.service.payment.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;

@Service("MOMOPaymentService")
public class MomoPaymentService implements PaymentService {
    @Override
    public String createPaymentUrl(Order order, BigDecimal amount, String paymentToken, HttpServletRequest httpServletRequest) {
        // Link dẫn tới trang cổng Sandbox của MoMo (Mô phỏng tham số truyền)
        return "https://momo.vn" + paymentToken;
    }

    @Override
    public boolean processCallback(Map<String, String> callbackData) {
        return false;
    }
}
