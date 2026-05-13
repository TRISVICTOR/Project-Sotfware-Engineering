import request from './api';

export const getMyGroups = () =>
  request('/groups/my');

export const getGroupById = (id) =>
  request(`/groups/${id}`);

export const createGroup = (data) =>
  request('/groups', 'POST', data);

export const addMember = (groupId, user_id) =>
  request(`/groups/${groupId}/members`, 'POST', { user_id });

export const removeMember = (groupId, userId) =>
  request(`/groups/${groupId}/members/${userId}`, 'DELETE');

export const deleteGroup = (groupId) =>
  request(`/groups/${groupId}`, 'DELETE');