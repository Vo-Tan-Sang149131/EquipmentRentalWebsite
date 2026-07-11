package com.luxrental.service.product;

import com.luxrental.controller.product.dto.device.request.DeviceImageRequest;
import com.luxrental.entity.device.Device;
import com.luxrental.entity.device.DeviceImage;
import com.luxrental.enums.ImageType;
import com.luxrental.repository.product.DeviceImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DeviceImageService {
    private final DeviceImageRepository itemImageRepository;

    @Transactional
    public void saveItemImages(Device device, String primaryImageUrl, List<DeviceImageRequest> subImages) {
        // Store primary image
        DeviceImage primaryImg = DeviceImage.builder()
            .device(device)
            .imageUrl(primaryImageUrl)
            .imageType(ImageType.REAL_SHOT)
            .isPrimary(true)
            .build();
        itemImageRepository.save(primaryImg);

        // Iterate through sub-images and save them
        if (subImages != null && !subImages.isEmpty()) {
            for (DeviceImageRequest imgReq : subImages) {
                DeviceImage subImg = DeviceImage.builder()
                    .device(device)
                    .imageUrl(imgReq.imageUrl())
                    .imageType(ImageType.valueOf(imgReq.imageType()))
                    .isPrimary(false)
                    .build();
                itemImageRepository.save(subImg);
            }
        }
    }
}
