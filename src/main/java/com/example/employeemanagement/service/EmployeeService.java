package com.example.employeemanagement.service;

import java.util.List;

import com.example.employeemanagement.dto.EmployeeResponse;
import com.example.employeemanagement.dto.EmployeeUpdateRequest;
import com.example.employeemanagement.dto.SalaryResponse;
import com.example.employeemanagement.dto.SelfProfileUpdateRequest;
import com.example.employeemanagement.entity.Employee;

public interface EmployeeService {

	Employee createEmployee(Employee employee, Long departmentId);

	Employee getEmployeeById(Long id);

	EmployeeResponse getEmployeeForUser(String username, Long employeeId);

	EmployeeResponse getMyProfile(String username);

	EmployeeResponse updateMyProfile(String username, SelfProfileUpdateRequest request);

	List<EmployeeResponse> getEmployeesForUser(String username);

	EmployeeResponse updateEmployee(Long id, EmployeeUpdateRequest request);

	void deleteEmployee(Long id);

	SalaryResponse getSalary(Long employeeId);

	void assignManager(Long employeeId, Long managerId);
	
	
}