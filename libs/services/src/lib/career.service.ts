import { AxiosInstance } from 'axios';
import {
  Career,
  CareerPreference,
} from '@abc-interview-support-frontend/types';
import { createRequestInstance } from './request.config';

/**
 * Career Service
 * Handles all career and career preference related API calls
 */
export class CareerService {
  private readonly apiClient: AxiosInstance;

  constructor(baseURL: string) {
    this.apiClient = createRequestInstance(baseURL);
  }

  /**
   * Get all careers
   */
  async getAllCareers(): Promise<Career[]> {
    const response = await this.apiClient.get('/api/careers');
    return response.data;
  }

  /**
   * Get career by ID
   * @param careerId - Career ID
   */
  async getCareerById(careerId: number): Promise<Career> {
    const response = await this.apiClient.get(`/api/careers/${careerId}`);
    return response.data;
  }

  /**
   * Create a new career (admin only)
   * @param data - Career data
   */
  async createCareer(data: Partial<Career>): Promise<Career> {
    const response = await this.apiClient.post('/api/careers', data);
    return response.data;
  }

  /**
   * Update career (admin only)
   * @param careerId - Career ID
   * @param data - Updated career data
   */
  async updateCareer(careerId: number, data: Partial<Career>): Promise<Career> {
    const response = await this.apiClient.put(`/api/careers/${careerId}`, data);
    return response.data;
  }

  /**
   * Delete career (admin only)
   * @param careerId - Career ID
   */
  async deleteCareer(careerId: number) {
    const response = await this.apiClient.delete(`/api/careers/${careerId}`);
    return response.data;
  }

  /**
   * Get user's career preferences
   * @param userId - User ID
   */
  async getCareerPreferences(userId: string): Promise<CareerPreference[]> {
    const response = await this.apiClient.get(
      `/api/users/${userId}/career-preferences`
    );
    return response.data;
  }

  /**
   * Add career preference
   * @param userId - User ID
   * @param careerId - Career ID
   */
  async addCareerPreference(userId: string, careerId: number) {
    const response = await this.apiClient.post(
      `/api/users/${userId}/career-preferences`,
      {
        careerId,
      }
    );
    return response.data;
  }

  /**
   * Remove career preference
   * @param userId - User ID
   * @param careerId - Career ID
   */
  async removeCareerPreference(userId: string, careerId: number) {
    const response = await this.apiClient.delete(
      `/api/users/${userId}/career-preferences/${careerId}`
    );
    return response.data;
  }

  /**
   * Update multiple career preferences at once
   * @param userId - User ID
   * @param careerIds - Array of career IDs
   */
  async updateCareerPreferences(userId: string, careerIds: number[]) {
    const response = await this.apiClient.put(
      `/api/users/${userId}/career-preferences`,
      {
        careerIds,
      }
    );
    return response.data;
  }

  /**
   * Get career statistics
   * @param careerId - Career ID
   */
  async getCareerStatistics(careerId: number) {
    const response = await this.apiClient.get(
      `/api/careers/${careerId}/statistics`
    );
    return response.data;
  }

  /**
   * Search careers
   * @param searchTerm - Search term
   */
  async searchCareers(searchTerm: string): Promise<Career[]> {
    const response = await this.apiClient.get('/api/careers/search', {
      params: { q: searchTerm },
    });
    return response.data;
  }
}

/**
 * Create an instance of CareerService
 * @param baseURL - API base URL
 */
export const createCareerService = (baseURL: string) => {
  return new CareerService(baseURL);
};
