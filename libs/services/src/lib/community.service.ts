import { AxiosInstance } from 'axios';
import { createRequestInstance } from './request.config.js';
import { Post } from '@abc-interview-support-frontend/types';

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
export class CommunityService {
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

  async getAllPost() {
    const response = await this.apiClient.get('/posts', {
      params: {
        page: 0,
        size: 1000,
      },
    });
    return response.data;
  }

  async getPostById(postId: number) {
    const response = await this.apiClient.get(`/posts/${postId}`);
    return response.data as Post;
  }

  async createPost(data: {
    userId: number;
    title: string;
    content: string;
    lockTime: string;
  }) {
    const token = this.getToken();
    const response = await this.apiClient.post('/posts', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
}

/**
 * Create an instance of UserService
 * @param baseURL - API base URL
 */
export const createCommunityService = (baseURL?: string) => {
  return new CommunityService(baseURL);
};

export const communityService = new CommunityService();