import axios from 'axios';
import { invalidateSession } from '@/utils/authSession';

// VITE_API_URL: set this in Render to your backend origin.
// It can be with OR without the /api suffix – this code normalises both:
//   https://azores-score-backend.onrender.com       → .../api
//   https://azores-score-backend.onrender.com/api   → .../api (unchanged)
//   (empty)                                         → /api  (same-origin fallback)
const rawApiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
export const API_URL = rawApiUrl
  ? rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`
  : '/api';

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
