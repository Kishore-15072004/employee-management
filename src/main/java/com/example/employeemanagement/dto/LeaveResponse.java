package com.example.employeemanagement.dto;

import com.example.employeemanagement.entity.LeaveStatus;
import com.example.employeemanagement.entity.LeaveType;

import java.time.LocalDate;

public class LeaveResponse {

    private Long id;
    private Long employeeId;
    private String employeeName;
    private LeaveType leaveType;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
    private LeaveStatus status;
    private Long approvedByEmployeeId;

    public LeaveResponse(
            Long id,
            Long employeeId,
            String employeeName,
            LeaveType leaveType,
            LocalDate startDate,
            LocalDate endDate,
            String reason,
            LeaveStatus status,
            Long approvedByEmployeeId) {

        this.id = id;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.leaveType = leaveType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.reason = reason;
        this.status = status;
        this.approvedByEmployeeId = approvedByEmployeeId;
    }

    public Long getId() {
        return id;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public LeaveType getLeaveType() {
        return leaveType;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public String getReason() {
        return reason;
    }

    public LeaveStatus getStatus() {
        return status;
    }

    public Long getApprovedByEmployeeId() {
        return approvedByEmployeeId;
    }
}