import { AxiosInstance } from 'axios';
import { createRequestInstance } from './request.config.js';

/**
 * User Service
 * Handles all user-related API calls
 */
export class CareerService {
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

  async getCareerById(Id: string) {
    const res = await this.apiClient.get(`/career/${Id}`);
    return res.data;
  }

  async getCareerByUserId(
    userId: number,
    page: number,
    size: number,
    sort: string
  ) {
    const res = await this.apiClient.get(`/career/preferences/${userId}`, {
      params: { page, size, sort },
    });
    return res.data;
  }

  async createCareerPreference(
    userId: number,
    fieldId: number,
    topicId?: number
  ) {
    const res = await this.apiClient.post('/career', {
      userId,
      fieldId,
      ...(topicId !== undefined && { topicId }),
    });
    return res.data;
  }

  async updateCareerPreference(
    Id: string,
    userId: number,
    fieldId: number,
    topicId?: number
  ) {
    const res = await this.apiClient.put(`/career/update/${Id}`, {
      userId,
      fieldId,
      ...(topicId !== undefined && { topicId }),
    });
    return res.data;
  }
}

/**
 * Create an instance of UserService
 * @param baseURL - API base URL
 */
export const createUserService = (baseURL?: string) => {
  return new CareerService(baseURL);
};

export const userService = new CareerService();
