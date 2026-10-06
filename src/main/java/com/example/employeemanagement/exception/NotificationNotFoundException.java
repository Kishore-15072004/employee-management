package com.example.employeemanagement.exception;

public class NotificationNotFoundException
        extends RuntimeException {

    public NotificationNotFoundException(String message) {
        super(message);
    }
}