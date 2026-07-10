package com.luxrental.controller.upload;

import com.luxrental.common.dto.MyApiResponse;
import com.luxrental.controller.BaseController;
import com.luxrental.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/uploads")
@RequiredArgsConstructor
@PreAuthorize("hasRole('OWNER')")
public class UploadController extends BaseController {

    private final CloudinaryService cloudinaryService;

    // API for uploading images (binary data)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MyApiResponse<String>> uploadImage(@RequestParam("file") MultipartFile file) {
        String url = cloudinaryService.uploadFile(file);
        return createResponse(HttpStatus.OK, 1000, "Tải ảnh lên thành công", url);
    }
}
