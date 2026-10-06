package com.example.employeemanagement.service;

import java.util.List;

import com.example.employeemanagement.dto.DepartmentCreateRequest;
import com.example.employeemanagement.dto.DepartmentResponse;
import com.example.employeemanagement.dto.EmployeeResponse;

public interface DepartmentService {

	DepartmentResponse createDepartment(DepartmentCreateRequest request);

	List<DepartmentResponse> getAllDepartments();

	DepartmentResponse getDepartmentById(Long id);

	DepartmentResponse updateDepartment(Long id, DepartmentCreateRequest request);

	void deleteDepartment(Long id);

	List<EmployeeResponse> getEmployeesByDepartment(Long departmentId);
}