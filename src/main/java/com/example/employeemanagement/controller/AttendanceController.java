package com.example.employeemanagement.controller;

import com.example.employeemanagement.dto.AttendanceResponse;
import com.example.employeemanagement.service.AttendanceService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(
            AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping("/check-in")
    @ResponseStatus(HttpStatus.CREATED)
    public AttendanceResponse checkIn(
            Authentication authentication) {

        return attendanceService.checkIn(
                authentication.getName());
    }

    @PutMapping("/check-out")
    public AttendanceResponse checkOut(
            Authentication authentication) {

        return attendanceService.checkOut(
                authentication.getName());
    }

    @GetMapping("/my")
    public List<AttendanceResponse> getMyAttendance(
            Authentication authentication) {

        return attendanceService.getMyAttendance(
                authentication.getName());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'TEAM_MANAGER')")
    @GetMapping("/employee/{employeeId}")
    public List<AttendanceResponse> getEmployeeAttendance(
            @PathVariable Long employeeId,
            Authentication authentication) {

        return attendanceService.getEmployeeAttendance(
                authentication.getName(),
                employeeId);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    @GetMapping
    public List<AttendanceResponse> getAllAttendance() {

        return attendanceService.getAllAttendance();
    }
}