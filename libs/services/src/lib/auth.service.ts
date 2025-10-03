import { AxiosInstance } from 'axios';
import {
  LoginRequest,
  RegisterRequest,
  AuthUser,
  VerifySessionRequest,
  VerifySessionResponse,
  RefreshTokenRequest,
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
   * User registration
   * @param userData - Registration data
   * @returns Registered user information
   */
  async register(userData: RegisterRequest) {
    const response = await this.apiClient.post('/auth/register', userData);
    return response.data;
  }

  /**
   * Verify SSO session token
   * @param request - SSO auth token or session ID
   * @returns Access token, refresh token, and user data
   */
  async verifySession(
    request: VerifySessionRequest
  ): Promise<VerifySessionResponse> {
    const response = await this.apiClient.post('/auth/verify-session', request);
    return response.data;
  }

  /**
   * Refresh access token
   * @param request - Refresh token
   * @returns New access token and refresh token
   */
  async refreshToken(request: RefreshTokenRequest) {
    const response = await this.apiClient.post('/auth/refresh', request);
    return response.data;
  }

  /**
   * Get user profile
   * @param accessToken - JWT access token
   * @returns User profile data
   */
  async getProfile(accessToken: string): Promise<AuthUser> {
    const response = await this.apiClient.get('/auth/profile', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
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

  /**
   * Request password reset
   * @param email - User email
   */
  async forgotPassword(email: string) {
    const response = await this.apiClient.post('/auth/forgot-password', {
      email,
    });
    return response.data;
  }

  /**
   * Reset password with code
   * @param email - User email
   * @param code - Verification code
   * @param newPassword - New password
   */
  async resetPassword(email: string, code: string, newPassword: string) {
    const response = await this.apiClient.post('/auth/reset-password', {
      email,
      code,
      newPassword,
    });
    return response.data;
  }

  /**
   * Verify email with code
   * @param email - User email
   * @param code - Verification code
   */
  async verifyEmail(email: string, code: string) {
    const response = await this.apiClient.post('/auth/verify-email', {
      email,
      code,
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
