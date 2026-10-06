import api from './api.js';

export const listNotifications = () => api.get('/notifications');
export const listUnreadNotifications = () => api.get('/notifications/unread');
export const getUnreadNotificationCount = () => api.get('/notifications/unread/count');
export const markNotificationRead = (id) => api.put(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => api.put('/notifications/read-all');