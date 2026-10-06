package com.example.employeemanagement.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.employeemanagement.dto.AttendanceResponse;
import com.example.employeemanagement.entity.Attendance;
import com.example.employeemanagement.entity.AttendanceStatus;
import com.example.employeemanagement.entity.Employee;
import com.example.employeemanagement.entity.Role;
import com.example.employeemanagement.exception.AccessDeniedException;
import com.example.employeemanagement.exception.AttendanceNotFoundException;
import com.example.employeemanagement.exception.EmployeeNotFoundException;
import com.example.employeemanagement.repository.AttendanceRepository;
import com.example.employeemanagement.repository.EmployeeRepository;
import com.example.employeemanagement.service.AttendanceService;

@Service
@Transactional
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    public AttendanceServiceImpl(
            AttendanceRepository attendanceRepository,
            EmployeeRepository employeeRepository) {

        this.attendanceRepository = attendanceRepository;
		this.employeeRepository = employeeRepository;
    }

    @Override
    public AttendanceResponse checkIn(String username) {

        Employee employee = getEmployeeByUsername(username);

        LocalDate today = LocalDate.now();

        if (attendanceRepository
                .existsByEmployeeIdAndAttendanceDate(
                        employee.getId(), today)) {

            throw new AccessDeniedException(
                    "Attendance already marked for today");
        }

        Attendance attendance = new Attendance();

        attendance.setEmployee(employee);
        attendance.setAttendanceDate(today);
        attendance.setCheckInTime(LocalDateTime.now());
        attendance.setStatus(AttendanceStatus.PRESENT);

        Attendance savedAttendance =
                attendanceRepository.save(attendance);

        return toAttendanceResponse(savedAttendance);
    }

    @Override
    public AttendanceResponse checkOut(String username) {

        Employee employee = getEmployeeByUsername(username);

        LocalDate today = LocalDate.now();

        Attendance attendance =
                attendanceRepository
                        .findByEmployeeIdAndAttendanceDate(
                                employee.getId(), today)
                        .orElseThrow(() ->
                                new AttendanceNotFoundException(
                                        "Today's attendance record not found"));

        if (attendance.getCheckOutTime() != null) {
            throw new AccessDeniedException(
                    "Attendance already checked out");
        }

        attendance.setCheckOutTime(LocalDateTime.now());

        Attendance updatedAttendance =
                attendanceRepository.save(attendance);

        return toAttendanceResponse(updatedAttendance);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceResponse> getMyAttendance(
            String username) {

        Employee employee = getEmployeeByUsername(username);

        return attendanceRepository
                .findByEmployeeIdOrderByAttendanceDateDesc(
                        employee.getId())
                .stream()
                .map(this::toAttendanceResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceResponse> getEmployeeAttendance(
            String username,
            Long employeeId) {

        Employee requester = employeeRepository.findByUsername(username)
                .orElseThrow(() ->
                        new EmployeeNotFoundException(
                                "Employee not found: " + username));

        Role role = requester.getRole();

        if (role == Role.ADMIN || role == Role.HR) {

            return attendanceRepository
                    .findByEmployeeIdOrderByAttendanceDateDesc(employeeId)
                    .stream()
                    .map(this::toAttendanceResponse)
                    .toList();
        }

        if (role == Role.TEAM_MANAGER) {
            Employee employee = employeeRepository
                    .findById(employeeId)
                    .orElseThrow(() ->
                            new EmployeeNotFoundException(
                                    "Employee not found: " + employeeId));

            if (employee.getManager() == null ||
                    !employee.getManager().getId()
                            .equals(requester.getId())) {

                throw new AccessDeniedException(
                        "You can only view attendance of your team");
            }

            return attendanceRepository
                    .findByEmployeeIdOrderByAttendanceDateDesc(employeeId)
                    .stream()
                    .map(this::toAttendanceResponse)
                    .toList();
        }

        throw new AccessDeniedException(
                "You are not allowed to view this employee's attendance");
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceResponse> getAllAttendance() {

        return attendanceRepository
                .findAllByOrderByAttendanceDateDesc()
                .stream()
                .map(this::toAttendanceResponse)
                .toList();
    }

    private Employee getEmployeeByUsername(String username) {

        return employeeRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new EmployeeNotFoundException(
                                "Employee record not found for user: "
                                        + username));
    }

    private AttendanceResponse toAttendanceResponse(
            Attendance attendance) {

        Employee employee = attendance.getEmployee();

        String employeeName =
                employee.getFirstName() + " "
                        + employee.getLastName();

        return new AttendanceResponse(
                attendance.getId(),
                employee.getId(),
                employee.getEmployeeCode(),
                employeeName,
                attendance.getAttendanceDate(),
                attendance.getCheckInTime(),
                attendance.getCheckOutTime(),
                attendance.getStatus()
        );
    }
}