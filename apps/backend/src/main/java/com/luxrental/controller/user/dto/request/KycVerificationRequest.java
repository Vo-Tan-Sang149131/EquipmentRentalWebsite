package com.luxrental.controller.user.dto.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class KycVerificationRequest {
    private String kycCardNumber;
    private MultipartFile kycCardFrontFile; // Front of id card
    private MultipartFile kycCardBackFile;  // Behind of id card
}
