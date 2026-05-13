import request from './api';

export const getFriends = () =>
  request('/friends');

export const getPendingRequests = () =>
  request('/friends/pending');

export const sendFriendRequest = (friend_id) =>
  request('/friends/request', 'POST', { friend_id });

export const respondFriendRequest = (id, status) =>
  request(`/friends/request/${id}`, 'PUT', { status });