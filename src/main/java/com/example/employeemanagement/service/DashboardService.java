package com.example.employeemanagement.service;

import java.util.List;

import com.example.employeemanagement.dto.AttendanceSummaryResponse;
import com.example.employeemanagement.dto.DashboardResponse;
import com.example.employeemanagement.dto.DashboardSummaryResponse;
import com.example.employeemanagement.dto.DepartmentEmployeeCountResponse;
import com.example.employeemanagement.dto.LeaveSummaryResponse;

public interface DashboardService {

	DashboardSummaryResponse getSummary();

	List<DepartmentEmployeeCountResponse> getEmployeeCountByDepartment();

	AttendanceSummaryResponse getTodayAttendanceSummary();
	
	LeaveSummaryResponse getLeaveSummary();
	
	DashboardResponse getDashboard();
}