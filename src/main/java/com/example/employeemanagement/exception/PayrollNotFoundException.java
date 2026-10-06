package com.example.employeemanagement.exception;

public class PayrollNotFoundException
        extends RuntimeException {

    public PayrollNotFoundException(String message) {
        super(message);
    }
}