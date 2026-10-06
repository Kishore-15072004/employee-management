package com.example.employeemanagement.dto;

import com.example.employeemanagement.entity.NotificationType;

import java.time.LocalDateTime;

public class NotificationResponse {

    private Long id;
    private NotificationType type;
    private String message;
    private boolean read;
    private LocalDateTime createdAt;

    public NotificationResponse(
            Long id,
            NotificationType type,
            String message,
            boolean read,
            LocalDateTime createdAt) {

        this.id = id;
        this.type = type;
        this.message = message;
        this.read = read;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public NotificationType getType() {
        return type;
    }

    public String getMessage() {
        return message;
    }

    public boolean isRead() {
        return read;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}