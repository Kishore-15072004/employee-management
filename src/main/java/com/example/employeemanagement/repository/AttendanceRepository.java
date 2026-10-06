package com.example.employeemanagement.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.employeemanagement.entity.Attendance;
import com.example.employeemanagement.entity.AttendanceStatus;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

	Optional<Attendance> findByEmployeeIdAndAttendanceDate(Long employeeId, LocalDate attendanceDate);

	List<Attendance> findByEmployeeIdOrderByAttendanceDateDesc(Long employeeId);

	List<Attendance> findByAttendanceDate(LocalDate attendanceDate);

	boolean existsByEmployeeIdAndAttendanceDate(Long employeeId, LocalDate attendanceDate);

	List<Attendance> findAllByOrderByAttendanceDateDesc();

	long countByAttendanceDateAndStatus(LocalDate attendanceDate, AttendanceStatus status);
}