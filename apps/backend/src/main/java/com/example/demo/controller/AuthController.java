package com.example.demo.controller;

import com.example.demo.dto.MyApiResponse;
import com.example.demo.dto.auth.request.*;
import com.example.demo.dto.auth.response.TokenRefreshResponse;
import com.example.demo.dto.user.response.UserResponse;
import com.example.demo.exception.AppException;
import com.example.demo.service.TokenService;
import com.example.demo.service.auth.AuthService;
import com.example.demo.service.user.UserService;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.auth.response.JwtResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.Map;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Validated // Enable this for validation annotations Eg: @NotBlank
@Tag(name = "Authentication", description = "Authentication endpoints")
public class AuthController extends BaseController {

    private final UserService userService;
    private final AuthService authService;
    private final TokenService tokenService;
    private final MessageSource messageSource;

    @PostMapping("/login")
    @Operation(summary = "Login user", description = "Authenticate user and get JWT token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login successful"),
        @ApiResponse(responseCode = "401", description = "Invalid credentials"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @io.swagger.v3.oas.annotations.security.SecurityRequirements
    public ResponseEntity<MyApiResponse<JwtResponse>> login(@Valid @RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        return createResponse(HttpStatus.OK, authService.login(loginRequest, response));
    }

    @PostMapping("/register")
    @Operation(summary = "Register new user", description = "Create a new user account")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "User created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid user data"),
        @ApiResponse(responseCode = "409", description = "User already exists")
    })
    @io.swagger.v3.oas.annotations.security.SecurityRequirements
    public ResponseEntity<MyApiResponse<UserResponse>> register(@Valid @RequestBody RegisterRequest request) {

        return createResponse(HttpStatus.CREATED, userService.registerUser(request));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout user", description = "Invalidate the current JWT token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Logout successful"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
    })
    @io.swagger.v3.oas.annotations.security.SecurityRequirements
    public ResponseEntity<MyApiResponse<String>> logout(
        @RequestHeader("Authorization") String headerAuthorization,
        @CookieValue(name = "refresh_token", required = false) String refreshTokenFromCookie,
        HttpServletResponse response) {

        authService.logout(headerAuthorization, refreshTokenFromCookie, response);
        String localizedMessage = messageSource.getMessage("auth.logout.success", null, LocaleContextHolder.getLocale());
        return createResponse(HttpStatus.OK, 1000, localizedMessage, "Session has been cleared.");
    }

    @PostMapping("/refresh-token")
    @Operation(summary = "Refresh JWT token", description = "Get a new JWT token using a valid refresh token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Token refreshed successfully"),
        @ApiResponse(responseCode = "401", description = "Invalid refresh token"),
    })
    @io.swagger.v3.oas.annotations.security.SecurityRequirements
    public ResponseEntity<MyApiResponse<TokenRefreshResponse>> refreshToken(
        @CookieValue(name = "refresh_token", required = false) String refreshTokenFromCookie,
        HttpServletResponse response) {

        // Read directly from the cookie, no need to pass it in the request body
        return createResponse(HttpStatus.OK, authService.refreshToken(refreshTokenFromCookie, response));
    }

    /**
     * REST Endpoint for handling forgot password requests.
     * * SECURITY NOTE (Compliance with OWASP Standards):
     * To prevent User Enumeration and mitigate Phishing risks, this endpoint
     * MUST always return a generic success message (HTTP 200) regardless of
     * whether the email exists in the database or not.
     */
    @PostMapping("/forgot-password")
    @Operation(summary = "Forgot password", description = "Send a reset password link to user's email")
    @io.swagger.v3.oas.annotations.security.SecurityRequirements
    public ResponseEntity<MyApiResponse<String>> forgotPassword(@Valid @RequestBody ForgotPasswordReq request) {
        authService.forgotPassword(request);
        return createResponse(HttpStatus.OK, 1000, "Email sent successfully", "A password reset link has been sent to your email if it exists in our system.");
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password", description = "Reset user password using the token from email")
    @io.swagger.v3.oas.annotations.security.SecurityRequirements
    public ResponseEntity<MyApiResponse<String>> resetPassword(@Valid @RequestBody ResetPasswordReq request) {
        authService.resetPassword(request);
        return createResponse(HttpStatus.OK, 1000, "Password reset successfully", "Your password has been reset successfully. You can now log in with your new password.");
    }

    @PostMapping("/validate-token")
    @Operation(summary = "Validate reset token", description = "Check if reset token is still valid")
    @io.swagger.v3.oas.annotations.security.SecurityRequirements
    public ResponseEntity<MyApiResponse<Boolean>> validateToken(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        try {
            tokenService.validateToken(token);
            return createResponse(HttpStatus.OK, true);
        } catch (AppException e) {
            return createResponse(HttpStatus.BAD_REQUEST, false);
        }
    }


    @GetMapping("/check-email")
    @Operation(summary = "Check email existence", description = "Check if an email is already registered")
    @io.swagger.v3.oas.annotations.security.SecurityRequirements
    public ResponseEntity<MyApiResponse<Boolean>> checkEmail(
        @RequestParam @NotBlank @Email String email) {
        return createResponse(HttpStatus.OK, userService.checkEmailExists(email));
    }

    @GetMapping("/check-username")
    @Operation(summary = "Check username existence", description = "Check if a username is already taken")
    @io.swagger.v3.oas.annotations.security.SecurityRequirements
    public ResponseEntity<MyApiResponse<Boolean>> checkUsername(@RequestParam @NotBlank String username) {
        return createResponse(HttpStatus.OK, userService.checkUsernameExists(username));
    }
}
