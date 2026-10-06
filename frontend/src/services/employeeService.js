import api from './api.js';

export const listEmployees = () => api.get('/employees');
export const getEmployee = (id) => api.get(`/employees/${id}`);
export const getMyProfile = () => api.get('/employees/me');
export const updateMyProfile = (body) => api.put('/employees/me', body);
export const createEmployee = (body) => api.post('/employees', body);
export const updateEmployee = (id, body) => api.put(`/employees/${id}`, body);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);
export const getEmployeeSalary = (id) => api.get(`/employees/${id}/salary`);
export const assignEmployeeManager = (employeeId, managerId) => api.put(`/employees/${employeeId}/manager/${managerId}`);
export const getEmployeeAttendance = (id) => api.get(`/attendance/employee/${id}`);
export const getMyAttendance = () => api.get('/attendance/my');