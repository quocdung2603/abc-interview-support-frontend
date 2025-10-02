import { AxiosInstance } from 'axios';
import {
  User,
  RecruiterVerification,
} from '@abc-interview-support-frontend/types';
import { createRequestInstance } from './request.config';

/**
 * User Service
 * Handles all user-related API calls
 */
export class UserService {
  private readonly apiClient: AxiosInstance;

  constructor(baseURL: string) {
    this.apiClient = createRequestInstance(baseURL);
  }

  /**
   * Get user by ID
   * @param userId - User ID
   */
  async getUserById(userId: string): Promise<User> {
    const response = await this.apiClient.get(`/api/users/${userId}`);
    return response.data;
  }

  /**
   * Update user profile
   * @param userId - User ID
   * @param data - Updated user data
   */
  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    const response = await this.apiClient.put(`/api/users/${userId}`, data);
    return response.data;
  }

  /**
   * Get all users (admin only)
   * @param page - Page number
   * @param limit - Items per page
   */
  async getAllUsers(page = 1, limit = 10) {
    const response = await this.apiClient.get('/api/users', {
      params: { page, limit },
    });
    return response.data;
  }

  /**
   * Delete user (admin only)
   * @param userId - User ID
   */
  async deleteUser(userId: string) {
    const response = await this.apiClient.delete(`/api/users/${userId}`);
    return response.data;
  }

  /**
   * Get user ELO history
   * @param userId - User ID
   */
  async getEloHistory(userId: string) {
    const response = await this.apiClient.get(
      `/api/users/${userId}/elo-history`
    );
    return response.data;
  }

  /**
   * Submit recruiter verification
   * @param data - Verification data
   */
  async submitRecruiterVerification(data: Partial<RecruiterVerification>) {
    const response = await this.apiClient.post(
      '/api/users/recruiter-verification',
      data
    );
    return response.data;
  }

  /**
   * Get recruiter verification status
   * @param userId - User ID
   */
  async getRecruiterVerification(
    userId: string
  ): Promise<RecruiterVerification> {
    const response = await this.apiClient.get(
      `/api/users/${userId}/recruiter-verification`
    );
    return response.data;
  }

  /**
   * Update recruiter verification (admin only)
   * @param verificationId - Verification ID
   * @param data - Updated verification data
   */
  async updateRecruiterVerification(
    verificationId: number,
    data: Partial<RecruiterVerification>
  ) {
    const response = await this.apiClient.put(
      `/api/users/recruiter-verification/${verificationId}`,
      data
    );
    return response.data;
  }
}

/**
 * Create an instance of UserService
 * @param baseURL - API base URL
 */
export const createUserService = (baseURL: string) => {
  return new UserService(baseURL);
};
