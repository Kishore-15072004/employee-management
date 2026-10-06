package com.example.employeemanagement.exception;

public class LeaveNotFoundException
        extends RuntimeException {

    public LeaveNotFoundException(String message) {
        super(message);
    }
}