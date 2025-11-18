import { AxiosInstance } from 'axios';
import {
  LoginRequest,
  RegisterRequest,
} from '@abc-interview-support-frontend/types';
import { createRequestInstance } from './request.config.js';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
export class AuthService {
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

  /**
   * User login
   * @param credentials - Email and password
   * @returns Login response with user data and tokens
   */
  async login(credentials: LoginRequest) {
    const response = await this.apiClient.post('/auth/login', credentials);
    return response.data;
  }

  /**
   * get user info
   * @returns User info data
   */
  async getUserInfo() {
    const response = await this.apiClient.get('/auth/user-info');
    return response.data;
  }

  /**
   * User registration
   * @param userData - Registration data
   * @returns Registered user information
   */
  async register(userData: RegisterRequest) {
    const response = await this.apiClient.post('/auth/register', userData);
    return response.data;
  }

  /**
   * User logout
   * @param sessionId - Session ID to invalidate
   * @param refreshToken - Refresh token to invalidate
   */
  async logout(sessionId?: string, refreshToken?: string) {
    const response = await this.apiClient.post('/auth/logout', {
      sessionId,
      refreshToken,
    });
    return response.data;
  }
}
/**
 * Create an instance of AuthService
 * @param baseURL - API base URL (optional, uses VITE_API_BASE_URL if not provided)
 */
export const createAuthService = (baseURL?: string) => {
  return new AuthService(baseURL);
};

/**
 * Default AuthService instance
 * Uses VITE_API_BASE_URL from environment variables
 *
 * Usage:
 *   import { authService } from '@abc-interview-support-frontend/services';
 *   const data = await authService.login({ email, password });
 */
export const authService = new AuthService();
