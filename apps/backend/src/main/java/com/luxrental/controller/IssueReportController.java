package com.luxrental.controller;

import com.luxrental.common.dto.MyApiResponse;
import com.luxrental.entity.issue.IssueReport;
import com.luxrental.security.normal.CustomUserDetails;
import com.luxrental.service.IssueReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/issues")
@RequiredArgsConstructor
public class IssueReportController extends BaseController {
    private final IssueReportService issueReportService;

    @PostMapping
    public ResponseEntity<MyApiResponse<IssueReport>> reportIssue(
        @RequestParam Long orderId,
        @RequestParam String title,
        @RequestParam String description,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long reporterId = userDetails.getId();
        return createResponse(HttpStatus.CREATED, 1000, "Issue reported",
            issueReportService.reportIssue(orderId, reporterId, title, description));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MyApiResponse<List<IssueReport>>> getAllIssues() {
        return createResponse(HttpStatus.OK, 1000, "Success", issueReportService.getAllIssues());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MyApiResponse<IssueReport>> updateStatus(
        @PathVariable Long id,
        @RequestParam IssueReport.IssueStatus status
    ) {
        return createResponse(HttpStatus.OK, 1000, "Status updated",
            issueReportService.updateIssueStatus(id, status));
    }
}
