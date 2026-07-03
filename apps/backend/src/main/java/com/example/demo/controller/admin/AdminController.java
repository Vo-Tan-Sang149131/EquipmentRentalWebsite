package com.example.demo.controller.admin;

import com.example.demo.controller.BaseController;
import com.example.demo.dto.MyApiResponse;
import com.example.demo.dto.order.response.OrderSummaryResponse;
import com.example.demo.dto.user.response.UserResponse;
import com.example.demo.service.order.OrderService;
import com.example.demo.service.user.UserService;
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

    private final com.example.demo.repository.payment.PaymentRepository paymentRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/payments")
    public ResponseEntity<MyApiResponse<List<com.example.demo.entity.Payment>>> listAllPayments() {
        return createResponse(HttpStatus.OK, 1000, "Success", paymentRepository.findAll());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/overview")
    public ResponseEntity<MyApiResponse<java.util.Map<String, Object>>> getAdminOverview() {
        var stats = userService.getAdminStats();
        return createResponse(HttpStatus.OK, 1000, "Admin overview retrieved", stats);
    }
}


