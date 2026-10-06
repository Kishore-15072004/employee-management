package com.example.employeemanagement.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.employeemanagement.dto.EmployeeResponse;
import com.example.employeemanagement.dto.EmployeeUpdateRequest;
import com.example.employeemanagement.dto.SalaryResponse;
import com.example.employeemanagement.dto.SelfProfileUpdateRequest;
import com.example.employeemanagement.entity.Department;
import com.example.employeemanagement.entity.Employee;
import com.example.employeemanagement.entity.Role;
import com.example.employeemanagement.exception.AccessDeniedException;
import com.example.employeemanagement.exception.DuplicateEmployeeException;
import com.example.employeemanagement.exception.DuplicateUsernameException;
import com.example.employeemanagement.exception.EmployeeNotFoundException;
import com.example.employeemanagement.repository.DepartmentRepository;
import com.example.employeemanagement.repository.EmployeeRepository;
import com.example.employeemanagement.service.EmployeeService;

@Service
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
        private final PasswordEncoder passwordEncoder;

    public EmployeeServiceImpl(
            EmployeeRepository employeeRepository,
                        DepartmentRepository departmentRepository,
                        PasswordEncoder passwordEncoder) {

        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
                this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Employee createEmployee(
            Employee employee,
            Long departmentId) {

        if (employeeRepository.existsByEmployeeCode(
                employee.getEmployeeCode())) {

            throw new DuplicateEmployeeException(
                    "Employee code already exists: "
                            + employee.getEmployeeCode());
        }

        if (employeeRepository.existsByEmail(
                employee.getEmail())) {

            throw new DuplicateEmployeeException(
                    "Email already exists: "
                            + employee.getEmail());
        }

        if (employeeRepository.existsByUsername(employee.getUsername())) {

                        throw new DuplicateUsernameException(
                    "Username already exists: "
                            + employee.getUsername());
        }

        Department department =
                departmentRepository.findById(departmentId)
                        .orElseThrow(() ->
                                new EmployeeNotFoundException(
                                        "Department not found: "
                                                + departmentId));

        employee.setPassword(passwordEncoder.encode(employee.getPassword()));
        employee.setRole(Role.EMPLOYEE);
        employee.setEnabled(true);
        employee.setDepartment(department);

        return employeeRepository.save(employee);
    }

    @Override
    public Employee getEmployeeById(Long id) {

        return employeeRepository.findById(id)
                .orElseThrow(() ->
                        new EmployeeNotFoundException(
                                "Employee not found: " + id));
    }

    @Override
    public EmployeeResponse getEmployeeForUser(
            String username,
            Long employeeId) {

        Employee requester = getEmployeeByUsername(username);

        Employee employee = getEmployeeById(employeeId);

        // ADMIN and HR can view any employee
        if (requester.getRole() == Role.ADMIN ||
                requester.getRole() == Role.HR) {

            return toEmployeeResponse(employee);
        }

        // EMPLOYEE can view only their own profile
        if (requester.getRole() == Role.EMPLOYEE) {

            if (employee.getId().equals(requester.getId())) {

                return toEmployeeResponse(employee);
            }

            throw new AccessDeniedException(
                    "You can only access your own profile");
        }

        // TEAM_MANAGER can view assigned team members
        if (requester.getRole() == Role.TEAM_MANAGER) {

            Employee manager =
                    employeeRepository
                            .findByUsername(username)
                            .orElseThrow(() ->
                                    new EmployeeNotFoundException(
                                            "Manager employee record not found"));

            if (employee.getManager() != null &&
                    employee.getManager()
                            .getId()
                            .equals(manager.getId())) {

                return toEmployeeResponse(employee);
            }

            throw new AccessDeniedException(
                    "You can only access employees assigned to your team");
        }

        throw new AccessDeniedException(
                "You are not allowed to access this employee");
    }

        @Override
        @Transactional(readOnly = true)
        public EmployeeResponse getMyProfile(String username) {
                return toEmployeeResponse(getEmployeeByUsername(username));
        }

        @Override
        public EmployeeResponse updateMyProfile(
                        String username,
                        SelfProfileUpdateRequest request) {

                Employee employee = getEmployeeByUsername(username);
                Optional<Employee> employeeWithEmail =
                                employeeRepository.findByEmail(request.getEmail());

                if (employeeWithEmail.isPresent()
                                && !employeeWithEmail.get().getId().equals(employee.getId())) {
                        throw new DuplicateEmployeeException(
                                        "Email already exists: " + request.getEmail());
                }

                employee.setFirstName(request.getFirstName());
                employee.setLastName(request.getLastName());
                employee.setEmail(request.getEmail());
                employee.setPhone(request.getPhone());

                if (request.getPassword() != null
                                && !request.getPassword().isBlank()) {
                        employee.setPassword(passwordEncoder.encode(request.getPassword()));
                }

                return toEmployeeResponse(employeeRepository.save(employee));
        }

    @Override
    public EmployeeResponse updateEmployee(
            Long id,
            EmployeeUpdateRequest request) {

        Employee employee = getEmployeeById(id);

        Optional<Employee> existingEmployee =
                employeeRepository.findByEmail(
                        request.getEmail());

        if (existingEmployee.isPresent()
                && !existingEmployee.get()
                        .getId()
                        .equals(id)) {

            throw new DuplicateEmployeeException(
                    "Email already exists: "
                            + request.getEmail());
        }

        Department department =
                departmentRepository.findById(
                        request.getDepartmentId())
                        .orElseThrow(() ->
                                new EmployeeNotFoundException(
                                        "Department not found: "
                                                + request.getDepartmentId()));

        employee.setFirstName(
                request.getFirstName());

        employee.setLastName(
                request.getLastName());

        employee.setEmail(
                request.getEmail());

        employee.setPhone(
                request.getPhone());

        employee.setDepartment(
                department);

        employee.setDesignation(
                request.getDesignation());

        Employee updatedEmployee =
                employeeRepository.save(employee);

        return toEmployeeResponse(updatedEmployee);
    }

    @Override
    public SalaryResponse getSalary(Long employeeId) {

        Employee employee =
                employeeRepository.findById(employeeId)
                        .orElseThrow(() ->
                                new EmployeeNotFoundException(
                                        "Employee not found: "
                                                + employeeId));

        return new SalaryResponse(
                employee.getId(),
                employee.getEmployeeCode(),
                employee.getFirstName()
                        + " "
                        + employee.getLastName(),
                employee.getSalary());
    }

    @Override
    public void deleteEmployee(Long id) {

        Employee employee = getEmployeeById(id);

        if (employeeRepository.existsByManagerId(id)) {

            throw new AccessDeniedException(
                    "Cannot delete an employee who is currently a manager");
        }

        employeeRepository.delete(employee);
    }

    @Override
    public void assignManager(
            Long employeeId,
            Long managerId) {

        if (employeeId.equals(managerId)) {

            throw new AccessDeniedException(
                    "An employee cannot be their own manager");
        }

        Employee employee =
                employeeRepository.findById(employeeId)
                        .orElseThrow(() ->
                                new EmployeeNotFoundException(
                                        "Employee not found: "
                                                + employeeId));

        Employee manager =
                employeeRepository.findById(managerId)
                        .orElseThrow(() ->
                                new EmployeeNotFoundException(
                                        "Manager not found: "
                                                + managerId));

        if (manager.getRole() != Role.TEAM_MANAGER) {

            throw new AccessDeniedException(
                    "Selected employee is not a TEAM_MANAGER");
        }

        employee.setManager(manager);

        employeeRepository.save(employee);
    }

    @Override
    public List<EmployeeResponse> getEmployeesForUser(
            String username) {

        Employee requester = getEmployeeByUsername(username);

        List<Employee> employees;

        if (requester.getRole() == Role.ADMIN ||
                requester.getRole() == Role.HR) {

            employees = employeeRepository.findAll();

        } else if (requester.getRole() ==
                Role.TEAM_MANAGER) {

            Employee manager =
                    employeeRepository
                            .findByUsername(username)
                            .orElseThrow(() ->
                                    new EmployeeNotFoundException(
                                            "Manager employee record not found"));

            employees =
                    employeeRepository
                            .findByManagerId(
                                    manager.getId());

        } else {

            throw new AccessDeniedException(
                    "You are not allowed to view employee list");
        }

        return employees.stream()
                .map(this::toEmployeeResponse)
                .toList();
    }

    private EmployeeResponse toEmployeeResponse(Employee employee) {

        return new EmployeeResponse(
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

                employee.getManager() != null
                        ? employee.getManager().getId()
                        : null,

                employee.getManager() != null
                        ? employee.getManager().getFirstName()
                            + " "
                            + employee.getManager().getLastName()
                        : null
        );
    }

    private Employee getEmployeeByUsername(String username) {
        return employeeRepository.findByUsername(username)
                .orElseThrow(() -> new EmployeeNotFoundException(
                        "Employee not found for username: " + username));
    }
}