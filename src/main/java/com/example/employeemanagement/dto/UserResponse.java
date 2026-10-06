package com.example.employeemanagement.dto;

import com.example.employeemanagement.entity.Role;

public class UserResponse {

	private Long id;
	private String username;
	private Role role;
	private boolean enabled;

	public UserResponse(Long id, String username, Role role, boolean enabled) {

		this.id = id;
		this.username = username;
		this.role = role;
		this.enabled = enabled;
	}
	
	public boolean isEnabled() {
	    return enabled;
	}

	public Long getId() {
		return id;
	}

	public String getUsername() {
		return username;
	}

	public Role getRole() {
		return role;
	}
}