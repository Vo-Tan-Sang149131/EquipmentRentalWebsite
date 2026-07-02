package com.example.demo.service.order;

import com.example.demo.dto.order.request.CheckoutRequest;
import com.example.demo.dto.order.response.CheckoutResponse;
import com.example.demo.dto.order.response.OrderSummaryResponse;
import com.example.demo.entity.CartItem;
import com.example.demo.entity.Order;
import com.example.demo.entity.OrderDetail;
import com.example.demo.entity.User;
import com.example.demo.enumValues.CartItemStatus;
import com.example.demo.enumValues.OrderStatus;
import com.example.demo.repository.payment.PaymentRepository;
import com.example.demo.repository.user.CartItemRepository;
import com.example.demo.repository.order.OrderDetailRepository;
import com.example.demo.repository.order.OrderRepository;
import com.example.demo.repository.user.UserRepository;
import com.example.demo.service.payment.PaymentService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    private final Map<String, PaymentService> paymentStrategies;
    private final PaymentRepository paymentRepository;

    @Transactional
    public CheckoutResponse createPendingOrder(CheckoutRequest request, Long renterId, HttpServletRequest httpServletRequest) {
        User renter = userRepository.findById(renterId)
            .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy tài khoản người thuê!"));

        List<CartItem> selectedCartItems = new ArrayList<>();
        for (Long cartItemId : request.cartItemIds()) {
            CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new EntityNotFoundException("Món đồ có ID " + cartItemId + " không tồn tại trong giỏ!"));

            // Bảo mật: Đảm bảo món đồ này thuộc về chính người đang thao tác
            if (!item.getUser().getId().equals(renterId)) {
                throw new org.springframework.security.access.AccessDeniedException("Bạn không có quyền thanh toán món đồ này!");
            }
            if (item.getStatus() != CartItemStatus.ACTIVE) {
                throw new IllegalStateException("Món đồ này đã được thanh toán hoặc hết hạn trước đó!");
            }
            selectedCartItems.add(item);
        }

        LocalDate minStartDate = selectedCartItems.stream().map(CartItem::getStartDate).min(LocalDate::compareTo).orElse(LocalDate.now());
        LocalDate maxEndDate = selectedCartItems.stream().map(CartItem::getEndDate).max(LocalDate::compareTo).orElse(LocalDate.now());

        BigDecimal totalRentalFee = BigDecimal.ZERO;
        BigDecimal totalDeposit = BigDecimal.ZERO;

        for (CartItem item : selectedCartItems) {
            BigDecimal itemRentalFee = item.getDevice().getPricePerDay().multiply(BigDecimal.valueOf(item.getRentalDays()));
            totalRentalFee = totalRentalFee.add(itemRentalFee);
            totalDeposit = totalDeposit.add(item.getDevice().getDepositValue());
        }

        BigDecimal totalPriceAll = totalRentalFee.add(totalDeposit);

        Order order = Order.builder()
            .renter(renter)
            .startDate(minStartDate)
            .endDate(maxEndDate)
            .totalPrice(totalPriceAll)
            .status(OrderStatus.PENDING_PAYMENT)
            .build();

        order = orderRepository.save(order);

        for (CartItem item : selectedCartItems) {
            OrderDetail detail = OrderDetail.builder()
                .order(order)
                .device(item.getDevice())
                .pricePerDay(item.getDevice().getPricePerDay())
                .depositAmount(item.getDevice().getDepositValue())
                .build();

            orderDetailRepository.save(detail);

            item.setStatus(CartItemStatus.CHECKED_OUT);
            cartItemRepository.save(item);
        }

        String paymentToken = java.util.UUID.randomUUID().toString();

        String strategyKey = request.paymentMethod().toUpperCase() + "PaymentService";
        PaymentService strategy = paymentStrategies.get(strategyKey);

        if (strategy == null) {
            throw new IllegalArgumentException("Phương thức thanh toán " + request.paymentMethod() + " không được hỗ trợ!");
        }

        com.example.demo.entity.Payment paymentRecord = com.example.demo.entity.Payment.builder()
            .order(order)
            .amount(totalPriceAll)
            .paymentMethod(com.example.demo.enumValues.PaymentMethod.valueOf(request.paymentMethod().toUpperCase()))
            .status(com.example.demo.enumValues.PaymentStatus.PENDING)
            .paymentToken(paymentToken)
            .build();
        paymentRepository.save(paymentRecord);

        String realPaymentUrl = strategy.createPaymentUrl(order, totalPriceAll, paymentToken, httpServletRequest);

        return new CheckoutResponse(order.getId(), totalPriceAll, realPaymentUrl, paymentToken);
    }

    @Transactional(readOnly = true)
    public java.util.List<com.example.demo.dto.order.response.OrderSummaryResponse> getOrdersForOwner(Long ownerId) {
        var orders = orderRepository.findOrdersByOwnerId(ownerId);
        return orders.stream().map(o -> buildOrderSummaryResponse(o, ownerId)).toList();
    }

    @Transactional(readOnly = true)
    public Page<com.example.demo.dto.order.response.OrderSummaryResponse> getOrdersForOwnerPaged(Long ownerId, Pageable pageable) {
        var orderPage = orderRepository.findOrdersByOwnerIdPaged(ownerId, pageable);
        var responses = orderPage.getContent().stream().map(o -> buildOrderSummaryResponse(o, ownerId)).toList();
        return new PageImpl<>(responses, pageable, orderPage.getTotalElements());
    }

    @Transactional
    public com.example.demo.dto.order.response.OrderSummaryResponse confirmOrder(Long orderId, Long ownerId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new EntityNotFoundException("Order not found with ID: " + orderId));

        // Verify owner has devices in this order
        boolean ownerHasDeviceInOrder = order.getOrderDetails().stream()
            .anyMatch(od -> od.getDevice().getOwner().getId().equals(ownerId));

        if (!ownerHasDeviceInOrder) {
            throw new org.springframework.security.access.AccessDeniedException("You don't own any devices in this order");
        }

        // Only allow confirming PAID orders
        if (order.getStatus() != OrderStatus.PAID) {
            throw new IllegalStateException("Order must be PAID before confirming. Current status: " + order.getStatus());
        }

        order.setStatus(OrderStatus.CONFIRMED);
        order = orderRepository.save(order);

        return buildOrderSummaryResponse(order, ownerId);
    }

    @Transactional
    public com.example.demo.dto.order.response.OrderSummaryResponse rejectOrder(Long orderId, Long ownerId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new EntityNotFoundException("Order not found with ID: " + orderId));

        // Verify owner has devices in this order
        boolean ownerHasDeviceInOrder = order.getOrderDetails().stream()
            .anyMatch(od -> od.getDevice().getOwner().getId().equals(ownerId));

        if (!ownerHasDeviceInOrder) {
            throw new org.springframework.security.access.AccessDeniedException("You don't own any devices in this order");
        }

        // Only allow rejecting PAID or PENDING_PAYMENT orders
        if (order.getStatus() != OrderStatus.PAID && order.getStatus() != OrderStatus.PENDING_PAYMENT) {
            throw new IllegalStateException("Cannot reject order with status: " + order.getStatus());
        }

        order.setStatus(OrderStatus.CANCELLED);
        order = orderRepository.save(order);

        return buildOrderSummaryResponse(order, ownerId);
    }

    private com.example.demo.dto.order.response.OrderSummaryResponse buildOrderSummaryResponse(Order o, Long ownerId) {
        var deviceNames = o.getOrderDetails().stream()
            .filter(od -> od.getDevice().getOwner().getId().equals(ownerId))
            .map(od -> od.getDevice().getProduct().getName())
            .toList();

        return com.example.demo.dto.order.response.OrderSummaryResponse.builder()
            .orderId(o.getId())
            .status(o.getStatus().name())
            .startDate(o.getStartDate())
            .endDate(o.getEndDate())
            .totalPrice(o.getTotalPrice())
            .renterUsername(o.getRenter() != null ? o.getRenter().getUsername() : "Unknown")
            .renterPhone(o.getRenter() != null ? o.getRenter().getPhoneNumber() : "")
            .renterEmail(o.getRenter() != null ? o.getRenter().getEmail() : "")
            .deviceNames(deviceNames)
            .build();
    }

    @Transactional(readOnly = true)
    public List<com.example.demo.dto.order.response.OrderSummaryResponse> getAllOrdersForAdmin() {
        return orderRepository.findAll().stream().map(o -> {
            var deviceNames = o.getOrderDetails().stream()
                .map(od -> od.getDevice().getProduct().getName())
                .toList();

            return com.example.demo.dto.order.response.OrderSummaryResponse.builder()
                .orderId(o.getId())
                .status(o.getStatus().name())
                .startDate(o.getStartDate())
                .endDate(o.getEndDate())
                .totalPrice(o.getTotalPrice())
                .renterUsername(o.getRenter() != null ? o.getRenter().getUsername() : "Unknown")
                .renterPhone(o.getRenter() != null ? o.getRenter().getPhoneNumber() : "")
                .renterEmail(o.getRenter() != null ? o.getRenter().getEmail() : "")
                .deviceNames(deviceNames)
                .build();
        }).toList();
    }

    @Transactional
    public void cancelOrderByAdmin(Long orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new EntityNotFoundException("Order not found with ID: " + orderId));
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

    @Transactional(readOnly = true)
    public java.util.Map<String, Object> getOwnerStats(Long ownerId) {
        // Fetch all orders for owner
        var orders = orderRepository.findOrdersByOwnerId(ownerId);

        long paidOrders = orders.stream().filter(o -> o.getStatus() == OrderStatus.PAID).count();
        long confirmedOrders = orders.stream().filter(o -> o.getStatus() == OrderStatus.CONFIRMED).count();
        long pickedUpOrders = orders.stream().filter(o -> o.getStatus() == OrderStatus.PICKED_UP).count();
        long totalOrders = orders.size();

        java.math.BigDecimal totalRevenue = orders.stream()
            .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
            .map(o -> o.getTotalPrice() != null ? o.getTotalPrice() : java.math.BigDecimal.ZERO)
            .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

        return java.util.Map.of(
            "totalOrders", totalOrders,
            "pendingOrders", paidOrders,
            "confirmedOrders", confirmedOrders,
            "activeRentals", pickedUpOrders,
            "totalRevenue", totalRevenue
        );
    }

    @Transactional(readOnly = true)
    public List<OrderSummaryResponse> getOrdersForRenter(Long renterId) {
        return orderRepository.findByRenterIdOrderByCreatedAtDesc(renterId).stream()
            .map(o -> OrderSummaryResponse.builder()
                .orderId(o.getId())
                .renterUsername(o.getRenter().getUsername())
                .totalPrice(o.getTotalPrice() != null ? o.getTotalPrice() : BigDecimal.ZERO)
                .status(o.getStatus().name())
                .startDate(o.getStartDate())
                .endDate(o.getEndDate())
                .deviceNames(o.getOrderDetails().stream()
                    .map(od -> od.getDevice().getProduct().getName())
                    .collect(Collectors.toList()))
                .build())
            .collect(Collectors.toList());
    }
}
