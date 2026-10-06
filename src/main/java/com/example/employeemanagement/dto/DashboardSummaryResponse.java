package com.example.employeemanagement.dto;

public class DashboardSummaryResponse {

    private long totalEmployees;
    private long totalDepartments;
    private long pendingLeaves;
    private long totalPayrollRecords;

    public DashboardSummaryResponse(
            long totalEmployees,
            long totalDepartments,
            long pendingLeaves,
            long totalPayrollRecords) {

        this.totalEmployees = totalEmployees;
        this.totalDepartments = totalDepartments;
        this.pendingLeaves = pendingLeaves;
        this.totalPayrollRecords = totalPayrollRecords;
    }

    public long getTotalEmployees() {
        return totalEmployees;
    }

    public long getTotalDepartments() {
        return totalDepartments;
    }

    public long getPendingLeaves() {
        return pendingLeaves;
    }

    public long getTotalPayrollRecords() {
        return totalPayrollRecords;
    }
}