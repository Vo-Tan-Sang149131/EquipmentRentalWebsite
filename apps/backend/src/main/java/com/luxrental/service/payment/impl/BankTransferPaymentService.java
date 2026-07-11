package com.luxrental.service.payment.impl;

import com.luxrental.entity.order.Order;
import com.luxrental.service.payment.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;

@Service("BANK_TRANSFERPaymentService")
public class BankTransferPaymentService implements PaymentService {
    @Override
    public String createPaymentUrl(Order order, BigDecimal amount, String paymentToken, HttpServletRequest httpServletRequest) {
        // Sinh link QR VietQR thật của ngân hàng bạn để hiển thị cho khách quét
        // Cấu trúc chuẩn: https://vietqr.io<BANK_ID>-<ACCOUNT_NO>-template.png?amount=<AMOUNT>&addInfo=<MEMO>
        return "https://vietqr.io"
            + amount.toBigInteger() + "&addInfo=DH" + order.getId();

    }

    @Override
    public boolean processCallback(Map<String, String> callbackData) {
        return false;
    }
}
