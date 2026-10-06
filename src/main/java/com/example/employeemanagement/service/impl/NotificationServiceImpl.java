package com.example.employeemanagement.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.employeemanagement.dto.NotificationResponse;
import com.example.employeemanagement.entity.Employee;
import com.example.employeemanagement.entity.Notification;
import com.example.employeemanagement.exception.AccessDeniedException;
import com.example.employeemanagement.exception.EmployeeNotFoundException;
import com.example.employeemanagement.exception.NotificationNotFoundException;
import com.example.employeemanagement.repository.EmployeeRepository;
import com.example.employeemanagement.repository.NotificationRepository;
import com.example.employeemanagement.service.NotificationService;

@Service
@Transactional
public class NotificationServiceImpl
        implements NotificationService {

    private final NotificationRepository notificationRepository;
        private final EmployeeRepository employeeRepository;

    public NotificationServiceImpl(
            NotificationRepository notificationRepository,
                        EmployeeRepository employeeRepository) {

        this.notificationRepository = notificationRepository;
                this.employeeRepository = employeeRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getMyNotifications(
            String username) {

        Employee employee = getEmployee(username);

        return notificationRepository
                .findByEmployeeIdOrderByCreatedAtDesc(employee.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse>
    getMyUnreadNotifications(String username) {

        Employee employee = getEmployee(username);

        return notificationRepository
                .findByEmployeeIdAndReadFalseOrderByCreatedAtDesc(
                        employee.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(String username) {

        Employee employee = getEmployee(username);

        return notificationRepository
                .countByEmployeeIdAndReadFalse(employee.getId());
    }

    @Override
    public void markAsRead(
            Long notificationId,
            String username) {

        Employee employee = getEmployee(username);

        Notification notification =
                notificationRepository.findById(notificationId)
                        .orElseThrow(() ->
                                new NotificationNotFoundException(
                                        "Notification not found: "
                                                + notificationId));

        if (!notification.getEmployee()
                .getId()
                .equals(employee.getId())) {

            throw new AccessDeniedException(
                    "You can only update your own notifications");
        }

        notification.setRead(true);

        notificationRepository.save(notification);
    }

    @Override
    public void markAllAsRead(String username) {

        Employee employee = getEmployee(username);

        List<Notification> notifications =
                notificationRepository
                        .findByEmployeeIdAndReadFalseOrderByCreatedAtDesc(
                                employee.getId());

        notifications.forEach(
                notification -> notification.setRead(true));

        notificationRepository.saveAll(notifications);
    }

    private Employee getEmployee(String username) {

        return employeeRepository.findByUsername(username)
                .orElseThrow(() ->
                new EmployeeNotFoundException(
                        "Employee not found: " + username));
    }

    private NotificationResponse toResponse(
            Notification notification) {

        return new NotificationResponse(
                notification.getId(),
                notification.getType(),
                notification.getMessage(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
}