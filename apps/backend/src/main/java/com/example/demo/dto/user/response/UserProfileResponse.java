package com.example.demo.dto.user.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class UserProfileResponse {
    private String username;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String avatarUrl;
    private List<String> roles;
    private double trustScore;

    private ProfileInfo profile;

    private List<AddressInfo> addresses;

    private String kycCardNumber;
    private String kycStatus;
    private LocalDateTime kycVerifiedAt;

    @Data
    @Builder
    public static class ProfileInfo {
        private String gender;
        private LocalDate dob;
        private String address;
        private String bio;
    }

    @Data
    @Builder
    public static class AddressInfo {
        private Long id;
        private String recipientName;
        private String phoneNumber;
        private String province;
        private String district;
        private String ward;
        private String detailAddress;
        private boolean isDefault;
    }
}
