import request from './api';

export const getNotifications = () =>
  request('/notifications');

export const markAsRead = (id) =>
  request(`/notifications/${id}/read`, 'PUT');

export const markAllAsRead = () =>
  request('/notifications/read-all', 'PUT');