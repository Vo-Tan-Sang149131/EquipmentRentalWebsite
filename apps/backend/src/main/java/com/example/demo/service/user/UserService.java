package com.example.demo.service.user;

import com.example.demo.common.annotation.RateLimit;
import com.example.demo.dto.auth.request.RegisterRequest;
import com.example.demo.dto.user.request.BasicProfileRequest;
import com.example.demo.dto.user.request.ChangePasswordRequest;
import com.example.demo.dto.user.request.KycVerificationRequest;
import com.example.demo.dto.user.response.UserProfileResponse;
import com.example.demo.dto.user.response.UserResponse;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.entity.UserKycVerification;
import com.example.demo.enumValues.KycStatus;
import com.example.demo.enumValues.RoleType;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.mappers.IUserMapper;
import com.example.demo.repository.order.OrderRepository;
import com.example.demo.repository.product.DeviceRepository;
import com.example.demo.repository.user.RoleRepository;
import com.example.demo.repository.user.UserRepository;
import com.example.demo.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.slf4j.MDC;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final CloudinaryService cloudinaryService;
    private final IUserMapper userMapper;
    private final DeviceRepository deviceRepository;
    private final OrderRepository orderRepository;


    @RateLimit(limit = 5, duration = 300)
    @Transactional
    public UserResponse registerUser(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }
        if (request.getPhoneNumber() != null && userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new AppException(ErrorCode.PHONE_ALREADY_EXISTS);
        }

        MDC.put("username", request.getUsername());

        Role defaultRole = roleRepository.findByRole(RoleType.RENTER)
            .orElseThrow(() -> new AppException(ErrorCode.DEFAULT_ROLE_NOT_FOUND));

        User newUser = userMapper.mapToEntity(request);


        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setRoles(Set.of(defaultRole));
        newUser.setEnabled(true);

        userRepository.save(newUser);
        return userMapper.mapToResponse(newUser);
    }


    public boolean checkUsernameExists(String username) {
        return userRepository.existsByUsername(username.trim());
    }

    public boolean checkEmailExists(String email) {
        return userRepository.existsByEmail(email.trim());
    }

    private String getCurrentUsername() {
        return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
            .filter(Authentication::isAuthenticated)
            .map(Authentication::getName)
            .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));
    }

    @Transactional
    public void updateBasicProfile(BasicProfileRequest request) {
        String currentName = getCurrentUsername();
        User user = userRepository.findByUsername(currentName)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (request.getAvatarFile() != null && !request.getAvatarFile().isEmpty()) {
            String uploadedImageUrl = cloudinaryService.uploadFile(request.getAvatarFile());
            user.setAvatarUrl(uploadedImageUrl);
        }

        if (request.getPhoneNumber() != null && !request.getPhoneNumber().isBlank()) {
            if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
                throw new AppException(ErrorCode.PHONE_ALREADY_EXISTS);
            }
            user.setPhoneNumber(request.getPhoneNumber());
        }

        userRepository.save(user);
    }


    @Transactional
    public void verifyIdentification(KycVerificationRequest request) {
        String currentName = getCurrentUsername();
        User user = userRepository.findByUsername(currentName)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        boolean hasPending = user.getKycVerifications().stream()
            .anyMatch(kyc -> kyc.getStatus() == KycStatus.PENDING);
        if (hasPending) {
            throw new AppException(ErrorCode.KYC_ALREADY_PENDING);
        }

        String frontImageUrl = "";
        if (request.getKycCardFrontFile() != null && !request.getKycCardFrontFile().isEmpty()) {
            frontImageUrl = cloudinaryService.uploadFile(request.getKycCardFrontFile());
        }

        String backImageUrl = "";
        if (request.getKycCardBackFile() != null && !request.getKycCardBackFile().isEmpty()) {
            backImageUrl = cloudinaryService.uploadFile(request.getKycCardBackFile());
        }

        UserKycVerification kycVerification = UserKycVerification.builder()
            .user(user)
            .idCardNumber(request.getKycCardNumber())
            .idCardFrontUrl(frontImageUrl)
            .idCardBackUrl(backImageUrl)
            .status(KycStatus.PENDING)
            .build();

        user.getKycVerifications().add(kycVerification);
        userRepository.save(user);
    }


    @Transactional
    public void updatePassword(ChangePasswordRequest request) {
        String currentName = getCurrentUsername();
        User user = userRepository.findByUsername(currentName)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (user.getPassword() != null) {
            // Normal login
            if (request.getOldPassword() == null || request.getOldPassword().isBlank()) {
                throw new AppException(ErrorCode.VALIDATION_ERROR);
            }
            if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
                throw new AppException(ErrorCode.PASSWORD_INCORRECT);
            }
        } else {
            // Social login
            if (request.getNewPassword() == null || request.getNewPassword().isBlank()) {
                throw new AppException(ErrorCode.VALIDATION_ERROR);
            }
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    // Thêm vào file UserService.java của bạn
    @Transactional(readOnly = true)
    public String revealKycCardNumber(String plainPassword) {
        String currentName = getCurrentUsername();
        User user = userRepository.findByUsername(currentName)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // 1. If the user hasn't set a password yet, throw an error'
        if (user.getPassword() == null) {
            throw new AppException(ErrorCode.PASSWORD_NOT_SET);
        }

        // 2. Verify the password from the client:
        if (!passwordEncoder.matches(plainPassword, user.getPassword())) {
            throw new AppException(ErrorCode.PASSWORD_INCORRECT);
        }

        // 3. Find the latest record of KYC verification
        UserKycVerification latestKyc = user.getKycVerifications().stream()
            .max(Comparator.comparing(UserKycVerification::getCreatedAt))
            .orElseThrow(() -> new AppException(ErrorCode.KYC_NOT_FOUND));

        return latestKyc.getIdCardNumber();
    }


    // Use to get all user information
    public UserProfileResponse getUserProfile() {
        String currentName = getCurrentUsername();

        User user = userRepository.findUserWithKycAndRolesByUsername(currentName)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Find the latest record of KYC verification
        UserKycVerification latestKyc = user.getKycVerifications().stream()
            .max(Comparator.comparing(UserKycVerification::getCreatedAt))
            .orElse(null);

        List<String> rolesList = user.getRoles().stream()
            .map(r -> r.getRole().name())
            .toList();

        return UserProfileResponse.builder()
            .username(user.getUsername())
            .fullName(user.getFullName())
            .email(user.getEmail())
            .phoneNumber(user.getPhoneNumber())
            .avatarUrl(user.getAvatarUrl())
            .roles(rolesList)
            .trustScore(user.getTrustScore() != null ? user.getTrustScore().doubleValue() : 5.0)

            // If the user hasn't added KYC, set to 'NOT_STARTED' for frontend filter
            .kycCardNumber(latestKyc != null ? maskIdCardNumber(latestKyc.getIdCardNumber()) : null)
            .kycStatus(latestKyc != null ? latestKyc.getStatus().name() : "NOT_STARTED")
            .kycVerifiedAt(latestKyc != null && latestKyc.getVerifiedAt() != null ? latestKyc.getVerifiedAt().toString() : null)
            .build();
    }

    private String maskIdCardNumber(String idCardNumber) {
        if (idCardNumber == null || idCardNumber.isBlank()) {
            return null;
        }
        if (idCardNumber.length() == 12) {
            return idCardNumber.substring(0, 3) + "******" + idCardNumber.substring(9);
        }
        if (idCardNumber.length() > 6) {
            return idCardNumber.substring(0, 3) + "******" + idCardNumber.substring(idCardNumber.length() - 3);
        }
        return "******";
    }

    // ADMIN helper: list all users (basic info)
    @Transactional(readOnly = true)
    public java.util.List<com.example.demo.dto.user.response.UserResponse> listAllUsers() {
        return userRepository.findAll().stream()
            .map(u -> com.example.demo.dto.user.response.UserResponse.builder()
                .id(u.getId())
                .username(u.getUsername())
                .email(u.getEmail())
                .fullName(u.getFullName())
                .avatarUrl(u.getAvatarUrl())
                .enabled(u.isEnabled())
                .roles(u.getRoles().stream().map(r -> r.getRole().name()).collect(java.util.stream.Collectors.toSet()))
                .build())
            .toList();
    }

    @Transactional
    public void toggleUserEnabled(Long userId) {
        var user = userRepository.findById(userId).orElseThrow(() -> new com.example.demo.exception.AppException(com.example.demo.exception.ErrorCode.USER_NOT_FOUND));
        user.setEnabled(!user.isEnabled());
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public com.example.demo.dto.user.response.UserResponse getUserDetailForAdmin(Long userId) {
        var user = userRepository.findById(userId)
            .orElseThrow(() -> new com.example.demo.exception.AppException(com.example.demo.exception.ErrorCode.USER_NOT_FOUND));

        return com.example.demo.dto.user.response.UserResponse.builder()
            .id(user.getId())
            .username(user.getUsername())
            .email(user.getEmail())
            .fullName(user.getFullName())
            .avatarUrl(user.getAvatarUrl())
            .enabled(user.isEnabled())
            .roles(user.getRoles().stream().map(r -> r.getRole().name()).collect(java.util.stream.Collectors.toSet()))
            .build();
    }

    @Transactional
    public void updateUserRoles(Long userId, java.util.Set<String> roleNames) {
        var user = userRepository.findById(userId)
            .orElseThrow(() -> new com.example.demo.exception.AppException(com.example.demo.exception.ErrorCode.USER_NOT_FOUND));

        // Convert role names to Role entities
        var newRoles = new java.util.HashSet<com.example.demo.entity.Role>();
        for (String roleName : roleNames) {
            try {
                var roleType = com.example.demo.enumValues.RoleType.valueOf(roleName.toUpperCase());
                var role = roleRepository.findByRole(roleType)
                    .orElseThrow(() -> new com.example.demo.exception.AppException(com.example.demo.exception.ErrorCode.DEFAULT_ROLE_NOT_FOUND));
                newRoles.add(role);
            } catch (IllegalArgumentException e) {
                throw new com.example.demo.exception.AppException(com.example.demo.exception.ErrorCode.DEFAULT_ROLE_NOT_FOUND);
            }
        }

        user.setRoles(newRoles);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public java.util.Map<String, Object> getAdminStats() {
        var users = userRepository.findAll();
        long totalUsers = users.size();
        long ownerCount = users.stream()
            .filter(u -> u.getRoles().stream().anyMatch(r -> r.getRole() == RoleType.OWNER))
            .count();
        long renterCount = users.stream()
            .filter(u -> u.getRoles().stream().anyMatch(r -> r.getRole() == RoleType.RENTER))
            .count();

        long totalDevices = deviceRepository.count();
        long totalOrders = orderRepository.count();

        var orders = orderRepository.findAll();
        java.math.BigDecimal totalRevenue = orders.stream()
            .filter(o -> o.getStatus() != com.example.demo.enumValues.OrderStatus.CANCELLED)
            .map(o -> o.getTotalPrice() != null ? o.getTotalPrice() : java.math.BigDecimal.ZERO)
            .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

        return java.util.Map.of(
            "totalUsers", totalUsers,
            "totalOwners", ownerCount,
            "totalRenters", renterCount,
            "totalDevices", totalDevices,
            "totalOrders", totalOrders,
            "totalRevenue", totalRevenue,
            "activeUsers", users.stream().filter(User::isEnabled).count()
        );
    }

}
