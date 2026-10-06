package com.example.employeemanagement.service;

import com.example.employeemanagement.dto.AttendanceResponse;

import java.util.List;

public interface AttendanceService {

    AttendanceResponse checkIn(String username);

    AttendanceResponse checkOut(String username);

    List<AttendanceResponse> getMyAttendance(String username);

    List<AttendanceResponse> getEmployeeAttendance(
            String username,
            Long employeeId);

    List<AttendanceResponse> getAllAttendance();
}