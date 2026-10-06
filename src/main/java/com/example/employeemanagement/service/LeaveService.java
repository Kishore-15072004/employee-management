package com.example.employeemanagement.service;

import com.example.employeemanagement.dto.LeaveCreateRequest;
import com.example.employeemanagement.dto.LeaveResponse;

import java.util.List;

public interface LeaveService {

    LeaveResponse applyLeave(
            String username,
            LeaveCreateRequest request);

    List<LeaveResponse> getMyLeaves(
            String username);

    List<LeaveResponse> getPendingLeavesForManager(
            String username);

    void approveLeave(
            Long leaveId,
            String username);

    void rejectLeave(
            Long leaveId,
            String username);

    void cancelLeave(
            Long leaveId,
            String username);
}