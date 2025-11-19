import { AxiosInstance } from 'axios';
import { createRequestInstance } from './request.config.js';
import { User } from '@abc-interview-support-frontend/types';

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

  private getToken(): string | null {
    // Check for tokens in order of priority: student, recruiter, admin
    return (
      sessionStorage?.getItem('student_accessToken') ||
      sessionStorage?.getItem('recruiter_accessToken') ||
      sessionStorage?.getItem('admin_accessToken') ||
      null
    );
  }

  async getAllUsers() {
    const admin_token = sessionStorage?.getItem('admin_accessToken');
    const response = await this.apiClient.get('/users', {
      headers: admin_token ? { Authorization: `Bearer ${admin_token}` } : {},
    });
    return response.data;
  }

  async updateUser(userId: string, userData: User) {
    const token = this.getToken();
    if (!token) {
      throw new Error('No access token found');
    }
    console.log('Updating user with data:', userData);
    const response = await this.apiClient.put(`/users/${userId}`, userData, {
      headers: { Authorization: `Bearer ${token}` },
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
