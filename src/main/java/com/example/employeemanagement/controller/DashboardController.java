package com.example.employeemanagement.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.employeemanagement.dto.AttendanceSummaryResponse;
import com.example.employeemanagement.dto.DashboardResponse;
import com.example.employeemanagement.dto.DashboardSummaryResponse;
import com.example.employeemanagement.dto.DepartmentEmployeeCountResponse;
import com.example.employeemanagement.dto.LeaveSummaryResponse;
import com.example.employeemanagement.service.DashboardService;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(
            DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/summary")
    public DashboardSummaryResponse getSummary() {

        return dashboardService.getSummary();
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/departments")
    public List<DepartmentEmployeeCountResponse>
    getEmployeeCountByDepartment() {

        return dashboardService.getEmployeeCountByDepartment();
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/attendance/today")
    public AttendanceSummaryResponse getTodayAttendanceSummary() {

        return dashboardService.getTodayAttendanceSummary();
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/leaves")
    public LeaveSummaryResponse getLeaveSummary() {

        return dashboardService.getLeaveSummary();
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public DashboardResponse getDashboard() {

        return dashboardService.getDashboard();
    }
}