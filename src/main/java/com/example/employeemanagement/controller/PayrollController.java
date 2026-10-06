package com.example.employeemanagement.controller;

import com.example.employeemanagement.dto.PayrollCreateRequest;
import com.example.employeemanagement.dto.PayrollResponse;
import com.example.employeemanagement.service.PayrollService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payroll")
public class PayrollController {

    private final PayrollService payrollService;

    public PayrollController(PayrollService payrollService) {
        this.payrollService = payrollService;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'FINANCE')")
    @PostMapping("/employees/{employeeId}")
    @ResponseStatus(HttpStatus.CREATED)
    public PayrollResponse createPayroll(
            @PathVariable Long employeeId,
            @Valid @RequestBody PayrollCreateRequest request) {

        return payrollService.createPayroll(
                employeeId,
                request);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'FINANCE')")
    @GetMapping("/employees/{employeeId}")
    public PayrollResponse getPayroll(
            @PathVariable Long employeeId) {

        return payrollService.getPayroll(employeeId);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'FINANCE')")
    @GetMapping
    public List<PayrollResponse> getAllPayrolls() {

        return payrollService.getAllPayrolls();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'FINANCE')")
    @PutMapping("/employees/{employeeId}")
    public PayrollResponse updatePayroll(
            @PathVariable Long employeeId,
            @Valid @RequestBody PayrollCreateRequest request) {

        return payrollService.updatePayroll(
                employeeId,
                request);
    }
}