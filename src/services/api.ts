import axios from 'axios';
import { invalidateSession } from '@/utils/authSession';

// VITE_API_URL must be the full API base URL including /api
// e.g. http://localhost:3000/api  or  https://your-backend.onrender.com/api
// Falls back to relative '/api' so same-origin deployments work without any env var.
const rawApiUrl = import.meta.env.VITE_API_URL || '';
export const API_URL = rawApiUrl.replace(/\/+$/, '') || '/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('azores_score_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      invalidateSession(status);
    }

    return Promise.reject(error);
  }
);
