package com.luxrental.controller.invoice;

import com.luxrental.common.dto.MyApiResponse;
import com.luxrental.controller.BaseController;
import com.luxrental.controller.invoice.dto.response.InvoiceResponse;
import com.luxrental.security.normal.CustomUserDetails;
import com.luxrental.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/invoices")
@RequiredArgsConstructor
public class InvoiceController extends BaseController {

    private final InvoiceService invoiceService;

    @GetMapping("/my")
    public ResponseEntity<MyApiResponse<List<InvoiceResponse>>> getMyInvoices(
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        List<InvoiceResponse> list = invoiceService.getMyInvoices(userDetails.getId());
        return createResponse(HttpStatus.OK, 1000, "Fetch invoices successfully", list);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<MyApiResponse<InvoiceResponse>> getInvoiceByOrderId(
        @PathVariable Long orderId,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        InvoiceResponse response = invoiceService.getInvoiceByOrderId(orderId, userDetails.getId());
        return createResponse(HttpStatus.OK, 1000, "Fetch invoice successfully", response);
    }
}
