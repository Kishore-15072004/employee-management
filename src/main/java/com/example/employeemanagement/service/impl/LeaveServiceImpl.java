package com.example.employeemanagement.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.employeemanagement.dto.LeaveCreateRequest;
import com.example.employeemanagement.dto.LeaveResponse;
import com.example.employeemanagement.entity.Employee;
import com.example.employeemanagement.entity.LeaveRequest;
import com.example.employeemanagement.entity.LeaveStatus;
import com.example.employeemanagement.entity.Notification;
import com.example.employeemanagement.entity.NotificationType;
import com.example.employeemanagement.entity.Role;
import com.example.employeemanagement.exception.AccessDeniedException;
import com.example.employeemanagement.exception.EmployeeNotFoundException;
import com.example.employeemanagement.exception.LeaveNotFoundException;
import com.example.employeemanagement.repository.EmployeeRepository;
import com.example.employeemanagement.repository.LeaveRequestRepository;
import com.example.employeemanagement.repository.NotificationRepository;
import com.example.employeemanagement.service.LeaveService;

@Service
@Transactional
public class LeaveServiceImpl implements LeaveService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;
    private final NotificationRepository notificationRepository;

    public LeaveServiceImpl(
            LeaveRequestRepository leaveRequestRepository,
            EmployeeRepository employeeRepository,
            NotificationRepository notificationRepository)  {

        this.leaveRequestRepository = leaveRequestRepository;
        this.employeeRepository = employeeRepository;
        this.notificationRepository = notificationRepository;
    }

    @Override
    public LeaveResponse applyLeave(
            String username,
            LeaveCreateRequest request) {

        Employee employee = getEmployeeByUsername(username);

        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new AccessDeniedException(
                    "Start date cannot be after end date");
        }

        List<LeaveRequest> existingLeaves =
                leaveRequestRepository
                        .findByEmployeeIdAndStatusIn(
                                employee.getId(),
                                List.of(
                                        LeaveStatus.PENDING,
                                        LeaveStatus.APPROVED
                                ));

        for (LeaveRequest existing : existingLeaves) {

            boolean overlaps =
                    !request.getEndDate()
                            .isBefore(existing.getStartDate())
                    &&
                    !request.getStartDate()
                            .isAfter(existing.getEndDate());

            if (overlaps) {
                throw new AccessDeniedException(
                        "Leave dates overlap with an existing leave request");
            }
        }

        LeaveRequest leave = new LeaveRequest();

        leave.setEmployee(employee);
        leave.setLeaveType(request.getLeaveType());
        leave.setStartDate(request.getStartDate());
        leave.setEndDate(request.getEndDate());
        leave.setReason(request.getReason());

        // Never trust status from the client.
        leave.setStatus(LeaveStatus.PENDING);

        LeaveRequest saved =
                leaveRequestRepository.save(leave);

        return toLeaveResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaveResponse> getMyLeaves(
            String username) {

        Employee employee = getEmployeeByUsername(username);

        return leaveRequestRepository
                .findByEmployeeId(employee.getId())
                .stream()
                .map(this::toLeaveResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaveResponse> getPendingLeavesForManager(
            String username) {

        Employee manager = getEmployeeByUsername(username);

        if (manager.getRole() != Role.TEAM_MANAGER) {

            throw new AccessDeniedException(
                    "Only TEAM_MANAGER can view team leave requests");
        }

        return leaveRequestRepository
                .findByEmployeeManagerIdAndStatus(
                        manager.getId(),
                        LeaveStatus.PENDING)
                .stream()
                .map(this::toLeaveResponse)
                .toList();
    }

    @Override
    public void approveLeave(
            Long leaveId,
            String username) {

        LeaveRequest leave =
                getLeaveById(leaveId);

        Employee approver =
                getEmployeeByUsername(username);

        validateDecisionPermission(leave, approver);

        if (leave.getStatus() != LeaveStatus.PENDING) {

            throw new AccessDeniedException(
                    "Only pending leave requests can be approved");
        }

        leave.setStatus(LeaveStatus.APPROVED);
        leave.setApprovedBy(approver);

        leaveRequestRepository.save(leave);

        Notification notification = new Notification();

        notification.setEmployee(leave.getEmployee());

        notification.setType(
                NotificationType.LEAVE_APPROVED);

        notification.setMessage(
                "Your leave request from "
                + leave.getStartDate()
                + " to "
                + leave.getEndDate()
                + " has been approved.");

        notification.setCreatedAt(LocalDateTime.now());

        notificationRepository.save(notification);
    }

    @Override
    public void rejectLeave(
            Long leaveId,
            String username) {

        LeaveRequest leave =
                getLeaveById(leaveId);

        Employee approver =
                getEmployeeByUsername(username);

        validateDecisionPermission(leave, approver);

        if (leave.getStatus() != LeaveStatus.PENDING) {

            throw new AccessDeniedException(
                    "Only pending leave requests can be rejected");
        }

        leave.setStatus(LeaveStatus.REJECTED);
        leave.setApprovedBy(approver);

        leaveRequestRepository.save(leave);

        Notification notification = new Notification();

        notification.setEmployee(leave.getEmployee());

        notification.setType(
                NotificationType.LEAVE_REJECTED);

        notification.setMessage(
                "Your leave request from "
                + leave.getStartDate()
                + " to "
                + leave.getEndDate()
                + " has been rejected.");

        notification.setCreatedAt(LocalDateTime.now());

        notificationRepository.save(notification);
    }

    @Override
    public void cancelLeave(
            Long leaveId,
            String username) {

        LeaveRequest leave =
                getLeaveById(leaveId);

        Employee employee =
                getEmployeeByUsername(username);

        if (!leave.getEmployee().getId()
                .equals(employee.getId())) {

            throw new AccessDeniedException(
                    "You can only cancel your own leave request");
        }

        if (leave.getStatus() != LeaveStatus.PENDING) {

            throw new AccessDeniedException(
                    "Only pending leave requests can be cancelled");
        }

        leave.setStatus(LeaveStatus.CANCELLED);

        leaveRequestRepository.save(leave);

        Notification notification = new Notification();

        notification.setEmployee(employee);

        notification.setType(
                NotificationType.LEAVE_CANCELLED);

        notification.setMessage(
                "Your leave request from "
                + leave.getStartDate()
                + " to "
                + leave.getEndDate()
                + " has been cancelled.");

        notification.setCreatedAt(LocalDateTime.now());

        notificationRepository.save(notification);
    }

    private void validateDecisionPermission(
            LeaveRequest leave,
            Employee approver) {

        Role role = approver.getRole();

        // ADMIN can manage any leave request.
        if (role == Role.ADMIN) {
            return;
        }

        // HR can manage requests that don't have a manager.
        if (role == Role.HR) {

            if (leave.getEmployee().getManager() == null) {
                return;
            }

            throw new AccessDeniedException(
                    "HR cannot approve or reject a request assigned to a team manager");
        }

        // TEAM_MANAGER can manage only their direct reports.
        if (role == Role.TEAM_MANAGER) {

            Employee manager =
                    leave.getEmployee().getManager();

            if (manager != null &&
                    manager.getId().equals(approver.getId())) {
                return;
            }

            throw new AccessDeniedException(
                    "You can only manage leave requests from your team");
        }

        throw new AccessDeniedException(
                "You are not allowed to approve or reject leave");
    }

    private Employee getEmployeeByUsername(
            String username) {

        return employeeRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new EmployeeNotFoundException(
                                "Employee not found for username: "
                                        + username));
    }

    private LeaveRequest getLeaveById(Long leaveId) {

        return leaveRequestRepository
                .findById(leaveId)
                .orElseThrow(() ->
                        new LeaveNotFoundException(
                                "Leave request not found: "
                                        + leaveId));
    }

    private LeaveResponse toLeaveResponse(
            LeaveRequest leave) {

        Employee employee = leave.getEmployee();

        String employeeName =
                employee.getFirstName()
                        + " "
                        + employee.getLastName();

        Long approvedByEmployeeId =
                leave.getApprovedBy() != null
                        ? leave.getApprovedBy().getId()
                        : null;

        return new LeaveResponse(
                leave.getId(),
                employee.getId(),
                employeeName,
                leave.getLeaveType(),
                leave.getStartDate(),
                leave.getEndDate(),
                leave.getReason(),
                leave.getStatus(),
                approvedByEmployeeId
        );
    }
}