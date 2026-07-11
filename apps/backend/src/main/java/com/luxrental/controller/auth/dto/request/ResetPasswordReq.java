package com.luxrental.controller.auth.dto.request;

import com.luxrental.common.constants.ValidationConstants;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResetPasswordReq {
    @NotBlank(message = "{token.not.blank}")
    private String token;
    @NotBlank(message = "{password.not.blank}")
    @Pattern(regexp = ValidationConstants.PASSWORD_PATTERN,
        message = "{password.pattern}")
    private String newPassword;
}
