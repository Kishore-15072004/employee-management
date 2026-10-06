import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

export function describeApiError(error) {
  const body = error?.response?.data;
  if (typeof body === 'string' && body.trim()) return body;
  const serverMessage = body?.message || body?.detail || body?.error;
  if (serverMessage) return serverMessage;
  if (body?.messages && typeof body.messages === 'object') {
    return Object.values(body.messages).filter(Boolean).join(' ');
  }
  const fallback = {
    400: 'Please check the submitted information and try again.',
    401: 'Your session has expired. Sign in again.',
    403: 'Your account is not permitted to access this resource.',
    404: 'The requested resource could not be found.',
    409: 'This change conflicts with existing data.',
    500: 'The server could not complete the request. Please try again later.',
  };
  return fallback[error?.response?.status] || error?.message || 'Unexpected API error.';
}

function notify(name, detail) {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('peopleos_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = describeApiError(error);
    const isAuthRequest = error.config?.url?.startsWith('/auth/');
    if (status === 401) {
      sessionStorage.removeItem('peopleos_token');
      sessionStorage.removeItem('peopleos_user');
      notify('peopleos:unauthorized', { message });
    } else if (status === 403 && !isAuthRequest) {
      notify('peopleos:toast', { kind: 'warning', message });
    } else if (!isAuthRequest) {
      notify('peopleos:toast', { kind: 'error', message });
    }
    return Promise.reject(Object.assign(error, { message }));
  },
);

export default api;