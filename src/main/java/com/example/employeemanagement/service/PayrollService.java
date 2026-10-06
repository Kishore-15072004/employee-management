package com.example.employeemanagement.service;

import com.example.employeemanagement.dto.PayrollCreateRequest;
import com.example.employeemanagement.dto.PayrollResponse;

import java.util.List;

public interface PayrollService {

    PayrollResponse createPayroll(
            Long employeeId,
            PayrollCreateRequest request);

    PayrollResponse getPayroll(
            Long employeeId);

    List<PayrollResponse> getAllPayrolls();

    PayrollResponse updatePayroll(
            Long employeeId,
            PayrollCreateRequest request);
}