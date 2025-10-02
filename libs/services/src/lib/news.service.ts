import { AxiosInstance } from 'axios';
import { News } from '@abc-interview-support-frontend/types';
import { createRequestInstance } from './request.config';

/**
 * News Service
 * Handles all news and recruitment post related API calls
 */
export class NewsService {
  private readonly apiClient: AxiosInstance;

  constructor(baseURL: string) {
    this.apiClient = createRequestInstance(baseURL);
  }

  /**
   * Get all news
   * @param page - Page number
   * @param limit - Items per page
   * @param filters - Additional filters
   */
  async getAllNews(
    page = 1,
    limit = 10,
    filters?: {
      careerId?: number;
      type?: 'general' | 'recruitment';
      status?: 'draft' | 'published';
    }
  ) {
    const response = await this.apiClient.get('/api/news', {
      params: { page, limit, ...filters },
    });
    return response.data;
  }

  /**
   * Get news by ID
   * @param newsId - News ID
   */
  async getNewsById(newsId: number): Promise<News> {
    const response = await this.apiClient.get(`/api/news/${newsId}`);
    return response.data;
  }

  /**
   * Create a new news post
   * @param data - News data
   */
  async createNews(data: Partial<News>): Promise<News> {
    const response = await this.apiClient.post('/api/news', data);
    return response.data;
  }

  /**
   * Update news post
   * @param newsId - News ID
   * @param data - Updated news data
   */
  async updateNews(newsId: number, data: Partial<News>): Promise<News> {
    const response = await this.apiClient.put(`/api/news/${newsId}`, data);
    return response.data;
  }

  /**
   * Delete news post
   * @param newsId - News ID
   */
  async deleteNews(newsId: number) {
    const response = await this.apiClient.delete(`/api/news/${newsId}`);
    return response.data;
  }

  /**
   * Get news by author
   * @param authorId - Author ID
   */
  async getNewsByAuthor(authorId: string) {
    const response = await this.apiClient.get(`/api/news/author/${authorId}`);
    return response.data;
  }

  /**
   * Get news by career
   * @param careerId - Career ID
   */
  async getNewsByCareer(careerId: number) {
    const response = await this.apiClient.get(`/api/news/career/${careerId}`);
    return response.data;
  }

  /**
   * Search news
   * @param searchTerm - Search term
   * @param filters - Additional filters
   */
  async searchNews(
    searchTerm: string,
    filters?: {
      careerId?: number;
      type?: string;
    }
  ) {
    const response = await this.apiClient.get('/api/news/search', {
      params: { q: searchTerm, ...filters },
    });
    return response.data;
  }

  /**
   * Get featured news
   * @param limit - Number of featured news
   */
  async getFeaturedNews(limit = 5) {
    const response = await this.apiClient.get('/api/news/featured', {
      params: { limit },
    });
    return response.data;
  }

  /**
   * Publish news (change status from draft to published)
   * @param newsId - News ID
   */
  async publishNews(newsId: number) {
    const response = await this.apiClient.patch(`/api/news/${newsId}/publish`);
    return response.data;
  }

  /**
   * Unpublish news (change status to draft)
   * @param newsId - News ID
   */
  async unpublishNews(newsId: number) {
    const response = await this.apiClient.patch(
      `/api/news/${newsId}/unpublish`
    );
    return response.data;
  }

  /**
   * Increment view count
   * @param newsId - News ID
   */
  async incrementViewCount(newsId: number) {
    const response = await this.apiClient.post(`/api/news/${newsId}/view`);
    return response.data;
  }

  /**
   * Get news statistics
   * @param newsId - News ID
   */
  async getNewsStatistics(newsId: number) {
    const response = await this.apiClient.get(`/api/news/${newsId}/statistics`);
    return response.data;
  }
}

/**
 * Create an instance of NewsService
 * @param baseURL - API base URL
 */
export const createNewsService = (baseURL: string) => {
  return new NewsService(baseURL);
};
