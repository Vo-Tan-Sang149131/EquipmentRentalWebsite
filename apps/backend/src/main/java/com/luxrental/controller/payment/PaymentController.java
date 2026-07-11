package com.luxrental.controller.payment;

import com.luxrental.controller.BaseController;
import com.luxrental.common.dto.MyApiResponse;
import com.luxrental.entity.order.Order;
import com.luxrental.entity.payment.Payment;
import com.luxrental.enums.OrderStatus;
import com.luxrental.enums.PaymentStatus;
import com.luxrental.service.payment.PaymentService;
import com.luxrental.repository.order.OrderRepository;
import com.luxrental.repository.payment.PaymentRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController extends BaseController {

    private final Map<String, PaymentService> paymentStrategies;
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    @GetMapping("/vnpay/ipn")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<MyApiResponse<Map<String, String>>> receiveVnPayIpn(HttpServletRequest request) {
        Map<String, String> params = new HashMap<>();
        Enumeration<String> parameterNames = request.getParameterNames();
        while (parameterNames.hasMoreElements()) {
            String paramName = parameterNames.nextElement();
            params.put(paramName, request.getParameter(paramName));
        }

        PaymentService vnPayService = paymentStrategies.get("VNPAYPaymentService");
        boolean isProcessedSuccess = vnPayService.processCallback(params);

        Map<String, String> vnpayResponse = new HashMap<>();

        if (isProcessedSuccess) {
            String paymentToken = params.get("vnp_TxnRef");
            String transactionId = params.get("vnp_TransactionNo");

            Payment payment = paymentRepository.findByPaymentToken(paymentToken)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phiên giao dịch!"));

            if (payment.getStatus() != PaymentStatus.SUCCESS) {
                payment.setStatus(PaymentStatus.SUCCESS);
                payment.setTransactionId(transactionId);
                payment.setPaidAt(java.time.Instant.now());
                payment.setResponseMetadata(params.toString());
                paymentRepository.save(payment);

                Order order = payment.getOrder();
                order.setStatus(OrderStatus.PAID);
                orderRepository.save(order);
            }

            vnpayResponse.put("RspCode", "00");
            vnpayResponse.put("Message", "Confirm Success");

            return createResponse(HttpStatus.OK, 1000, "Xử lý IPN giao dịch thành công", vnpayResponse);
        } else {
            vnpayResponse.put("RspCode", "97");
            vnpayResponse.put("Message", "Invalid Checksum");

            return createResponse(HttpStatus.BAD_REQUEST, 9001, "Sai chữ ký bảo mật Checksum", vnpayResponse);
        }
    }
}
