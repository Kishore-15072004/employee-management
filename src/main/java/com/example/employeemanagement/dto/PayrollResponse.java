package com.example.employeemanagement.dto;

import java.time.LocalDate;

public class PayrollResponse {

    private Long id;
    private Long employeeId;
    private String employeeCode;
    private String employeeName;
    private Double baseSalary;
    private Double allowances;
    private Double deductions;
    private Double netSalary;
    private LocalDate effectiveFrom;

    public PayrollResponse(
            Long id,
            Long employeeId,
            String employeeCode,
            String employeeName,
            Double baseSalary,
            Double allowances,
            Double deductions,
            Double netSalary,
            LocalDate effectiveFrom) {

        this.id = id;
        this.employeeId = employeeId;
        this.employeeCode = employeeCode;
        this.employeeName = employeeName;
        this.baseSalary = baseSalary;
        this.allowances = allowances;
        this.deductions = deductions;
        this.netSalary = netSalary;
        this.effectiveFrom = effectiveFrom;
    }

    public Long getId() {
        return id;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public Double getBaseSalary() {
        return baseSalary;
    }

    public Double getAllowances() {
        return allowances;
    }

    public Double getDeductions() {
        return deductions;
    }

    public Double getNetSalary() {
        return netSalary;
    }

    public LocalDate getEffectiveFrom() {
        return effectiveFrom;
    }
}