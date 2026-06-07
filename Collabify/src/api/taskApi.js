import request from './api';

export const getMyTasks = () =>
  request('/tasks/my');

export const getTaskById = (id) =>
  request(`/tasks/${id}`);

export const createTask = (data) =>
  request('/tasks', 'POST', data);

export const updateTask = (id, data) =>
  request(`/tasks/${id}`, 'PUT', data);

export const deleteTask = (id) =>
  request(`/tasks/${id}`, 'DELETE'); 

export const uploadFileLampiran = async (taskId, file) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`http://localhost:5000/api/upload/task/${taskId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal upload file');
  return data;
};