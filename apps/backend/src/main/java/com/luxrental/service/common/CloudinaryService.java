package com.luxrental.service.common;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.luxrental.controller.upload.dto.CloudinaryResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;
    private final ObjectMapper objectMapper;

    public String uploadFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File tải lên không được để trống");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Hệ thống chỉ chấp nhận định dạng file ảnh (JPEG, PNG...)");
        }

        try {
            // Pass the raw result expression straight into the object mapper
            CloudinaryResponse uploadResult = objectMapper.convertValue(
                cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap()),
                CloudinaryResponse.class
            );

            return uploadResult.getSecureUrl();

        } catch (IOException e) {
            throw new RuntimeException("Xảy ra lỗi trong quá trình truyền file lên Cloudinary: " + e.getMessage());
        }
    }
}
