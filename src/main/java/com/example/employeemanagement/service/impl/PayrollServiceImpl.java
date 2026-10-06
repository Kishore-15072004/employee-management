package com.example.employeemanagement.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.employeemanagement.dto.PayrollCreateRequest;
import com.example.employeemanagement.dto.PayrollResponse;
import com.example.employeemanagement.entity.Employee;
import com.example.employeemanagement.entity.Payroll;
import com.example.employeemanagement.exception.DuplicateEmployeeException;
import com.example.employeemanagement.exception.EmployeeNotFoundException;
import com.example.employeemanagement.exception.PayrollNotFoundException;
import com.example.employeemanagement.repository.EmployeeRepository;
import com.example.employeemanagement.repository.PayrollRepository;
import com.example.employeemanagement.service.PayrollService;

@Service
@Transactional
public class PayrollServiceImpl implements PayrollService {

    private final PayrollRepository payrollRepository;
    private final EmployeeRepository employeeRepository;

    public PayrollServiceImpl(
            PayrollRepository payrollRepository,
            EmployeeRepository employeeRepository) {

        this.payrollRepository = payrollRepository;
        this.employeeRepository = employeeRepository;
    }

    @Override
    public PayrollResponse createPayroll(
            Long employeeId,
            PayrollCreateRequest request) {

        Employee employee = getEmployee(employeeId);

        if (payrollRepository.existsByEmployeeId(employeeId)) {
            throw new DuplicateEmployeeException(
                    "Payroll already exists for employee: "
                            + employeeId);
        }

        Payroll payroll = new Payroll();

        payroll.setEmployee(employee);
        payroll.setBaseSalary(request.getBaseSalary());
        payroll.setAllowances(request.getAllowances());
        payroll.setDeductions(request.getDeductions());
        payroll.setNetSalary(calculateNetSalary(request));
        payroll.setEffectiveFrom(request.getEffectiveFrom());

        Payroll savedPayroll =
                payrollRepository.save(payroll);

        return toPayrollResponse(savedPayroll);
    }

    @Override
    @Transactional(readOnly = true)
    public PayrollResponse getPayroll(
            Long employeeId) {

        Payroll payroll =
                payrollRepository.findByEmployeeId(employeeId)
                        .orElseThrow(() ->
                                new PayrollNotFoundException(
                                        "Payroll not found for employee: "
                                                + employeeId));

        return toPayrollResponse(payroll);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PayrollResponse> getAllPayrolls() {

        return payrollRepository.findAll()
                .stream()
                .map(this::toPayrollResponse)
                .toList();
    }

    @Override
    public PayrollResponse updatePayroll(
            Long employeeId,
            PayrollCreateRequest request) {

        Payroll payroll =
                payrollRepository.findByEmployeeId(employeeId)
                        .orElseThrow(() ->
                                new PayrollNotFoundException(
                                        "Payroll not found for employee: "
                                                + employeeId));

        payroll.setBaseSalary(request.getBaseSalary());
        payroll.setAllowances(request.getAllowances());
        payroll.setDeductions(request.getDeductions());

        payroll.setNetSalary(
                calculateNetSalary(request));

        payroll.setEffectiveFrom(
                request.getEffectiveFrom());

        Payroll updatedPayroll =
                payrollRepository.save(payroll);

        return toPayrollResponse(updatedPayroll);
    }

    private Double calculateNetSalary(
            PayrollCreateRequest request) {

        return request.getBaseSalary()
                + request.getAllowances()
                - request.getDeductions();
    }

    private Employee getEmployee(
            Long employeeId) {

        return employeeRepository.findById(employeeId)
                .orElseThrow(() ->
                        new EmployeeNotFoundException(
                                "Employee not found: "
                                        + employeeId));
    }

    private PayrollResponse toPayrollResponse(
            Payroll payroll) {

        Employee employee = payroll.getEmployee();

        String employeeName =
                employee.getFirstName()
                        + " "
                        + employee.getLastName();

        return new PayrollResponse(
                payroll.getId(),
                employee.getId(),
                employee.getEmployeeCode(),
                employeeName,
                payroll.getBaseSalary(),
                payroll.getAllowances(),
                payroll.getDeductions(),
                payroll.getNetSalary(),
                payroll.getEffectiveFrom()
        );
    }
}