package com.example.employeemanagement.service;

import com.example.employeemanagement.dto.NotificationResponse;

import java.util.List;

public interface NotificationService {

    List<NotificationResponse> getMyNotifications(
            String username);

    List<NotificationResponse> getMyUnreadNotifications(
            String username);

    long getUnreadCount(String username);

    void markAsRead(
            Long notificationId,
            String username);

    void markAllAsRead(String username);
}