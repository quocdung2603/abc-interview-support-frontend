import { AxiosInstance } from 'axios';
import { createRequestInstance } from './request.config.js';

export class QuestionService {
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
}

/**
 * @param baseURL - API base URL
 */
export const createQuestionService = (baseURL?: string) => {
  return new QuestionService(baseURL);
};

export const questionService = new QuestionService();
