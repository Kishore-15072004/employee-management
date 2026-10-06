import api from './api.js';

export const checkIn = () => api.post('/attendance/check-in');
export const checkOut = () => api.put('/attendance/check-out');
export const listMyAttendance = () => api.get('/attendance/my');
export const listEmployeeAttendance = (employeeId) => api.get(`/attendance/employee/${employeeId}`);
export const listAllAttendance = () => api.get('/attendance');