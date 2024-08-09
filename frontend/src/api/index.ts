import axios from 'axios';
import { clearToken, getToken } from './auth';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.config.url.indexOf('auth/login') !== -1 ||
      error.config.url.indexOf('users/me') !== -1
    )
      return Promise.reject(error);

    if (error.response.status === 401) {
      clearToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
