import { AxiosInstance } from 'axios';
import { createRequestInstance } from './request.config.js';

// Type-safe browser API access
interface Storage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

declare const sessionStorage: Storage | undefined;

/**
 * User Service
 * Handles all user-related API calls
 */
export class UserService {
  private readonly apiClient: AxiosInstance;

  constructor(baseURL?: string) {
    if (baseURL) {
      this.apiClient = createRequestInstance(baseURL);
    } else {
      // Use default Request instance
      this.apiClient = createRequestInstance(
        import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
      );
    }
  }

  async getAllUsers() {
    const token = sessionStorage?.getItem('admin_accessToken');
    const response = await this.apiClient.get('/users', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  }
}

/**
 * Create an instance of UserService
 * @param baseURL - API base URL
 */
export const createUserService = (baseURL?: string) => {
  return new UserService(baseURL);
};

export const userService = new UserService();
