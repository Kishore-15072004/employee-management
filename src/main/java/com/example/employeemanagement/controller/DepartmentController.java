package com.example.employeemanagement.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.employeemanagement.dto.DepartmentCreateRequest;
import com.example.employeemanagement.dto.DepartmentResponse;
import com.example.employeemanagement.dto.EmployeeResponse;
import com.example.employeemanagement.service.DepartmentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(
            DepartmentService departmentService) {

        this.departmentService = departmentService;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DepartmentResponse createDepartment(
            @Valid @RequestBody DepartmentCreateRequest request) {

        return departmentService.createDepartment(request);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    @GetMapping
    public List<DepartmentResponse> getAllDepartments() {

        return departmentService.getAllDepartments();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    @GetMapping("/{id}")
    public DepartmentResponse getDepartmentById(
            @PathVariable Long id) {

        return departmentService.getDepartmentById(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    @PutMapping("/{id}")
    public DepartmentResponse updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody DepartmentCreateRequest request) {

        return departmentService.updateDepartment(
                id,
                request);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDepartment(
            @PathVariable Long id) {

        departmentService.deleteDepartment(id);
    }
    
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    @GetMapping("/{id}/employees")
    public List<EmployeeResponse> getEmployeesByDepartment(
            @PathVariable Long id) {

        return departmentService.getEmployeesByDepartment(id);
    }
}