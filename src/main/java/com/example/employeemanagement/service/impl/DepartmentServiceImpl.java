package com.example.employeemanagement.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.employeemanagement.dto.DepartmentCreateRequest;
import com.example.employeemanagement.dto.DepartmentResponse;
import com.example.employeemanagement.dto.EmployeeResponse;
import com.example.employeemanagement.entity.Department;
import com.example.employeemanagement.exception.DepartmentNotFoundException;
import com.example.employeemanagement.exception.DuplicateEmployeeException;
import com.example.employeemanagement.repository.DepartmentRepository;
import com.example.employeemanagement.repository.EmployeeRepository;
import com.example.employeemanagement.service.DepartmentService;

@Service
@Transactional
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;

    private final EmployeeRepository employeeRepository;

    public DepartmentServiceImpl(
            DepartmentRepository departmentRepository,
            EmployeeRepository employeeRepository) {

        this.departmentRepository = departmentRepository;
        this.employeeRepository = employeeRepository;
    }

    @Override
    public DepartmentResponse createDepartment(
            DepartmentCreateRequest request) {

        if (departmentRepository
                .existsByNameIgnoreCase(request.getName())) {

            throw new DuplicateEmployeeException(
                    "Department already exists: "
                            + request.getName());
        }

        Department department = new Department();

        department.setName(request.getName().trim());

        department.setDescription(
                request.getDescription());

        Department savedDepartment =
                departmentRepository.save(department);

        return toDepartmentResponse(savedDepartment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentResponse> getAllDepartments() {

        return departmentRepository.findAll()
                .stream()
                .map(this::toDepartmentResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DepartmentResponse getDepartmentById(Long id) {

        Department department =
                getDepartment(id);

        return toDepartmentResponse(department);
    }

    @Override
    public DepartmentResponse updateDepartment(
            Long id,
            DepartmentCreateRequest request) {

        Department department =
                getDepartment(id);

        if (!department.getName()
                .equalsIgnoreCase(request.getName())
                && departmentRepository
                    .existsByNameIgnoreCase(
                            request.getName())) {

            throw new DuplicateEmployeeException(
                    "Department already exists: "
                            + request.getName());
        }

        department.setName(
                request.getName().trim());

        department.setDescription(
                request.getDescription());

        Department updatedDepartment =
                departmentRepository.save(department);

        return toDepartmentResponse(updatedDepartment);
    }

    @Override
    public void deleteDepartment(Long id) {

        Department department =
                getDepartment(id);

        if (employeeRepository
                .existsByDepartmentId(id)) {

            throw new IllegalStateException(
                    "Cannot delete department because employees are assigned to it");
        }

        departmentRepository.delete(department);
    }

    private Department getDepartment(Long id) {

        return departmentRepository.findById(id)
                .orElseThrow(() ->
                        new DepartmentNotFoundException(
                                "Department not found: "
                                        + id));
    }

    private DepartmentResponse toDepartmentResponse(
            Department department) {

        return new DepartmentResponse(
                department.getId(),
                department.getName(),
                department.getDescription()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeResponse> getEmployeesByDepartment(
            Long departmentId) {

        // Make sure the department exists
        getDepartment(departmentId);

        return employeeRepository
                .findByDepartmentId(departmentId)
                .stream()
                .map(employee -> new EmployeeResponse(

                        employee.getId(),

                        employee.getEmployeeCode(),

                        employee.getFirstName(),

                        employee.getLastName(),

                        employee.getEmail(),

                        employee.getPhone(),

                        employee.getDepartment() != null
                                ? employee.getDepartment().getName()
                                : null,

                        employee.getDesignation(),

                        // Manager ID
                        employee.getManager() != null
                                ? employee.getManager().getId()
                                : null,

                        // Manager Name
                        employee.getManager() != null
                                ? employee.getManager().getFirstName()
                                    + " "
                                    + employee.getManager().getLastName()
                                : null
                ))
                .toList();
    }
}