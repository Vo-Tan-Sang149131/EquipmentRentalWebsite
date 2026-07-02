package com.example.demo.controller.product;

import com.example.demo.controller.BaseController;
import com.example.demo.dto.MyApiResponse;
import com.example.demo.dto.product.device.request.DeviceRequest;
import com.example.demo.dto.product.device.request.DeviceUpdateRequest;
import com.example.demo.dto.product.device.response.DeviceEditResponse;
import com.example.demo.dto.product.device.response.DeviceDetailResponse;
import com.example.demo.dto.product.device.response.DeviceManageResponse;
import com.example.demo.security.CustomUserDetails;
import com.example.demo.service.product.DeviceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/devices")
@RequiredArgsConstructor
public class DeviceController extends BaseController {

    private final DeviceService deviceService;

    @PreAuthorize("hasRole('OWNER')")
    @PostMapping
    public ResponseEntity<MyApiResponse<Void>> createDevice(
        @RequestBody DeviceRequest request,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getId(); // Get through Lombok Getter
        deviceService.createProductItem(request, userId);
        return createResponse(HttpStatus.CREATED, 1000, "Register new device successfully", null);
    }

    @PreAuthorize("hasRole('OWNER')")
    @GetMapping("/my-inventory")
    public ResponseEntity<MyApiResponse<Page<DeviceManageResponse>>> getMyInventory(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long ownerId = userDetails.getId();
        Page<DeviceManageResponse> inventory = deviceService.getDevicesByOwnerPaged(ownerId, PageRequest.of(page, size));
        return createResponse(HttpStatus.OK, 1000, "Fetch owner inventory successfully", inventory);
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MyApiResponse<Void>> approveDevice(@PathVariable Long id) {
        deviceService.approveProductItem(id);
        return createResponse(HttpStatus.OK, 1000, "Approve device successfully", null);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/pending")
    public ResponseEntity<MyApiResponse<List<DeviceManageResponse>>> getPendingDevices() {
        List<DeviceManageResponse> list = deviceService.getDevicesByStatus(com.example.demo.enumValues.DeviceStatus.PENDING_APPROVAL);
        return createResponse(HttpStatus.OK, 1000, "Fetch pending devices successfully", list);
    }

    @GetMapping("/{id}/detail")
    @io.swagger.v3.oas.annotations.security.SecurityRequirements
    public ResponseEntity<MyApiResponse<DeviceDetailResponse>> getDeviceDetailById(@PathVariable Long id) {
        return createResponse(HttpStatus.OK, 1000, "Success", deviceService.getDeviceDetail(id));
    }

    @PreAuthorize("hasRole('OWNER')")
    @GetMapping("/{id}/edit")
    public ResponseEntity<MyApiResponse<DeviceEditResponse>> getDeviceForEdit(
        @PathVariable Long id,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long ownerId = userDetails.getId();
        return createResponse(HttpStatus.OK, 1000, "Success", deviceService.getDeviceForOwnerEdit(id, ownerId));
    }

    @PreAuthorize("hasRole('OWNER')")
    @PutMapping("/{id}")
    public ResponseEntity<MyApiResponse<Void>> updateDevice(
        @PathVariable Long id,
        @RequestBody DeviceUpdateRequest request,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long ownerId = userDetails.getId();
        deviceService.updateDeviceByOwner(id, ownerId, request);
        return createResponse(HttpStatus.OK, 1000, "Device updated successfully", null);
    }

    @PreAuthorize("hasRole('OWNER')")
    @PutMapping("/{id}/images/{imageId}/primary")
    public ResponseEntity<MyApiResponse<Void>> setImageAsPrimary(
        @PathVariable Long id,
        @PathVariable Long imageId,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long ownerId = userDetails.getId();
        deviceService.setDevicePrimaryImage(id, imageId, ownerId);
        return createResponse(HttpStatus.OK, 1000, "Primary image set successfully", null);
    }

    @PreAuthorize("hasRole('OWNER')")
    @DeleteMapping("/{id}/images/{imageId}")
    public ResponseEntity<MyApiResponse<Void>> deleteImage(
        @PathVariable Long id,
        @PathVariable Long imageId,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long ownerId = userDetails.getId();
        deviceService.deleteDeviceImage(id, imageId, ownerId);
        return createResponse(HttpStatus.OK, 1000, "Image deleted successfully", null);
    }

    @PreAuthorize("hasRole('OWNER')")
    @PostMapping("/{id}/images")
    public ResponseEntity<MyApiResponse<Void>> addImage(
        @PathVariable Long id,
        @RequestBody String imageUrl,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long ownerId = userDetails.getId();
        deviceService.addDeviceImage(id, imageUrl, ownerId);
        return createResponse(HttpStatus.OK, 1000, "Image added successfully", null);
    }


}
