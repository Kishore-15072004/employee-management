package com.example.employeemanagement.exception;

public class DepartmentNotFoundException
        extends RuntimeException {

    public DepartmentNotFoundException(String message) {
        super(message);
    }
}