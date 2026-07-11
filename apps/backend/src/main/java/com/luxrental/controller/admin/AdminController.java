package com.luxrental.controller.admin;

import com.luxrental.controller.BaseController;
import com.luxrental.common.dto.MyApiResponse;
import com.luxrental.controller.order.dto.response.OrderSummaryResponse;
import com.luxrental.controller.user.dto.response.UserResponse;
import com.luxrental.entity.payment.Payment;
import com.luxrental.service.order.OrderService;
import com.luxrental.service.user.UserService;
import com.luxrental.repository.payment.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController extends BaseController {

    private final UserService userService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<MyApiResponse<List<UserResponse>>> listUsers() {
        return createResponse(HttpStatus.OK, 1000, "Success", userService.listAllUsers());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/users/{id}/toggle-enabled")
    public ResponseEntity<MyApiResponse<Void>> toggleUser(@PathVariable Long id) {
        userService.toggleUserEnabled(id);
        return createResponse(HttpStatus.OK, 1000, "Toggled user enabled status", null);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users/{id}")
    public ResponseEntity<MyApiResponse<UserResponse>> getUserDetail(@PathVariable Long id) {
        return createResponse(HttpStatus.OK, 1000, "Success", userService.getUserDetailForAdmin(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/users/{id}/roles")
    public ResponseEntity<MyApiResponse<Void>> updateUserRoles(@PathVariable Long id, @RequestBody Set<String> roleNames) {
        userService.updateUserRoles(id, roleNames);
        return createResponse(HttpStatus.OK, 1000, "Updated user roles", null);
    }

    private final OrderService orderService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/orders")
    public ResponseEntity<MyApiResponse<List<OrderSummaryResponse>>> listAllOrders() {
        return createResponse(HttpStatus.OK, 1000, "Success", orderService.getAllOrdersForAdmin());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/orders/{id}/cancel")
    public ResponseEntity<MyApiResponse<Void>> cancelOrder(@PathVariable Long id) {
        orderService.cancelOrderByAdmin(id);
        return createResponse(HttpStatus.OK, 1000, "Order cancelled", null);
    }

    private final PaymentRepository paymentRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/payments")
    public ResponseEntity<MyApiResponse<List<Payment>>> listAllPayments() {
        return createResponse(HttpStatus.OK, 1000, "Success", paymentRepository.findAll());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/overview")
    public ResponseEntity<MyApiResponse<java.util.Map<String, Object>>> getAdminOverview() {
        var stats = userService.getAdminStats();
        return createResponse(HttpStatus.OK, 1000, "Admin overview retrieved", stats);
    }
}


