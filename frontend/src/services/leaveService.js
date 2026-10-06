import api from './api.js';

export const applyLeave = (body) => api.post('/leaves', body);
export const listMyLeaves = () => api.get('/leaves/my');
export const listPendingTeamLeaves = () => api.get('/leaves/team/pending');
export const approveLeave = (id) => api.put(`/leaves/${id}/approve`);
export const rejectLeave = (id) => api.put(`/leaves/${id}/reject`);
export const cancelLeave = (id) => api.put(`/leaves/${id}/cancel`);