package com.example.demo.dto.user.request;

import com.example.demo.enumValues.UserGender;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Data
public class BasicProfileRequest {
    @Pattern(regexp = "^$|[0-9]{10,15}", message = "Phone number must be between 10 and 15 digits")
    private String phoneNumber;

    private MultipartFile avatarFile;

    private UserGender gender;

    private LocalDate dob;

    private String address;

    private String bio;
}
