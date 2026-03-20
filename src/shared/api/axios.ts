import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../../features/auth/store/auth.store';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Attach in-memory access token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Silent refresh on 401 ────────────────────────────────────────────────────
// When access token expires mid-session:
//   1) Try POST /auth/refresh (httpOnly cookie sends automatically)
//   2) If success → store new token → retry original request
//   3) If fail → logout + redirect
//   4) If multiple requests 401 at once → only one refresh, others wait

let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(token: string | null, error: unknown = null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  pendingQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Skip refresh attempts and already-retried requests
    const url = originalRequest?.url ?? '';
    const isRefreshUrl = url.includes('/auth/refresh');

    if (
      error.response?.status !== 401 ||
      isRefreshUrl ||
      originalRequest._retry
    ) {
      // Non-401 or refresh itself failed → reject as-is
      if (error.response?.status === 401 && isRefreshUrl) {
        useAuthStore.getState().logout();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }

    // 401 on a normal request → try silent refresh
    if (isRefreshing) {
      // Another refresh is in progress — wait for it
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            originalRequest._retry = true;
            resolve(api(originalRequest));
          },
          reject: (err: unknown) => reject(err),
        });
      });
    }

    isRefreshing = true;
    originalRequest._retry = true;

    try {
      const res = await api.post('/auth/refresh');
      const { accessToken } = res.data.data;

      useAuthStore.getState().setToken(accessToken);
      processQueue(accessToken);

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(null, refreshError);
      useAuthStore.getState().logout();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
