package com.example.employeemanagement.service.impl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.employeemanagement.dto.AttendanceSummaryResponse;
import com.example.employeemanagement.dto.DashboardResponse;
import com.example.employeemanagement.dto.DashboardSummaryResponse;
import com.example.employeemanagement.dto.DepartmentEmployeeCountResponse;
import com.example.employeemanagement.dto.LeaveSummaryResponse;
import com.example.employeemanagement.entity.AttendanceStatus;
import com.example.employeemanagement.entity.LeaveStatus;
import com.example.employeemanagement.repository.AttendanceRepository;
import com.example.employeemanagement.repository.DepartmentRepository;
import com.example.employeemanagement.repository.EmployeeRepository;
import com.example.employeemanagement.repository.LeaveRequestRepository;
import com.example.employeemanagement.repository.PayrollRepository;
import com.example.employeemanagement.service.DashboardService;

@Service
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final PayrollRepository payrollRepository;
    private final AttendanceRepository attendanceRepository;

    public DashboardServiceImpl(
            EmployeeRepository employeeRepository,
            DepartmentRepository departmentRepository,
            LeaveRequestRepository leaveRequestRepository,
            PayrollRepository payrollRepository,
            AttendanceRepository attendanceRepository) {

        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.payrollRepository = payrollRepository;
        this.attendanceRepository = attendanceRepository;
    }

    @Override
    public DashboardSummaryResponse getSummary() {

        long totalEmployees =
                employeeRepository.count();

        long totalDepartments =
                departmentRepository.count();

        long pendingLeaves =
                leaveRequestRepository
                        .countByStatus(LeaveStatus.PENDING);

        long totalPayrollRecords =
                payrollRepository.count();

        return new DashboardSummaryResponse(
                totalEmployees,
                totalDepartments,
                pendingLeaves,
                totalPayrollRecords
        );
    }
    
    @Override
    public List<DepartmentEmployeeCountResponse>
    getEmployeeCountByDepartment() {

        return departmentRepository.findAll()
                .stream()
                .map(department -> {

                	long employeeCount =
                	        employeeRepository
                	                .countByDepartmentId(department.getId());

                    return new DepartmentEmployeeCountResponse(
                            department.getId(),
                            department.getName(),
                            employeeCount
                    );
                })
                .toList();
    }
    
    @Override
    public AttendanceSummaryResponse getTodayAttendanceSummary() {

        LocalDate today = LocalDate.now();

        long present =
                attendanceRepository.countByAttendanceDateAndStatus(
                        today,
                        AttendanceStatus.PRESENT);

        long absent =
                attendanceRepository.countByAttendanceDateAndStatus(
                        today,
                        AttendanceStatus.ABSENT);

        long halfDay =
                attendanceRepository.countByAttendanceDateAndStatus(
                        today,
                        AttendanceStatus.HALF_DAY);

        long onLeave =
                attendanceRepository.countByAttendanceDateAndStatus(
                        today,
                        AttendanceStatus.ON_LEAVE);

        return new AttendanceSummaryResponse(
                present,
                absent,
                halfDay,
                onLeave
        );
    }
    
    @Override
    public LeaveSummaryResponse getLeaveSummary() {

        long pending =
                leaveRequestRepository.countByStatus(
                        LeaveStatus.PENDING);

        long approved =
                leaveRequestRepository.countByStatus(
                        LeaveStatus.APPROVED);

        long rejected =
                leaveRequestRepository.countByStatus(
                        LeaveStatus.REJECTED);

        long cancelled =
                leaveRequestRepository.countByStatus(
                        LeaveStatus.CANCELLED);

        return new LeaveSummaryResponse(
                pending,
                approved,
                rejected,
                cancelled
        );
    }
    
    @Override
    public DashboardResponse getDashboard() {

        DashboardSummaryResponse summary =
                getSummary();

        List<DepartmentEmployeeCountResponse>
                departmentEmployeeCounts =
                getEmployeeCountByDepartment();

        AttendanceSummaryResponse todayAttendance =
                getTodayAttendanceSummary();

        LeaveSummaryResponse leaveSummary =
                getLeaveSummary();

        return new DashboardResponse(
                summary,
                departmentEmployeeCounts,
                todayAttendance,
                leaveSummary
        );
    }
}