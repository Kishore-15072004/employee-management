package com.example.employeemanagement.security;

import com.example.employeemanagement.entity.Employee;
import com.example.employeemanagement.repository.EmployeeRepository;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

	private final EmployeeRepository employeeRepository;

	public CustomUserDetailsService(EmployeeRepository employeeRepository) {
		this.employeeRepository = employeeRepository;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

		Employee employee = employeeRepository.findByUsername(username)
				.orElseThrow(() -> new UsernameNotFoundException("Employee not found: " + username));

		return org.springframework.security.core.userdetails.User
		        .withUsername(employee.getUsername())
		        .password(employee.getPassword())
		        .roles(employee.getRole().name())
		        .disabled(!employee.isEnabled())
		        .build();
	}
}