package com.example.employeemanagement.dto;

public class DepartmentEmployeeCountResponse {

    private Long departmentId;
    private String departmentName;
    private long employeeCount;

    public DepartmentEmployeeCountResponse(
            Long departmentId,
            String departmentName,
            long employeeCount) {

        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.employeeCount = employeeCount;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public long getEmployeeCount() {
        return employeeCount;
    }
}