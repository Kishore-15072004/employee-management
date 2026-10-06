package com.example.employeemanagement.repository;

import com.example.employeemanagement.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification> findByEmployeeIdOrderByCreatedAtDesc(
            Long employeeId);

    List<Notification> findByEmployeeIdAndReadFalseOrderByCreatedAtDesc(
            Long employeeId);

    long countByEmployeeIdAndReadFalse(Long employeeId);
}