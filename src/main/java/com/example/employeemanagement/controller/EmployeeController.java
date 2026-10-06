package com.example.employeemanagement.controller;

import com.example.employeemanagement.dto.EmployeeCreateRequest;
import com.example.employeemanagement.dto.EmployeeResponse;
import com.example.employeemanagement.dto.EmployeeUpdateRequest;
import com.example.employeemanagement.dto.SalaryResponse;
import com.example.employeemanagement.dto.SelfProfileUpdateRequest;
import com.example.employeemanagement.entity.Employee;
import com.example.employeemanagement.service.EmployeeService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EmployeeResponse createEmployee(
            @Valid @RequestBody EmployeeCreateRequest request) {

        Employee employee = new Employee();

        employee.setEmployeeCode(request.getEmployeeCode());
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setDesignation(request.getDesignation());
        employee.setSalary(request.getSalary());
        employee.setUsername(request.getUsername());
        employee.setPassword(request.getPassword());

        Employee savedEmployee =
                employeeService.createEmployee(
                        employee,
                        request.getDepartmentId()
                );

        return new EmployeeResponse(
                savedEmployee.getId(),
                savedEmployee.getEmployeeCode(),
                savedEmployee.getFirstName(),
                savedEmployee.getLastName(),
                savedEmployee.getEmail(),
                savedEmployee.getPhone(),

                savedEmployee.getDepartment() != null
                        ? savedEmployee.getDepartment().getName()
                        : null,

                savedEmployee.getDesignation(),

                // Manager ID
                savedEmployee.getManager() != null
                        ? savedEmployee.getManager().getId()
                        : null,

                // Manager Name
                savedEmployee.getManager() != null
                        ? savedEmployee.getManager().getFirstName()
                            + " "
                            + savedEmployee.getManager().getLastName()
                        : null
        );
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'FINANCE', 'TEAM_MANAGER', 'EMPLOYEE')")
    @GetMapping("/me")
    public EmployeeResponse getMyProfile(Authentication authentication) {
        return employeeService.getMyProfile(authentication.getName());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'FINANCE', 'TEAM_MANAGER', 'EMPLOYEE')")
    @PutMapping("/me")
    public EmployeeResponse updateMyProfile(
            @Valid @RequestBody SelfProfileUpdateRequest request,
            Authentication authentication) {
        return employeeService.updateMyProfile(
                authentication.getName(), request);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'TEAM_MANAGER', 'EMPLOYEE')")
    @GetMapping("/{id}")
    public EmployeeResponse getEmployeeById(
            @PathVariable Long id,
            Authentication authentication) {

        return employeeService.getEmployeeForUser(
                authentication.getName(),
                id
        );
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'TEAM_MANAGER')")
    @GetMapping
    public List<EmployeeResponse> getAllEmployees(
            Authentication authentication) {

        return employeeService.getEmployeesForUser(
                authentication.getName()
        );
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    @PutMapping("/{id}")
    public EmployeeResponse updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeUpdateRequest request) {

        return employeeService.updateEmployee(id, request);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEmployee(@PathVariable Long id) {

        employeeService.deleteEmployee(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'FINANCE')")
    @GetMapping("/{id}/salary")
    public SalaryResponse getSalary(@PathVariable Long id) {

        return employeeService.getSalary(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    @PutMapping("/{employeeId}/manager/{managerId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void assignManager(
            @PathVariable Long employeeId,
            @PathVariable Long managerId) {

        employeeService.assignManager(employeeId, managerId);
    }
}