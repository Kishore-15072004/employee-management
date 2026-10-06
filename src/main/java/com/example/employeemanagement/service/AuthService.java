package com.example.employeemanagement.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.employeemanagement.dto.LoginRequest;
import com.example.employeemanagement.dto.LoginResponse;
import com.example.employeemanagement.entity.Employee;
import com.example.employeemanagement.exception.EmployeeNotFoundException;
import com.example.employeemanagement.repository.EmployeeRepository;
import com.example.employeemanagement.security.JwtService;

@Service
@Transactional
public class AuthService {

	private final EmployeeRepository employeeRepository;
	private final JwtService jwtService;
	private final AuthenticationManager authenticationManager;

	public AuthService(EmployeeRepository employeeRepository,
			AuthenticationManager authenticationManager, JwtService jwtService) {

		this.employeeRepository = employeeRepository;
		this.jwtService = jwtService;
		this.authenticationManager = authenticationManager;
	}

	public LoginResponse login(LoginRequest request) {

	    authenticationManager.authenticate(
	            new UsernamePasswordAuthenticationToken(
	                    request.getUsername(),
	                    request.getPassword()
	            )
	    );

	    Employee employee = employeeRepository.findByUsername(request.getUsername())
	    		.orElseThrow(() ->
	            new EmployeeNotFoundException(
	                    "Employee not found: " + request.getUsername()));

	    String token = jwtService.generateToken(employee);

	    return new LoginResponse(
	            token,
	            employee.getUsername(),
	            employee.getRole().name()
	    );
	}
}