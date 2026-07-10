package com.example.demo.controller.user;

import com.example.demo.controller.BaseController;
import com.example.demo.dto.MyApiResponse;
import com.example.demo.dto.user.request.BasicProfileRequest;
import com.example.demo.dto.user.request.ChangePasswordRequest;
import com.example.demo.dto.user.request.KycVerificationRequest;
import com.example.demo.dto.user.request.RevealKycRequest;
import com.example.demo.dto.user.response.UserProfileResponse;
import com.example.demo.service.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users/profile")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN') or hasRole('RENTER') or hasRole('OWNER')")
public class UserController extends BaseController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<MyApiResponse<UserProfileResponse>> getMyProfile() {
        return createResponse(HttpStatus.OK, 1000, "Success", userService.getUserProfile());
    }

    @PutMapping("/basic")
    public ResponseEntity<MyApiResponse<String>> updateBasicProfile(@ModelAttribute @Valid BasicProfileRequest request) {
        userService.updateBasicProfile(request);
        return createResponse(HttpStatus.OK, 1000, "Update Information Successfully", null);
    }

    @PutMapping("/change-password")
    public ResponseEntity<MyApiResponse<String>> changePassword(@RequestBody @Valid ChangePasswordRequest request) {
        userService.updatePassword(request);
        return createResponse(HttpStatus.OK, 1000, "Change Password Successfully", null);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/verify-kyc")
    public ResponseEntity<MyApiResponse<String>> verifyKyc(@ModelAttribute @Valid KycVerificationRequest request) {
        userService.verifyIdentification(request);
        return createResponse(HttpStatus.OK, 1000, "Require KYC successfully", null);
    }

    @PreAuthorize("hasRole('RENTER') or hasRole('OWNER')")
    @PostMapping("/reveal-kyc")
    public ResponseEntity<MyApiResponse<String>> revealIdCardNumber(@RequestBody @Valid RevealKycRequest request) {
        String plainIdCardNumber = userService.revealKycCardNumber(request.getPassword());
        return createResponse(HttpStatus.OK, 1000, "Verify Identity Successfully", plainIdCardNumber);
    }
}
