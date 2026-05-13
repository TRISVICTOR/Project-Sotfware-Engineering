const BASE_URL = 'http://localhost:5000/api';

const request = async (endpoint, method = 'GET', body = null) => {
  const token = localStorage.getItem('token');

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(body && { body: JSON.stringify(body) }),
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || 'Terjadi kesalahan');
  return data;
};

export default request;