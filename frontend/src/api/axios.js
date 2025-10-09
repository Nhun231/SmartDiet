import axios from 'axios';

const baseAxios = axios.create({
  baseURL: 'http://localhost:8080/smartdiet/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false // Changed to false to match CORS wildcard policy
});

// Add request interceptor to include auth token
baseAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default baseAxios;
