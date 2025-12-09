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
    topicId: number;
    levelId: number;
    fieldId: number;
    postType: 'DISCUSSION' | 'QUESTION';
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

  async createDiscussionPost(
    userId: number,
    data: {
      fieldId: number;
      topicId: number;
      levelId: number;
      postType: 'DISCUSSION' | 'QUESTION';
      title: string;
      content: string;
      lockTime: null;
    }
  ) {
    const token = this.getToken();
    if (!token) {
      throw new Error('Unauthorized: No token found');
    }

    const response = await this.apiClient.post('/posts', data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-User-Id': userId.toString(),
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }

  async getPostComments(postId: number) {
    const token = this.getToken();
    if (!token) {
      throw new Error('Unauthorized: No token found');
    }
    const response = await this.apiClient.get(`/comments/post/${postId}`, {
      params: {
        page: 0,
        size: 1000,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  async createPostComment(data: {
    postId: number;
    userId: number;
    content: string;
  }) {
    const token = this.getToken();
    const response = await this.apiClient.post('/comments', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  async voteComments(
    commentId: number,
    data: {
      userId: number;
      voteType: 'USEFUL' | 'NOT_USEFUL';
    }
  ) {
    const token = this.getToken();
    if (!token) {
      throw new Error('Unauthorized: No token found');
    }
    const response = await this.apiClient.post(
      `/comments/${commentId}/vote`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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
