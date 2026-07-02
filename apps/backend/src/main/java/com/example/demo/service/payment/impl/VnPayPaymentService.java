package com.example.demo.service.payment.impl;

import com.example.demo.config.web.VnPayConfig;
import com.example.demo.entity.Order;
import com.example.demo.service.payment.PaymentService;
import com.example.demo.utils.VnPayUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service("VNPAYPaymentService") // Ăn khớp tuyệt đối với tên Bean trong OrderService của bạn
@RequiredArgsConstructor
public class VnPayPaymentService implements PaymentService {

    private final VnPayConfig vnPayConfig;

    @Override
    public String createPaymentUrl(Order order, java.math.BigDecimal amount, String paymentToken, HttpServletRequest httpServletRequest) {
        // VNPay yêu cầu số tiền nhân với 100 để bỏ phần thập phân
        long amountInVnd = amount.multiply(java.math.BigDecimal.valueOf(100)).longValue();

        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", vnPayConfig.getVersion());
        vnpParams.put("vnp_Command", vnPayConfig.getCommand());
        vnpParams.put("vnp_TmnCode", vnPayConfig.getTmnCode());
        vnpParams.put("vnp_Amount", String.valueOf(amountInVnd));
        vnpParams.put("vnp_CurrCode", vnPayConfig.getCurrCode());

        // Map phiên bảo mật: Gắn mã paymentToken UUID vào vnp_TxnRef để đối soát ở IPN
        vnpParams.put("vnp_TxnRef", paymentToken);
        vnpParams.put("vnp_OrderInfo", "Thanh toan don thue may #" + order.getId());
        vnpParams.put("vnp_OrderType", vnPayConfig.getOrderType());
        vnpParams.put("vnp_Locale", vnPayConfig.getLocale());
        vnpParams.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());

        // Sử dụng hàm utils lấy IP chuẩn của bạn từ request
        vnpParams.put("vnp_IpAddr", VnPayUtils.getIpAddress(httpServletRequest));

//        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
//        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
//        vnpParams.put("vnp_CreateDate", formatter.format(cld.getTime()));
//
//        cld.add(Calendar.MINUTE, vnPayConfig.getExpireMinutes());
//        vnpParams.put("vnp_ExpireDate", formatter.format(cld.getTime()));

        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        formatter.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnpParams.put("vnp_CreateDate", formatter.format(cld.getTime()));

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnpParams.put("vnp_ExpireDate", formatter.format(cld.getTime()));

        List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        try {
            Iterator<String> itr = fieldNames.iterator();
            while (itr.hasNext()) {
                String fieldName = itr.next();
                String fieldValue = vnpParams.get(fieldName);
                if ((fieldValue != null) && (!fieldValue.isEmpty())) {
                    hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII)).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    if (itr.hasNext()) {
                        query.append('&');
                        hashData.append('&');
                    }
                }
            }
            // Băm mã hóa bảo mật chữ ký gói tin đi bằng Secret Key
            String vnpSecureHash = VnPayUtils.hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
            return vnPayConfig.getPayUrl() + "?" + query.toString() + "&vnp_SecureHash=" + vnpSecureHash;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi sinh link VNPay Sandbox", e);
        }
    }

    @Override
    public boolean processCallback(Map<String, String> callbackData) {
        String vnp_SecureHash = callbackData.get("vnp_SecureHash");
        Map<String, String> signFields = new HashMap<>(callbackData);
        signFields.remove("vnp_SecureHash");
        signFields.remove("vnp_SecureHashType");

        List<String> fieldNames = new ArrayList<>(signFields.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        try {
            Iterator<String> itr = fieldNames.iterator();
            while (itr.hasNext()) {
                String fieldName = itr.next();
                String fieldValue = signFields.get(fieldName);
                if ((fieldValue != null) && (!fieldValue.isEmpty())) {
                    hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                    if (itr.hasNext()) {
                        hashData.append('&');
                    }
                }
            }
            // Kiểm tra chữ ký VNPay bắn ngược về xem có hợp lệ không
            String builtSign = VnPayUtils.hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
            if (builtSign.equals(vnp_SecureHash)) {
                return "00".equals(callbackData.get("vnp_ResponseCode")); // "00" là mã thành công của VNPay
            }
        } catch (Exception e) {
            return false;
        }
        return false;
    }
}
