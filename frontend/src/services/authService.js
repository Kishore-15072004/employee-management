import api from './api.js';

export async function login(credentials) {
  const { data } = await api.post('/auth/login', credentials);
  return data;
}

