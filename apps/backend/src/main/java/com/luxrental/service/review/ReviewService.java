package com.luxrental.service.review;

import com.luxrental.entity.order.Order;
import com.luxrental.entity.product.Product;
import com.luxrental.entity.product.ProductReview;
import com.luxrental.entity.user.User;
import com.luxrental.entity.user.UserReview;
import com.luxrental.repository.order.OrderRepository;
import com.luxrental.repository.product.ProductRepository; // Nhớ import Repo này nếu cần validate Product
import com.luxrental.repository.review.ProductReviewRepository;
import com.luxrental.repository.review.UserReviewRepository;
import com.luxrental.repository.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ProductReviewRepository productReviewRepository;
    private final UserReviewRepository userReviewRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional
    public ProductReview createProductReview(Long orderId, Long renterId, Long productId, Integer rating, String comment) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new EntityNotFoundException("Order not found"));
        User renter = userRepository.findById(renterId)
            .orElseThrow(() -> new EntityNotFoundException("Renter not found"));
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        ProductReview productReview = ProductReview.builder()
            .order(order)
            .renter(renter)
            .product(product)
            .rating(rating)
            .comment(comment)
            .build();

        return productReviewRepository.save(productReview);
    }

    @Transactional
    public UserReview createUserReview(Long orderId, Long ownerId, Long renterId, Integer rating, String comment) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new EntityNotFoundException("Order not found"));
        User owner = userRepository.findById(ownerId)
            .orElseThrow(() -> new EntityNotFoundException("Owner not found"));
        User renter = userRepository.findById(renterId)
            .orElseThrow(() -> new EntityNotFoundException("Renter not found"));

        UserReview userReview = UserReview.builder()
            .order(order)
            .owner(owner)
            .renter(renter)
            .rating(rating)
            .comment(comment)
            .build();

        UserReview savedReview = userReviewRepository.save(userReview);

        updateUserTrustScore(renterId);

        return savedReview;
    }

    private void updateUserTrustScore(Long renterId) {
        User renter = userRepository.findById(renterId)
            .orElseThrow(() -> new EntityNotFoundException("Renter not found"));

        Double avgRating = userReviewRepository.getAverageRatingByRenterId(renterId);
        if (avgRating != null) {
            renter.setTrustScore(BigDecimal.valueOf(avgRating));
            userRepository.save(renter);
        }
    }
}
