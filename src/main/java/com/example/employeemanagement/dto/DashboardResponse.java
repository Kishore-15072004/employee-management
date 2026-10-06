package com.example.employeemanagement.dto;

import java.util.List;

public class DashboardResponse {

    private DashboardSummaryResponse summary;
    private List<DepartmentEmployeeCountResponse> departmentEmployeeCounts;
    private AttendanceSummaryResponse todayAttendance;
    private LeaveSummaryResponse leaveSummary;

    public DashboardResponse(
            DashboardSummaryResponse summary,
            List<DepartmentEmployeeCountResponse> departmentEmployeeCounts,
            AttendanceSummaryResponse todayAttendance,
            LeaveSummaryResponse leaveSummary) {

        this.summary = summary;
        this.departmentEmployeeCounts = departmentEmployeeCounts;
        this.todayAttendance = todayAttendance;
        this.leaveSummary = leaveSummary;
    }

    public DashboardSummaryResponse getSummary() {
        return summary;
    }

    public List<DepartmentEmployeeCountResponse>
    getDepartmentEmployeeCounts() {
        return departmentEmployeeCounts;
    }

    public AttendanceSummaryResponse getTodayAttendance() {
        return todayAttendance;
    }

    public LeaveSummaryResponse getLeaveSummary() {
        return leaveSummary;
    }
}