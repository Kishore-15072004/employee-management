package com.example.employeemanagement.exception;

public class AttendanceNotFoundException
        extends RuntimeException {

    public AttendanceNotFoundException(String message) {
        super(message);
    }
}