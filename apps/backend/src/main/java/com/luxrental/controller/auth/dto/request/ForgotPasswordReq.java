package com.luxrental.controller.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ForgotPasswordReq {
    @NotBlank(message = "{email.not.blank}")
    @Email(message = "{email.invalid}")
    private String email;
}
