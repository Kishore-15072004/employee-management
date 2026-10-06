import api from './api.js';

export const listDepartments = () => api.get('/departments');
export const getDepartment = (id) => api.get(`/departments/${id}`);
export const createDepartment = (body) => api.post('/departments', body);
export const updateDepartment = (id, body) => api.put(`/departments/${id}`, body);
export const deleteDepartment = (id) => api.delete(`/departments/${id}`);
export const listDepartmentEmployees = (id) => api.get(`/departments/${id}/employees`);