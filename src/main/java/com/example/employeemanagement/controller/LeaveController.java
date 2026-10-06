package com.example.employeemanagement.controller;

import com.example.employeemanagement.dto.LeaveCreateRequest;
import com.example.employeemanagement.dto.LeaveResponse;
import com.example.employeemanagement.service.LeaveService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leaves")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LeaveResponse applyLeave(
            @Valid @RequestBody LeaveCreateRequest request,
            Authentication authentication) {

        return leaveService.applyLeave(
                authentication.getName(),
                request);
    }

    @GetMapping("/my")
    public List<LeaveResponse> getMyLeaves(
            Authentication authentication) {

        return leaveService.getMyLeaves(
                authentication.getName());
    }

    @GetMapping("/team/pending")
    public List<LeaveResponse> getPendingLeavesForManager(
            Authentication authentication) {

        return leaveService.getPendingLeavesForManager(
                authentication.getName());
    }

    @PutMapping("/{id}/approve")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void approveLeave(
            @PathVariable Long id,
            Authentication authentication) {

        leaveService.approveLeave(
                id,
                authentication.getName());
    }

    @PutMapping("/{id}/reject")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void rejectLeave(
            @PathVariable Long id,
            Authentication authentication) {

        leaveService.rejectLeave(
                id,
                authentication.getName());
    }

    @PutMapping("/{id}/cancel")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancelLeave(
            @PathVariable Long id,
            Authentication authentication) {

        leaveService.cancelLeave(
                id,
                authentication.getName());
    }
}