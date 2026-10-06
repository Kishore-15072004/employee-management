package com.example.employeemanagement.repository;

import com.example.employeemanagement.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Optional<Employee> findByEmployeeCode(String employeeCode);

    boolean existsByEmployeeCode(String employeeCode);

    boolean existsByEmail(String email);

    Optional<Employee> findByUsername(String username);

    boolean existsByUsername(String username);

    Optional<Employee> findByEmail(String email);

    List<Employee> findByManagerId(Long managerId);

    boolean existsByManagerId(Long managerId);

    List<Employee> findByDepartmentId(Long departmentId);
    
    boolean existsByDepartmentId(Long departmentId);
    
    long countByDepartmentId(Long departmentId);
}