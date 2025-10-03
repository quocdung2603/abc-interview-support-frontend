import { AxiosInstance } from 'axios';
import { LoginRequest } from '@abc-interview-support-frontend/types';
import { createRequestInstance } from './request.config.js';

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

  async login(credentials: LoginRequest) {
    const response = await this.apiClient.post('/users/login', credentials);
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
