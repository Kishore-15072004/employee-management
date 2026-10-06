package com.example.employeemanagement.repository;

import com.example.employeemanagement.entity.LeaveRequest;
import com.example.employeemanagement.entity.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

	List<LeaveRequest> findByEmployeeId(Long employeeId);

	List<LeaveRequest> findByEmployeeIdAndStatus(Long employeeId, LeaveStatus status);

	List<LeaveRequest> findByEmployeeIdAndStatusIn(Long employeeId, List<LeaveStatus> statuses);

	List<LeaveRequest> findByStatus(LeaveStatus status);

	List<LeaveRequest> findByEmployeeManagerIdAndStatus(Long managerId, LeaveStatus status);

	long countByStatus(LeaveStatus status);
}