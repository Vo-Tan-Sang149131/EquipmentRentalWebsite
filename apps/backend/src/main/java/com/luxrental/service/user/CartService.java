package com.luxrental.service.user;

import com.luxrental.controller.cart.dto.request.CartItemRequest;
import com.luxrental.controller.cart.dto.response.CartDeviceDTO;
import com.luxrental.controller.cart.dto.response.CartItemResponse;
import com.luxrental.controller.cart.dto.response.CartResponse;
import com.luxrental.entity.cart.CartItem;
import com.luxrental.entity.device.Device;
import com.luxrental.entity.product.Product;
import com.luxrental.entity.product.ProductImage;
import com.luxrental.entity.user.User;
import com.luxrental.enums.CartItemStatus;
import com.luxrental.repository.user.CartItemRepository;
import com.luxrental.repository.product.DeviceCalendarRepository;
import com.luxrental.repository.product.DeviceRepository;
import com.luxrental.repository.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.access.AccessDeniedException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;
    private final DeviceCalendarRepository deviceCalendarRepository;

    @Transactional
    public void addToCart(CartItemRequest request, Long userId) {
        if (request.endDate().isBefore(request.startDate())) {
            throw new IllegalArgumentException("Ngày trả máy không được trước ngày nhận máy!");
        }
        if (request.startDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Không được chọn ngày nhận máy trong quá khứ!");
        }

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy tài khoản người dùng!"));

        Device device = deviceRepository.findById(request.deviceId())
            .orElseThrow(() -> new EntityNotFoundException("Thiết bị không tồn tại hoặc đã bị gỡ!"));

        List<LocalDate> requestedDates = request.startDate()
            .datesUntil(request.endDate().plusDays(1))
            .toList();

        long blockedCount = deviceCalendarRepository.countBlockedDates(device.getId(), requestedDates);
        if (blockedCount > 0) {
            throw new IllegalStateException("Thiết bị đã có lịch bận hoặc được thuê trong khoảng thời gian này!");
        }

        Optional<CartItem> existingItem = cartItemRepository.findDuplicateItem(
            userId, device.getId(), request.startDate(), request.endDate(), CartItemStatus.ACTIVE
        );

        if (existingItem.isPresent()) {
            return;
        }

        int rentalDays = (int) ChronoUnit.DAYS.between(request.startDate(), request.endDate()) + 1;

        CartItem cartItem = CartItem.builder()
            .user(user)
            .device(device)
            .startDate(request.startDate())
            .endDate(request.endDate())
            .rentalDays(rentalDays)
            .status(CartItemStatus.ACTIVE)
            .build();

        cartItemRepository.save(cartItem);
    }

    @Transactional(readOnly = true)
    public CartResponse getCartByUserId(Long userId) {
        List<CartItem> cartItems = cartItemRepository.findByUserIdAndStatus(userId, CartItemStatus.ACTIVE);

        List<CartItemResponse> itemResponses = cartItems.stream().map(item -> {
            Device device = item.getDevice();
            Product product = device.getProduct();
            User owner = device.getOwner();

            // Lấy ảnh đại diện của dòng sản phẩm (Product Image)
            String primaryImageUrl = product.getImages().stream()
                .filter(ProductImage::isPrimary)
                .map(ProductImage::getImageUrl)
                .findFirst()
                .orElse("https://placehold.co"); // Link dự phòng nếu máy không có ảnh

            // Tạo DTO thông tin thiết bị con
            CartDeviceDTO deviceDTO = new CartDeviceDTO(
                device.getId(),
                product.getName(),
                primaryImageUrl,
                owner.getFullName(),
                device.getPricePerDay(),
                device.getDepositValue()
            );

            // Tính tiền thuê riêng của item này = rental_days * price_per_day
            BigDecimal subTotalRentalFee = device.getPricePerDay()
                .multiply(BigDecimal.valueOf(item.getRentalDays()));

            return new CartItemResponse(
                item.getId(),
                item.getStartDate(),
                item.getEndDate(),
                item.getRentalDays(),
                subTotalRentalFee,
                deviceDTO
            );
        }).toList();

        BigDecimal totalRentalFeeAll = BigDecimal.ZERO;
        BigDecimal totalDepositAll = BigDecimal.ZERO;

        for (CartItemResponse item : itemResponses) {
            totalRentalFeeAll = totalRentalFeeAll.add(item.subTotalRentalFee());
            totalDepositAll = totalDepositAll.add(item.device().depositValue());
        }

        BigDecimal grandTotal = totalRentalFeeAll.add(totalDepositAll);

        return new CartResponse(itemResponses, totalRentalFeeAll, totalDepositAll, grandTotal);
    }

    @Transactional
    public void deleteCartItem(Long cartItemId, Long userId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
            .orElseThrow(() -> new EntityNotFoundException("Món đồ này không tồn tại trong giỏ hàng!"));

        if (!cartItem.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("Bạn không có quyền xóa món đồ này!");
        }

        cartItemRepository.delete(cartItem);
    }

}
