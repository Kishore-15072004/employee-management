package com.example.employeemanagement.repository;

import com.example.employeemanagement.entity.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PayrollRepository
        extends JpaRepository<Payroll, Long> {

    Optional<Payroll> findByEmployeeId(Long employeeId);

    boolean existsByEmployeeId(Long employeeId);
}