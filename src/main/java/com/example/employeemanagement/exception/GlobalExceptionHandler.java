package com.example.employeemanagement.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.employeemanagement.dto.ApiErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(EmployeeNotFoundException.class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	public ApiErrorResponse handleEmployeeNotFound(EmployeeNotFoundException ex) {
		return new ApiErrorResponse(
				LocalDateTime.now(),
				404,
				"Employee Not Found",
				ex.getMessage()
		);
	}

	@ExceptionHandler(AccessDeniedException.class)
	@ResponseStatus(HttpStatus.FORBIDDEN)
	public ApiErrorResponse handleAccessDenied(AccessDeniedException ex) {
		return new ApiErrorResponse(
				LocalDateTime.now(),
				403,
				"Access Denied",
				ex.getMessage()
		);
	}

	@ExceptionHandler(DuplicateUsernameException.class)
	@ResponseStatus(HttpStatus.CONFLICT)
	public ApiErrorResponse handleDuplicateUsername(DuplicateUsernameException ex) {
		return new ApiErrorResponse(
				LocalDateTime.now(),
				409,
				"Conflict",
				ex.getMessage()
		);
	}

	@ExceptionHandler(DuplicateEmployeeException.class)
	@ResponseStatus(HttpStatus.CONFLICT)
	public ApiErrorResponse handleDuplicateEmployee(DuplicateEmployeeException ex) {
		return new ApiErrorResponse(
				LocalDateTime.now(),
				409,
				"Conflict",
				ex.getMessage()
		);
	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	@ResponseStatus(HttpStatus.CONFLICT)
	public ApiErrorResponse handleDataIntegrityViolation(DataIntegrityViolationException ex) {
		return new ApiErrorResponse(
				LocalDateTime.now(),
				409,
				"Database Constraint Violation",
				"The requested operation violates a database constraint"
		);
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public Map<String, Object> handleValidationErrors(MethodArgumentNotValidException ex) {
		Map<String, String> errors = new HashMap<>();

		ex.getBindingResult().getFieldErrors()
				.forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

		return Map.of(
				"timestamp", LocalDateTime.now(), 
				"status", 400, 
				"error", "Validation Failed", 
				"messages", errors
		);
	}
	
	@ExceptionHandler(DepartmentNotFoundException.class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	public ApiErrorResponse handleDepartmentNotFound(
	        DepartmentNotFoundException ex) {

	    return new ApiErrorResponse(
	            LocalDateTime.now(),
	            404,
	            "Department Not Found",
	            ex.getMessage()
	    );
	}
	
	@ExceptionHandler(NotificationNotFoundException.class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	public ApiErrorResponse handleNotificationNotFound(
	        NotificationNotFoundException ex) {

	    return new ApiErrorResponse(
	            LocalDateTime.now(),
	            404,
	            "Notification Not Found",
	            ex.getMessage()
	    );
	}
	
	@ExceptionHandler(PayrollNotFoundException.class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	public ApiErrorResponse handlePayrollNotFound(
	        PayrollNotFoundException ex) {

	    return new ApiErrorResponse(
	            LocalDateTime.now(),
	            404,
	            "Payroll Not Found",
	            ex.getMessage()
	    );
	}
	
	@ExceptionHandler(LeaveNotFoundException.class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	public ApiErrorResponse handleLeaveNotFound(
	        LeaveNotFoundException ex) {

	    return new ApiErrorResponse(
	            LocalDateTime.now(),
	            404,
	            "Leave Not Found",
	            ex.getMessage()
	    );
	}
	
	@ExceptionHandler(AttendanceNotFoundException.class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	public ApiErrorResponse handleAttendanceNotFound(
	        AttendanceNotFoundException ex) {

	    return new ApiErrorResponse(
	            LocalDateTime.now(),
	            404,
	            "Attendance Not Found",
	            ex.getMessage()
	    );
	}
	
	@ExceptionHandler(IllegalStateException.class)
	@ResponseStatus(HttpStatus.CONFLICT)
	public ApiErrorResponse handleIllegalState(
	        IllegalStateException ex) {

	    return new ApiErrorResponse(
	            LocalDateTime.now(),
	            409,
	            "Operation Not Allowed",
	            ex.getMessage()
	    );
	}
	
	@ExceptionHandler(IllegalArgumentException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public ApiErrorResponse handleIllegalArgument(
	        IllegalArgumentException ex) {

	    return new ApiErrorResponse(
	            LocalDateTime.now(),
	            400,
	            "Bad Request",
	            ex.getMessage()
	    );
	}
}