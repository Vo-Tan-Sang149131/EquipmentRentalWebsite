package com.luxrental.controller.auth.dto.request;

import com.luxrental.common.constants.ValidationConstants;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

    @NotBlank(message = "{username.not.blank}")
    @Pattern(regexp = ValidationConstants.USERNAME_PATTERN, message = "{username.pattern}")
    private String username;

    @NotBlank(message = "{password.not.blank}")
    @Pattern(regexp = ValidationConstants.PASSWORD_PATTERN, message = "{password.pattern}")
    private String password;

    @NotBlank(message = "{email.not.blank}")
    @Email(message = "{email.invalid}")
    private String email;

    @NotBlank(message = "{full_name.not.blank}")
    private String fullName;

    @NotBlank(message = "{phone_number.not.blank}")
    @Size(min = 10, max = 15, message = "{phone_number.size}")
    @Pattern(regexp = ValidationConstants.PHONE_NUMBER_PATTERN, message = "{phone_number.pattern}")
    private String phoneNumber;
}
