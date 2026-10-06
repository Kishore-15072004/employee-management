package com.example.employeemanagement.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.employeemanagement.dto.UserResponse;
import com.example.employeemanagement.entity.Role;
import com.example.employeemanagement.entity.Employee;
import com.example.employeemanagement.exception.EmployeeNotFoundException;
import com.example.employeemanagement.repository.EmployeeRepository;
import com.example.employeemanagement.service.UserService;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final EmployeeRepository employeeRepository;

    public UserServiceImpl(
            EmployeeRepository employeeRepository) {

        this.employeeRepository = employeeRepository;
    }
    
    @Override
    public List<UserResponse> getAllUsers() {

        return employeeRepository.findAll()
                .stream()
            .map(employee -> new UserResponse(
                employee.getId(),
                employee.getUsername(),
                employee.getRole(),
                employee.isEnabled()))
                .toList();
    }
    
    @Override
    public void setUserStatus(Long userId, boolean enabled) {

        Employee employee = employeeRepository.findById(userId)
                .orElseThrow(() ->
                new EmployeeNotFoundException(
                    "Employee not found: " + userId));

        employee.setEnabled(enabled);

        employeeRepository.save(employee);
    }
    
    @Override
    public void updateUserRole(Long userId, Role role) {

        Employee employee = employeeRepository.findById(userId)
                .orElseThrow(() ->
                new EmployeeNotFoundException(
                    "Employee not found: " + userId));

        employee.setRole(role);

        employeeRepository.save(employee);
    }
}