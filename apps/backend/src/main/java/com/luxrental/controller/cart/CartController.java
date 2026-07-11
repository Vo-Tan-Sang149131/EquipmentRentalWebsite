package com.luxrental.controller.cart;

import com.luxrental.controller.BaseController;
import com.luxrental.common.dto.MyApiResponse;
import com.luxrental.controller.cart.dto.request.CartItemRequest;
import com.luxrental.controller.cart.dto.response.CartResponse;
import com.luxrental.security.normal.CustomUserDetails;
import com.luxrental.service.user.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@PreAuthorize("hasRole('RENTER')")
public class CartController extends BaseController {

    private final CartService cartService;

    @PostMapping("/items")
    public ResponseEntity<MyApiResponse<Void>> addToCart(
        @Valid @RequestBody CartItemRequest request,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getId();
        cartService.addToCart(request, userId);
        return createResponse(HttpStatus.CREATED, 1000, "Thêm vào giỏ hàng thành công", null);
    }

    @GetMapping
    public ResponseEntity<MyApiResponse<CartResponse>> getMyCart(
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getId();
        CartResponse cart = cartService.getCartByUserId(userId);
        return createResponse(HttpStatus.OK, 1000, "Lấy thông tin giỏ hàng thành công", cart);
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<MyApiResponse<Void>> removeFromCart(
        @PathVariable Long cartItemId,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getId();
        cartService.deleteCartItem(cartItemId, userId);
        return createResponse(HttpStatus.OK, 1000, "Xóa món đồ khỏi giỏ hàng thành công", null);
    }
}
