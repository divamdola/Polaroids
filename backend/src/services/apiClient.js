import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL || 'http://localhost:5000/api',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = process.env.API_TOKEN || null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error', error.message);
    return Promise.reject(error);
  },
);

export default apiClient;
