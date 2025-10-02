import { AxiosInstance } from 'axios';
import { Question } from '@abc-interview-support-frontend/types';
import { createRequestInstance } from './request.config';

/**
 * Question Service
 * Handles all question-related API calls
 */
export class QuestionService {
  private readonly apiClient: AxiosInstance;

  constructor(baseURL: string) {
    this.apiClient = createRequestInstance(baseURL);
  }

  /**
   * Get all questions
   * @param page - Page number
   * @param limit - Items per page
   * @param filters - Additional filters
   */
  async getAllQuestions(
    page = 1,
    limit = 10,
    filters?: {
      careerId?: number;
      type?: 'multiple-choice' | 'essay' | 'code';
      level?: string;
    }
  ) {
    const response = await this.apiClient.get('/api/questions', {
      params: { page, limit, ...filters },
    });
    return response.data;
  }

  /**
   * Get question by ID
   * @param questionId - Question ID
   */
  async getQuestionById(questionId: number): Promise<Question> {
    const response = await this.apiClient.get(`/api/questions/${questionId}`);
    return response.data;
  }

  /**
   * Create a new question
   * @param data - Question data
   */
  async createQuestion(data: Partial<Question>): Promise<Question> {
    const response = await this.apiClient.post('/api/questions', data);
    return response.data;
  }

  /**
   * Update question
   * @param questionId - Question ID
   * @param data - Updated question data
   */
  async updateQuestion(
    questionId: number,
    data: Partial<Question>
  ): Promise<Question> {
    const response = await this.apiClient.put(
      `/api/questions/${questionId}`,
      data
    );
    return response.data;
  }

  /**
   * Delete question
   * @param questionId - Question ID
   */
  async deleteQuestion(questionId: number) {
    const response = await this.apiClient.delete(
      `/api/questions/${questionId}`
    );
    return response.data;
  }

  /**
   * Get questions by career
   * @param careerId - Career ID
   */
  async getQuestionsByCareer(careerId: number) {
    const response = await this.apiClient.get(
      `/api/questions/career/${careerId}`
    );
    return response.data;
  }

  /**
   * Get random questions for practice
   * @param careerId - Career ID
   * @param count - Number of questions
   * @param level - Difficulty level (optional)
   */
  async getRandomQuestions(careerId: number, count = 10, level?: string) {
    const response = await this.apiClient.get('/api/questions/random', {
      params: { careerId, count, level },
    });
    return response.data;
  }

  /**
   * Search questions
   * @param searchTerm - Search term
   * @param filters - Additional filters
   */
  async searchQuestions(
    searchTerm: string,
    filters?: {
      careerId?: number;
      type?: string;
      level?: string;
    }
  ) {
    const response = await this.apiClient.get('/api/questions/search', {
      params: { q: searchTerm, ...filters },
    });
    return response.data;
  }

  /**
   * Bulk import questions
   * @param questions - Array of questions
   */
  async bulkImportQuestions(questions: Partial<Question>[]) {
    const response = await this.apiClient.post('/api/questions/bulk', {
      questions,
    });
    return response.data;
  }

  /**
   * Get question statistics
   * @param questionId - Question ID
   */
  async getQuestionStatistics(questionId: number) {
    const response = await this.apiClient.get(
      `/api/questions/${questionId}/statistics`
    );
    return response.data;
  }
}

/**
 * Create an instance of QuestionService
 * @param baseURL - API base URL
 */
export const createQuestionService = (baseURL: string) => {
  return new QuestionService(baseURL);
};
