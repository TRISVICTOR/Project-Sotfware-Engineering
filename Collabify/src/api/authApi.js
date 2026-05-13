import request from './api';

export const register = (nama, email, password) =>
  request('/auth/register', 'POST', { nama, email, password });

export const login = (email, password) =>
  request('/auth/login', 'POST', { email, password });

export const getProfile = () =>
  request('/auth/profile');

export const updateAkun = (data) =>
  request('/auth/update', 'PUT', data);