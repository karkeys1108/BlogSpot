import axios from 'axios';

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('blogspot_token', token);
  } else {
    localStorage.removeItem('blogspot_token');
  }
}

const api = axios.create({
  baseURL: '/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('blogspot_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      setAuthToken(null);
    }
    return Promise.reject(error);
  }
);

export default api;
