package com.example.employeemanagement.dto;

import com.example.employeemanagement.entity.AttendanceStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class AttendanceResponse {

    private Long id;
    private Long employeeId;
    private String employeeCode;
    private String employeeName;

    private LocalDate attendanceDate;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;

    private AttendanceStatus status;

    public AttendanceResponse(
            Long id,
            Long employeeId,
            String employeeCode,
            String employeeName,
            LocalDate attendanceDate,
            LocalDateTime checkInTime,
            LocalDateTime checkOutTime,
            AttendanceStatus status) {

        this.id = id;
        this.employeeId = employeeId;
        this.employeeCode = employeeCode;
        this.employeeName = employeeName;
        this.attendanceDate = attendanceDate;
        this.checkInTime = checkInTime;
        this.checkOutTime = checkOutTime;
        this.status = status;
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

    public LocalDate getAttendanceDate() {
        return attendanceDate;
    }

    public LocalDateTime getCheckInTime() {
        return checkInTime;
    }

    public LocalDateTime getCheckOutTime() {
        return checkOutTime;
    }

    public AttendanceStatus getStatus() {
        return status;
    }
}