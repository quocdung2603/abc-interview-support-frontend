import { AxiosInstance } from 'axios';
import { createRequestInstance } from './request.config.js';

interface Storage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

declare const sessionStorage: Storage | undefined;

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

  private getToken(): string | null {
    // Check for tokens in order of priority: student, recruiter, admin
    return (
      sessionStorage?.getItem('student_accessToken') ||
      sessionStorage?.getItem('recruiter_accessToken') ||
      sessionStorage?.getItem('admin_accessToken') ||
      null
    );
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
    const response = await this.apiClient.get('/questions', {
      params: {
        page: 0,
        size: 100,
      },
    });
    return response.data;
  }

  async getQuestionById(questionId: number) {
    const response = await this.apiClient.get(`/questions/${questionId}`);
    return response.data;
  }

  async createQuestion(questionData: any) {
    const token = this.getToken();
    if (!token) {
      throw new Error('No access token found');
    }
    console.log('access Token: ', token);
    console.log('Creating question with data:', questionData);
    const response = await this.apiClient.post('/questions', questionData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  async updateQuestion(questionId: number, questionData: any) {
    const token = this.getToken();
    if (!token) {
      throw new Error('No access token found');
    }
    console.log('Updating question with data:', questionData);
    const response = await this.apiClient.put(
      `/questions/${questionId}`,
      questionData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }

  async deleteQuestion(questionId: number) {
    const token = this.getToken();
    if (!token) {
      throw new Error('No access token found');
    }
    const response = await this.apiClient.delete(`/questions/${questionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  async approveQuestion(questionId: number) {
    const token = this.getToken();
    if (!token) {
      throw new Error('No access token found');
    }
    console.log('token: ', token);
    const response = await this.apiClient.post(
      `/questions/${questionId}/approve?adminId=1`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  }

  async rejectQuestion(questionId: number) {
    const token = this.getToken();
    if (!token) {
      throw new Error('No access token found');
    }
    console.log('token: ', token);
    const response = await this.apiClient.post(
      `/questions/${questionId}/reject?adminId=1`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
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
