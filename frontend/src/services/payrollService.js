import api from './api.js';

export const listPayroll = () => api.get('/payroll');
export const getEmployeePayroll = (employeeId) => api.get(`/payroll/employees/${employeeId}`);
export const createPayroll = (employeeId, body) => api.post(`/payroll/employees/${employeeId}`, body);
export const updatePayroll = (employeeId, body) => api.put(`/payroll/employees/${employeeId}`, body);