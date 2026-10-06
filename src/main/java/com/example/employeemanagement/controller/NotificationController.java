package com.example.employeemanagement.controller;

import com.example.employeemanagement.dto.NotificationResponse;
import com.example.employeemanagement.service.NotificationService;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(
            NotificationService notificationService) {

        this.notificationService = notificationService;
    }

    @GetMapping
    public List<NotificationResponse> getMyNotifications(
            Authentication authentication) {

        return notificationService.getMyNotifications(
                authentication.getName());
    }

    @GetMapping("/unread")
    public List<NotificationResponse> getMyUnreadNotifications(
            Authentication authentication) {

        return notificationService.getMyUnreadNotifications(
                authentication.getName());
    }

    @GetMapping("/unread/count")
    public long getUnreadCount(
            Authentication authentication) {

        return notificationService.getUnreadCount(
                authentication.getName());
    }

    @PutMapping("/{id}/read")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void markAsRead(
            @PathVariable Long id,
            Authentication authentication) {

        notificationService.markAsRead(
                id,
                authentication.getName());
    }

    @PutMapping("/read-all")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void markAllAsRead(
            Authentication authentication) {

        notificationService.markAllAsRead(
                authentication.getName());
    }
}