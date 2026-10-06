package com.example.employeemanagement.service;

import java.util.List;

import com.example.employeemanagement.dto.UserResponse;
import com.example.employeemanagement.entity.Role;

public interface UserService {

    List<UserResponse> getAllUsers();
    
    void setUserStatus(Long userId, boolean enabled);
    
    void updateUserRole(Long userId, Role role);
}