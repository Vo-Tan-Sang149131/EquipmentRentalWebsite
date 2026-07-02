package com.example.demo.controller.order;

import com.example.demo.controller.BaseController;
import com.example.demo.dto.MyApiResponse;
import com.example.demo.dto.order.request.CheckoutRequest;
import com.example.demo.dto.order.response.CheckoutResponse;
import com.example.demo.security.CustomUserDetails;
import com.example.demo.service.order.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController extends BaseController {

    private final OrderService orderService;

    // Khi người dùng bấm nút "Xác nhận và Thanh toán" ở trang Checkout sẽ gọi API này
    @PostMapping("/checkout")
    public ResponseEntity<MyApiResponse<CheckoutResponse>> checkout(
        @Valid @RequestBody CheckoutRequest request,
        @AuthenticationPrincipal CustomUserDetails userDetails,
        HttpServletRequest httpRequest // Bóc tách request từ client để chuyển tiếp lấy IP cho VNPay
    ) {
        Long renterId = userDetails.getId(); // Lấy ID người thuê từ Token bảo mật
        CheckoutResponse response = orderService.createPendingOrder(request, renterId, httpRequest);

        return createResponse(HttpStatus.OK, 1000, "Khởi tạo đơn hàng thanh toán thành công", response);
    }

    @PreAuthorize("hasRole('OWNER')")
    @GetMapping("/owner")
    public ResponseEntity<MyApiResponse<Page<com.example.demo.dto.order.response.OrderSummaryResponse>>> getOrdersForOwner(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @AuthenticationPrincipal com.example.demo.security.CustomUserDetails userDetails
    ) {
        Long ownerId = userDetails.getId();
        var result = orderService.getOrdersForOwnerPaged(ownerId, PageRequest.of(page, size));
        return createResponse(HttpStatus.OK, 1000, "Fetch owner orders successfully", result);
    }

    @PreAuthorize("hasRole('OWNER')")
    @PostMapping("/{orderId}/owner/confirm")
    public ResponseEntity<MyApiResponse<com.example.demo.dto.order.response.OrderSummaryResponse>> confirmOrder(
        @PathVariable Long orderId,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long ownerId = userDetails.getId();
        var response = orderService.confirmOrder(orderId, ownerId);
        return createResponse(HttpStatus.OK, 1000, "Order confirmed successfully", response);
    }

    @PreAuthorize("hasRole('OWNER')")
    @PostMapping("/{orderId}/owner/reject")
    public ResponseEntity<MyApiResponse<com.example.demo.dto.order.response.OrderSummaryResponse>> rejectOrder(
        @PathVariable Long orderId,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long ownerId = userDetails.getId();
        var response = orderService.rejectOrder(orderId, ownerId);
        return createResponse(HttpStatus.OK, 1000, "Order rejected successfully", response);
    }

    @PreAuthorize("hasRole('OWNER')")
    @GetMapping("/owner/overview")
    public ResponseEntity<MyApiResponse<java.util.Map<String, Object>>> getOwnerOverview(
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long ownerId = userDetails.getId();
        var stats = orderService.getOwnerStats(ownerId);
        return createResponse(HttpStatus.OK, 1000, "Owner overview retrieved", stats);
    }

    @GetMapping("/my-orders")
    public ResponseEntity<MyApiResponse<java.util.List<com.example.demo.dto.order.response.OrderSummaryResponse>>> getMyOrders(
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long renterId = userDetails.getId();
        var list = orderService.getOrdersForRenter(renterId);
        return createResponse(HttpStatus.OK, 1000, "Fetch my orders successfully", list);
    }
}
