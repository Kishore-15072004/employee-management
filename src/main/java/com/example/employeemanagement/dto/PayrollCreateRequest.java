package com.example.employeemanagement.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDate;

public class PayrollCreateRequest {

    @NotNull(message = "Base salary is required")
    @Positive(message = "Base salary must be greater than zero")
    private Double baseSalary;

    @NotNull(message = "Allowances are required")
    @PositiveOrZero(message = "Allowances cannot be negative")
    private Double allowances;

    @NotNull(message = "Deductions are required")
    @PositiveOrZero(message = "Deductions cannot be negative")
    private Double deductions;

    @NotNull(message = "Effective date is required")
    private LocalDate effectiveFrom;

    public Double getBaseSalary() {
        return baseSalary;
    }

    public void setBaseSalary(Double baseSalary) {
        this.baseSalary = baseSalary;
    }

    public Double getAllowances() {
        return allowances;
    }

    public void setAllowances(Double allowances) {
        this.allowances = allowances;
    }

    public Double getDeductions() {
        return deductions;
    }

    public void setDeductions(Double deductions) {
        this.deductions = deductions;
    }

    public LocalDate getEffectiveFrom() {
        return effectiveFrom;
    }

    public void setEffectiveFrom(LocalDate effectiveFrom) {
        this.effectiveFrom = effectiveFrom;
    }
}