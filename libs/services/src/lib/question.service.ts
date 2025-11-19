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

  async getAllFields() {
    const response = await this.apiClient.get('/questions/fields');
    return response.data;
  }

  async getAllTopics() {
    const response = await this.apiClient.get('/questions/topics');
    return response.data;
  }

  async getAllLevels() {
    const response = await this.apiClient.get('/questions/levels');
    return response.data;
  }

  async getAllQuestionTypes() {
    const response = await this.apiClient.get('/questions/question-types');
    return response.data;
  }

  async getAllQuestions() {
    const response = await this.apiClient.get('/questions');
    return response.data;
  }

  async getQuestionById(questionId: number) {
    const response = await this.apiClient.get(`/questions/${questionId}`);
    return response.data;
  }
}

/**
 * @param baseURL - API base URL
 */
export const createQuestionService = (baseURL?: string) => {
  return new QuestionService(baseURL);
};

export const questionService = new QuestionService();
