import api from './api.js';

export const getAdminDashboard = () => api.get('/dashboard');
export const getEmployeeDirectory = () => api.get('/employees');
export const getDepartmentDirectory = () => api.get('/departments');
export const getOrganizationAttendance = () => api.get('/attendance');
export const getTeamLeaveQueue = () => api.get('/leaves/team/pending');
export const getMyDashboardAttendance = () => api.get('/attendance/my');
export const getMyDashboardLeaves = () => api.get('/leaves/my');
export const getPayrollDirectory = () => api.get('/payroll');
export const getDashboardUnreadCount = () => api.get('/notifications/unread/count');