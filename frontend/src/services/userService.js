import api from './api.js';

export const listUsers = () => api.get('/users');
export const setUserEnabled = (id, enabled) => api.put(`/users/${id}/status`, null, { params: { enabled } });
export const updateUserRole = (id, role) => api.put(`/users/${id}/role`, { role });