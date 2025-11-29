import { AxiosInstance } from 'axios';
import { createRequestInstance } from './request.config.js';
import {
  CreateExamData,
  UpdateExamData,
} from '@abc-interview-support-frontend/types';

interface Storage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

declare const sessionStorage: Storage | undefined;

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

  private getToken(): string | null {
    // Check for tokens in order of priority: student, recruiter, admin
    return (
      sessionStorage?.getItem('student_accessToken') ||
      sessionStorage?.getItem('recruiter_accessToken') ||
      sessionStorage?.getItem('admin_accessToken') ||
      null
    );
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

  async removeQuestionFromExam(examId: string) {
    const response = await this.apiClient.delete(`/exams/${examId}/questions`);
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

  async publishExam(examId: string) {
    const response = await this.apiClient.post(
      `/exams/${examId}/publish?userId=1`
    );
    return response.data;
  }

  async startExam(examId: string) {
    const response = await this.apiClient.post(`/exams/${examId}/start`);
    return response.data;
  }

  async completeExam(examId: string) {
    const response = await this.apiClient.post(`/exams/${examId}/complete`);
    return response.data;
  }

  async getAllAnswer() {
    const response = await this.apiClient.get(`/exams/answers`, {
      params: {
        page: 0,
        size: 1000,
      },
    });
    return response.data;
  }

  async getRegistrationByExam(examId: string) {
    const response = await this.apiClient.get(
      `/exams/${examId}/registrations`,
      {
        params: {
          page: 0,
          size: 1000,
        },
      }
    );
    return response.data;
  }

  async getRegistrationByUser(userId: string) {
    const response = await this.apiClient.get(
      `/exams/registrations/user/${userId}`,
      {
        params: {
          page: 0,
          size: 1000,
        },
      }
    );
    return response.data;
  }

  async registerForExam(examId: string, userId: string) {
    const response = await this.apiClient.post(`/exams/registrations`, {
      examId: Number.parseInt(examId),
      userId: Number.parseInt(userId),
    });
    return response.data;
  }

  async CancelRegistration(examId: string) {
    const token = this.getToken();
    if (!token) {
      throw new Error('No authentication token found.');
    }
    const response = await this.apiClient.delete(
      `/exams/registrations/${examId}/cancel`,
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
 * @param baseURL - API base URL
 */
export const createExamService = (baseURL?: string) => {
  return new ExamService(baseURL);
};

export const examService = new ExamService();
