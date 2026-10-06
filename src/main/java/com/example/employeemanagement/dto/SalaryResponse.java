package com.example.employeemanagement.dto;

public class SalaryResponse {

    private Long employeeId;
    private String employeeCode;
    private String employeeName;
    private Double salary;

    public SalaryResponse(
            Long employeeId,
            String employeeCode,
            String employeeName,
            Double salary) {

        this.employeeId = employeeId;
        this.employeeCode = employeeCode;
        this.employeeName = employeeName;
        this.salary = salary;
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

    public Double getSalary() {
        return salary;
    }
}