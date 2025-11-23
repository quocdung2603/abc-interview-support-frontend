import { AxiosInstance } from 'axios';
import { createRequestInstance } from './request.config.js';

interface Storage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

declare const sessionStorage: Storage | undefined;

export class NewsService {
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

  async getAllNews() {
    const response = await this.apiClient.get('/news');
    return response.data;
  }

  async getNewById(newsId: number) {
    const response = await this.apiClient.get(`/news/${newsId}`);
    return response.data;
  }

  async approveNews(newsId: number) {
    const token = this.getToken();
    if (!token) {
      throw new Error('No access token found');
    }
    const response = await this.apiClient.post(
      `/news/${newsId}/approve?adminId=1`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  }

  async rejectNews(newsId: number) {
    const token = this.getToken();
    if (!token) {
      throw new Error('No access token found');
    }
    const response = await this.apiClient.post(
      `/news/${newsId}/reject?adminId=1`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  }

  async publishNews(newsId: number) {
    const token = this.getToken();
    if (!token) {
      throw new Error('No access token found');
    }
    const response = await this.apiClient.post(`/news/${newsId}/publish`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  async voteNews(newsId: number, voteType: 'UPVOTE' | 'DOWNVOTE') {
    const res = await this.apiClient.post(
      `/news/${newsId}/vote?voteType=${voteType}`
    );
    return res.data;
  }
}

/**
 * @param baseURL - API base URL
 */
export const createNewsService = (baseURL?: string) => {
  return new NewsService(baseURL);
};

export const newsService = new NewsService();
