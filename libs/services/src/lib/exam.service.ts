import { AxiosInstance } from 'axios';
import { createRequestInstance } from './request.config.js';
import {
  CreateExamData,
  UpdateExamData,
} from '@abc-interview-support-frontend/types';

export class ExamService {
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

  async getAllExams() {
    const response = await this.apiClient.get('/exams');
    return response.data;
  }

  async getExamById(examId: string) {
    const response = await this.apiClient.get(`/exams/${examId}`);
    return response.data;
  }

  async createExam(examData: CreateExamData) {
    const newExamData = {
      ...examData,
      language: 'Vietnamese',
    };
    console.log('Creating exam with data:', newExamData);
    const response = await this.apiClient.post('/exams', newExamData);
    return response.data;
  }

  async createExamWithRandomQuestions(examData: CreateExamData) {
    const newExamData = {
      ...examData,
      language: 'Vietnamese',
    };
    const response = await this.apiClient.post(
      '/exams/with-random-questions',
      newExamData
    );
    return response.data;
  }

  async updateExam(examId: string, examData: UpdateExamData) {
    const newExamData = {
      ...examData,
      language: 'Vietnamese',
    };
    const response = await this.apiClient.put(`/exams/${examId}`, newExamData);
    return response.data;
  }

  async deleteExam(examId: string) {
    const response = await this.apiClient.delete(`/exams/${examId}`);
    return response.data;
  }

  async addQuestionToExam(
    examId: string,
    questionId: number,
    orderNumber: number
  ) {
    const response = await this.apiClient.post(`/exams/questions`, {
      examId: Number.parseInt(examId),
      questionId,
      orderNumber,
    });
    return response.data;
  }

  async getExamResultByUserId(userId: string) {
    const response = await this.apiClient.get(`/exams/results/user/${userId}`, {
      params: {
        page: 0,
        size: 1000,
      },
    });
    return response.data;
  }
}

/**
 * @param baseURL - API base URL
 */
export const createExamService = (baseURL?: string) => {
  return new ExamService(baseURL);
};

export const examService = new ExamService();
