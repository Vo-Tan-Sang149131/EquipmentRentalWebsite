package com.luxrental.service;

import com.luxrental.entity.issue.IssueReport;
import com.luxrental.entity.order.Order;
import com.luxrental.entity.user.User;
import com.luxrental.repository.issues.IssueReportRepository;
import com.luxrental.repository.order.OrderRepository;
import com.luxrental.repository.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IssueReportService {
    private final IssueReportRepository issueReportRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Transactional
    public IssueReport reportIssue(Long orderId, Long reporterId, String title, String description) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new EntityNotFoundException("Order not found"));
        User reporter = userRepository.findById(reporterId)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));

        IssueReport report = IssueReport.builder()
            .order(order)
            .reporter(reporter)
            .title(title)
            .description(description)
            .status(IssueReport.IssueStatus.PENDING)
            .build();

        return issueReportRepository.save(report);
    }

    public List<IssueReport> getAllIssues() {
        return issueReportRepository.findAll();
    }

    @Transactional
    public IssueReport updateIssueStatus(Long issueId, IssueReport.IssueStatus status) {
        IssueReport report = issueReportRepository.findById(issueId)
            .orElseThrow(() -> new EntityNotFoundException("Issue not found"));
        report.setStatus(status);
        return issueReportRepository.save(report);
    }
}
