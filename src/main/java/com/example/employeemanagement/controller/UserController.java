package com.example.employeemanagement.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.employeemanagement.dto.UpdateRoleRequest;
import com.example.employeemanagement.dto.UserResponse;
import com.example.employeemanagement.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<UserResponse> getAllUsers() {

        return userService.getAllUsers();
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/status")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void setUserStatus(
            @PathVariable Long id,
            @RequestParam boolean enabled) {

        userService.setUserStatus(id, enabled);
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/role")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateUserRole(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRoleRequest request) {

        userService.updateUserRole(
                id,
                request.getRole()
        );
    }
}