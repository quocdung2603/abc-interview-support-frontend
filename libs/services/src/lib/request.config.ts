import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
} from 'axios';

/**
 * Request Configuration
 * Centralized axios instance with interceptors for all API calls
 */

// Type-safe browser API access
interface Window {
  location: {
    href: string;
  };
}

interface Storage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

declare const window: Window | undefined;
declare const sessionStorage: Storage | undefined;

// Helper to safely access browser APIs
const isBrowser = () =>
  typeof window !== 'undefined' && typeof sessionStorage !== 'undefined';

/**
 * Clear authentication tokens and redirect to SSO
 */
const redirectToSSO = () => {
  if (!isBrowser()) return;

  // Clear tokens from sessionStorage
  if (sessionStorage) {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('user');
  }

  const ssoUrl = import.meta.env.VITE_SSO_URL || 'http://localhost:4200';
  if (window) {
    window.location.href = ssoUrl;
  }
};

/**
 * Handle common HTTP errors
 */
const handleCommonErrors = (error: AxiosError) => {
  const status = error.response?.status;

  if (status === 403) {
    console.error(
      'Forbidden! You do not have permission to access this resource.'
    );
  } else if (status === 404) {
    console.error('Resource not found!');
  } else if (status === 500) {
    console.error('Server error! Please try again later.');
  }
};

/**
 * Handle 401 Unauthorized error with token refresh
 */
const handleUnauthorizedError = async (
  error: AxiosError,
  instance: AxiosInstance
) => {
  if (!isBrowser()) return Promise.reject(error);

  const originalRequest = error.config as InternalAxiosRequestConfig & {
    _retry?: boolean;
  };

  console.error('Unauthorized! Token expired or invalid.');

  // Check if we already tried to refresh
  if (originalRequest._retry) {
    redirectToSSO();
    return Promise.reject(error);
  }

  originalRequest._retry = true;

  try {
    // Get refresh token from sessionStorage
    const refreshToken = sessionStorage?.getItem('refreshToken');

    if (!refreshToken) {
      console.warn('No refresh token found, redirecting to SSO');
      redirectToSSO();
      return Promise.reject(error);
    }

    // Call refresh token endpoint
    const response = await axios.post(
      `${originalRequest.baseURL}/auth/refresh`,
      { refreshToken }
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    // Save new tokens
    if (sessionStorage) {
      sessionStorage.setItem('accessToken', accessToken);
      if (newRefreshToken) {
        sessionStorage.setItem('refreshToken', newRefreshToken);
      }
    }

    // Retry original request with new token
    if (originalRequest.headers) {
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
    }

    return instance(originalRequest);
  } catch (refreshError) {
    console.error('Token refresh failed:', refreshError);
    redirectToSSO();
    return Promise.reject(
      refreshError instanceof Error
        ? refreshError
        : new Error('Token refresh failed')
    );
  }
};

/**
 * Create a configured axios instance
 * @param baseURL - API base URL (from env variable)
 * @param timeout - Request timeout in milliseconds (default: 10000)
 */
export const createRequestInstance = (
  baseURL: string,
  timeout = 10000
): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor: Add token to every request
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Get token from sessionStorage (only in browser)
      if (isBrowser() && sessionStorage) {
        const token = sessionStorage.getItem('accessToken');

        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      return config;
    },
    (error: AxiosError) => {
      // Handle request error
      console.error('Request error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor: Handle common response errors
  instance.interceptors.response.use(
    (response) => {
      // Return response data directly for successful requests
      return response;
    },
    async (error: AxiosError) => {
      handleCommonErrors(error);

      // Handle 401 Unauthorized with token refresh
      if (error.response?.status === 401) {
        return handleUnauthorizedError(error, instance);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

/**
 * Default request instance using environment variables
 * This will be created when the module is imported
 */
let defaultInstance: AxiosInstance | null = null;

/**
 * Get or create the default request instance
 * @returns Configured axios instance
 */
export const getRequestInstance = (): AxiosInstance => {
  if (!defaultInstance) {
    const baseURL =
      import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const timeout = Number(import.meta.env.VITE_API_TIMEOUT) || 10000;

    defaultInstance = createRequestInstance(baseURL, timeout);
  }

  return defaultInstance;
};

/**
 * Reset the default instance (useful for testing or config changes)
 */
export const resetRequestInstance = () => {
  defaultInstance = null;
};

/**
 * Export the default instance
 */
export const Request = getRequestInstance();
