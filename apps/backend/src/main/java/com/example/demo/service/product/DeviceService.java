package com.example.demo.service.product;

import com.example.demo.dto.product.core.response.ProductInformation;
import com.example.demo.dto.product.core.response.ProductResponse;
import com.example.demo.dto.product.core.response.SpecificationDTO;
import com.example.demo.dto.product.device.response.*;
import com.example.demo.dto.product.owner.OwnerDTO;
import com.example.demo.dto.product.device.request.DeviceImageRequest;
import com.example.demo.dto.product.device.request.DeviceRequest;
import com.example.demo.dto.product.review.ReviewDTO;
import com.example.demo.entity.*;
import com.example.demo.enumValues.DeviceStatus;
import com.example.demo.repository.product.DeviceCalendarRepository;
import com.example.demo.repository.product.DeviceImageRepository;
import com.example.demo.repository.product.DeviceRepository;
import com.example.demo.repository.product.ProductRepository;
import com.example.demo.repository.review.ProductReviewRepository;
import com.example.demo.repository.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DeviceService {
    private final DeviceRepository deviceRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final DeviceImageService deviceImageService;
    private final ProductService productService;
    private final DeviceImageRepository deviceImageRepository;
    private final ProductReviewRepository productReviewRepository;
    private final DeviceCalendarRepository deviceCalendarRepository;

    @Transactional
    public void createProductItem(DeviceRequest request, Long authenticatedUserId) {
        Product product = productRepository.findById(request.getProductId())
            .orElseThrow(() -> new EntityNotFoundException("Not found product with id: " + request.getProductId()));

        User owner = userRepository.findById(authenticatedUserId)
            .orElseThrow(() -> new EntityNotFoundException("Not found user with id: " + authenticatedUserId));

        Device newItem = Device.builder()
            .product(product)
            .owner(owner)
            .serialNumber(request.getSerialNumber())
            .conditionPercent(request.getConditionPercent())
            .pricePerDay(request.getPricePerDay())
            .depositValue(request.getDepositValue())
            .status(DeviceStatus.PENDING_APPROVAL)
            .build();

        Device savedItem = deviceRepository.save(newItem);
        deviceImageService.saveItemImages(savedItem, request.getPrimaryImageUrl(), request.getSubImages());
    }

    @Transactional
    public void approveProductItem(Long itemId) {
        Device item = deviceRepository.findById(itemId)
            .orElseThrow(() -> new EntityNotFoundException("Not found device with id: " + itemId));

        item.setStatus(DeviceStatus.APPROVED);
        deviceRepository.save(item);

        productService.updateBasePrice(item.getProduct().getId());
    }

    @Transactional(readOnly = true)
    public DeviceDetailResponse getDeviceDetail(Long productId) {
        Device device = deviceRepository.findFirstByProductIdAndStatus(productId, DeviceStatus.APPROVED)
            .orElseThrow(() -> new EntityNotFoundException("Dòng sản phẩm này hiện tại không có máy nào sẵn sàng cho thuê!"));

        Product product = device.getProduct();
        User owner = device.getOwner();

        List<SpecificationDTO> specificationDTOs = new ArrayList<>();
        if (product.getSpecifications() != null) {
            product.getSpecifications().forEach((key, value) ->
                specificationDTOs.add(new SpecificationDTO(key, String.valueOf(value)))
            );
        }

        List<String> includedItemsList = new ArrayList<>();
        if (product.getAccessoriesIncluded() != null && !product.getAccessoriesIncluded().isBlank()) {
            includedItemsList = Arrays.stream(product.getAccessoriesIncluded().split("\\R"))
                .map(String::trim)
                .filter(item -> !item.isEmpty())
                .toList();
        }

        ProductInformation productInfo = new ProductInformation(
            product.getId(),
            product.getName(),
            product.getSlug(),
            product.getCategory() != null ? product.getCategory().getName() : null,
            product.getBrand() != null ? product.getBrand().getName() : null,
            product.getDescription(),
            specificationDTOs,
            includedItemsList
        );

        String calculatedAvailability = "AVAILABLE";
        var todayCalendar = deviceCalendarRepository.findByDeviceIdAndEventDate(device.getId(), LocalDate.now());
        if (todayCalendar.isPresent()) {
            calculatedAvailability = switch (todayCalendar.get().getStatus()) {
                case BOOKED -> "RENTED";
                case OWNER_BLOCK -> "RESERVED";
                case MAINTENANCE -> "MAINTENANCE";
            };
        }

        List<DeviceImage> deviceImages = deviceImageRepository.findByDeviceId(device.getId());
        List<DeviceImageDTO> imageDTOs = deviceImages.stream()
            .map(img -> new DeviceImageDTO(img.getId(), img.getImageUrl(), img.isPrimary()))
            .toList();

        List<LocalDate> futureBlockedDates = deviceCalendarRepository.findFutureBlockedDatesByDeviceId(device.getId());
        List<String> bookDatesStr = futureBlockedDates.stream()
            .map(LocalDate::toString)
            .toList();

        DeviceInformation deviceInfo = new DeviceInformation(
            device.getId(),
            owner.getId(),
            device.getConditionPercent(),
            calculatedAvailability,
            device.getPricePerDay(),
            device.getDepositValue(),
            BigDecimal.ZERO,
            imageDTOs,
            bookDatesStr
        );

        OwnerDTO ownerInfo = new OwnerDTO(
            owner.getId(),
            owner.getFullName(),
            owner.getAvatarUrl(),
            true
        );

        List<ProductReview> latestReviews = productReviewRepository.findLatestReviewsByDeviceId(device.getId(), PageRequest.of(0, 3));
        List<ReviewDTO> reviewDTOs = latestReviews.stream()
            .map(rev -> new ReviewDTO(
                rev.getId(),
                rev.getRenter() != null ? rev.getRenter().getUsername() : "Ẩn danh",
                rev.getRating(),
                rev.getComment(),
                rev.getCreatedAt()
            ))
            .toList();

        List<ProductResponse> relatedProducts = productService.getTop4RelatedProducts(
            product.getCategory() != null ? product.getCategory().getName() : null,
            product.getId()
        );

        return new DeviceDetailResponse(
            productInfo,
            deviceInfo,
            ownerInfo,
            reviewDTOs,
            relatedProducts
        );
    }

    @Transactional(readOnly = true)
    public DeviceEditResponse getDeviceForOwnerEdit(Long deviceId, Long ownerId) {
        Device device = deviceRepository.findById(deviceId)
            .orElseThrow(() -> new EntityNotFoundException("Device not found"));

        if (!device.getOwner().getId().equals(ownerId)) {
            throw new org.springframework.security.access.AccessDeniedException("You do not own this device");
        }

        var images = deviceImageRepository.findByDeviceId(deviceId).stream()
            .map(img -> DeviceEditResponse.DeviceImageDTO.builder()
                .id(img.getId())
                .imageUrl(img.getImageUrl())
                .isPrimary(img.isPrimary())
                .build())
            .toList();

        return DeviceEditResponse.builder()
            .id(device.getId())
            .productId(device.getProduct().getId())
            .productName(device.getProduct().getName())
            .serialNumber(device.getSerialNumber())
            .conditionPercent(device.getConditionPercent())
            .pricePerDay(device.getPricePerDay())
            .depositValue(device.getDepositValue())
            .status(device.getStatus().name())
            .images(images)
            .build();
    }

    @Transactional
    public void updateDeviceByOwner(Long deviceId, Long ownerId, com.example.demo.dto.product.device.request.DeviceUpdateRequest request) {
        Device device = deviceRepository.findById(deviceId)
            .orElseThrow(() -> new EntityNotFoundException("Device not found"));

        if (!device.getOwner().getId().equals(ownerId)) {
            throw new org.springframework.security.access.AccessDeniedException("You do not own this device");
        }

        if (request.getPricePerDay() != null) {
            device.setPricePerDay(request.getPricePerDay());
        }
        if (request.getDepositValue() != null) {
            device.setDepositValue(request.getDepositValue());
        }

        deviceRepository.save(device);
        productService.updateBasePrice(device.getProduct().getId());
    }

    @Transactional
    public void setDevicePrimaryImage(Long deviceId, Long imageId, Long ownerId) {
        Device device = deviceRepository.findById(deviceId)
            .orElseThrow(() -> new EntityNotFoundException("Device not found"));

        if (!device.getOwner().getId().equals(ownerId)) {
            throw new org.springframework.security.access.AccessDeniedException("You do not own this device");
        }

        device.getDeviceImages().forEach(img -> img.setPrimary(false));

        device.getDeviceImages().stream()
            .filter(img -> img.getId().equals(imageId))
            .findFirst()
            .ifPresentOrElse(
                img -> img.setPrimary(true),
                () -> {
                    throw new EntityNotFoundException("Image not found");
                }
            );

        deviceRepository.save(device);
    }

    @Transactional
    public void deleteDeviceImage(Long deviceId, Long imageId, Long ownerId) {
        Device device = deviceRepository.findById(deviceId)
            .orElseThrow(() -> new EntityNotFoundException("Device not found"));

        if (!device.getOwner().getId().equals(ownerId)) {
            throw new org.springframework.security.access.AccessDeniedException("You do not own this device");
        }

        var image = deviceImageRepository.findById(imageId)
            .orElseThrow(() -> new EntityNotFoundException("Image not found"));

        if (!image.getDevice().getId().equals(deviceId)) {
            throw new IllegalArgumentException("Image does not belong to this device");
        }

        device.getDeviceImages().remove(image);
        deviceImageRepository.delete(image);
        deviceRepository.save(device);
    }

    @Transactional
    public void addDeviceImage(Long deviceId, String imageUrl, Long ownerId) {
        Device device = deviceRepository.findById(deviceId)
            .orElseThrow(() -> new EntityNotFoundException("Device not found"));

        if (!device.getOwner().getId().equals(ownerId)) {
            throw new org.springframework.security.access.AccessDeniedException("You do not own this device");
        }

        DeviceImage newImage = DeviceImage.builder()
            .device(device)
            .imageUrl(imageUrl)
            .isPrimary(device.getDeviceImages().isEmpty())
            .imageType(com.example.demo.enumValues.ImageType.REAL_SHOT)
            .build();

        deviceImageRepository.save(newImage);
    }

    // For Owner Dashboard
    @Transactional(readOnly = true)
    public List<DeviceManageResponse> getDevicesByOwner(Long ownerId) {
        List<Device> myDevices = deviceRepository.findByOwnerId(ownerId);
        return getDeviceManageResponses(myDevices);
    }

    @Transactional(readOnly = true)
    public Page<DeviceManageResponse> getDevicesByOwnerPaged(Long ownerId, Pageable pageable) {
        Page<Device> devicePage = deviceRepository.findByOwnerIdPaged(ownerId, pageable);
        List<DeviceManageResponse> responses = devicePage.getContent().stream().map(device -> {
            List<DeviceImageRequest> allImages = device.getDeviceImages().stream()
                .map(img -> new DeviceImageRequest(img.getImageUrl(), img.getImageType().name()))
                .toList();
            return new DeviceManageResponse(
                device.getId(), device.getProduct().getId(), device.getProduct().getName(),
                device.getSerialNumber(), device.getConditionPercent(),
                device.getPricePerDay(), device.getDepositValue(),
                device.getStatus().name(), allImages
            );
        }).toList();
        return new PageImpl<>(responses, pageable, devicePage.getTotalElements());
    }

    @NonNull
    private List<DeviceManageResponse> getDeviceManageResponses(List<Device> myDevices) {
        return myDevices.stream().map(device -> {
            List<DeviceImageRequest> allImages = device.getDeviceImages().stream()
                .map(img -> new DeviceImageRequest(img.getImageUrl(), img.getImageType().name()))
                .toList();

            return new DeviceManageResponse(
                device.getId(),
                device.getProduct().getId(),
                device.getProduct().getName(),
                device.getSerialNumber(),
                device.getConditionPercent(),
                device.getPricePerDay(),
                device.getDepositValue(),
                device.getStatus().name(),
                allImages
            );
        }).toList();
    }

    @Transactional(readOnly = true)
    public List<DeviceManageResponse> getDevicesByStatus(com.example.demo.enumValues.DeviceStatus status) {
        List<Device> devices = deviceRepository.findAll().stream()
            .filter(d -> d.getStatus() == status)
            .toList();

        return getDeviceManageResponses(devices);
    }
}
