import axios from 'axios';
import { readStoredSession } from '../utils/storage.js';

/**
 * Configurable API root. Copy .env.example to .env and change VITE_API_URL if
 * the backend runs elsewhere.
 */
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5001').replace(/\/$/, '');

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the demo JWT to every request when a session exists.
api.interceptors.request.use((requestConfig) => {
  const session = readStoredSession();

  if (session?.token) {
    requestConfig.headers.Authorization = `Bearer ${session.token}`;
  }

  return requestConfig;
});

// A 401 on an authenticated request means the token is stale: clear the
// session so the route guard can redirect to the login screen.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const hadAuthHeader = Boolean(
      error.config?.headers?.Authorization ||
        error.config?.headers?.get?.('Authorization'),
    );

    if (error.response?.status === 401 && hadAuthHeader) {
      window.dispatchEvent(new Event('tandem:unauthorized'));
    }

    return Promise.reject(error);
  },
);

export async function ping() {
  const { data } = await api.get('/ping', { timeout: 5000 });
  return data;
}

/**
 * Converts axios/network failures into copy that is useful in the interface.
 */
export function getApiErrorMessage(
  error,
  fallback = 'Something went wrong. Please try again.',
) {
  if (error?.code === 'ECONNABORTED') {
    return 'The request timed out. Check that the backend is running, then try again.';
  }

  if (!error?.response) {
    return `Cannot reach the backend at ${API_URL}. Start the API and try again.`;
  }

  const payload = error.response.data;

  if (payload?.details?.length) {
    return payload.details[0].message;
  }

  return payload?.error || fallback;
}
