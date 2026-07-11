package com.luxrental.controller.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RevealKycRequest {

    @NotBlank(message = "{error.password.required}")
    private String password;
}
