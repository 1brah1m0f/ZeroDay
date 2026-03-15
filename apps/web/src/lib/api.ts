import axios from 'axios';
import type { Listing, PaginatedResponse } from '@comtech/shared';

export type ListingsResponse = PaginatedResponse<Listing>;

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: auto-attach token + handle FormData
api.interceptors.request.use((config) => {
  // For FormData, let the browser set Content-Type with boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('comtech-auth');
    if (stored) {
      try {
        const { state } = JSON.parse(stored);
        if (state?.accessToken) {
          config.headers.Authorization = `Bearer ${state.accessToken}`;
        }
      } catch {}
    }
  }
  return config;
});

// Interceptor: handle 401
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Could trigger refresh token logic here
    }
    return Promise.reject(error);
  },
);
