import { AxiosInstance } from 'axios';
import { Exam, ExamQuestion } from '@abc-interview-support-frontend/types';
import { createRequestInstance } from './request.config';

/**
 * Exam Service
 * Handles all exam-related API calls
 */
export class ExamService {
  private readonly apiClient: AxiosInstance;

  constructor(baseURL: string) {
    this.apiClient = createRequestInstance(baseURL);
  }

  /**
   * Get all exams
   * @param page - Page number
   * @param limit - Items per page
   * @param filters - Additional filters
   */
  async getAllExams(
    page = 1,
    limit = 10,
    filters?: {
      careerId?: number;
      level?: string;
      isPublic?: boolean;
    }
  ) {
    const response = await this.apiClient.get('/api/exams', {
      params: { page, limit, ...filters },
    });
    return response.data;
  }

  /**
   * Get exam by ID
   * @param examId - Exam ID
   */
  async getExamById(examId: number): Promise<Exam> {
    const response = await this.apiClient.get(`/api/exams/${examId}`);
    return response.data;
  }

  /**
   * Create a new exam
   * @param data - Exam data
   */
  async createExam(data: Partial<Exam>): Promise<Exam> {
    const response = await this.apiClient.post('/api/exams', data);
    return response.data;
  }

  /**
   * Update exam
   * @param examId - Exam ID
   * @param data - Updated exam data
   */
  async updateExam(examId: number, data: Partial<Exam>): Promise<Exam> {
    const response = await this.apiClient.put(`/api/exams/${examId}`, data);
    return response.data;
  }

  /**
   * Delete exam
   * @param examId - Exam ID
   */
  async deleteExam(examId: number) {
    const response = await this.apiClient.delete(`/api/exams/${examId}`);
    return response.data;
  }

  /**
   * Get exam questions
   * @param examId - Exam ID
   */
  async getExamQuestions(examId: number): Promise<ExamQuestion[]> {
    const response = await this.apiClient.get(`/api/exams/${examId}/questions`);
    return response.data;
  }

  /**
   * Add question to exam
   * @param examId - Exam ID
   * @param questionId - Question ID
   * @param orderNumber - Order in exam
   */
  async addQuestionToExam(
    examId: number,
    questionId: number,
    orderNumber: number
  ) {
    const response = await this.apiClient.post(
      `/api/exams/${examId}/questions`,
      {
        questionId,
        orderNumber,
      }
    );
    return response.data;
  }

  /**
   * Remove question from exam
   * @param examId - Exam ID
   * @param questionId - Question ID
   */
  async removeQuestionFromExam(examId: number, questionId: number) {
    const response = await this.apiClient.delete(
      `/api/exams/${examId}/questions/${questionId}`
    );
    return response.data;
  }

  /**
   * Reorder exam questions
   * @param examId - Exam ID
   * @param questionOrders - Array of {questionId, orderNumber}
   */
  async reorderExamQuestions(
    examId: number,
    questionOrders: Array<{ questionId: number; orderNumber: number }>
  ) {
    const response = await this.apiClient.put(
      `/api/exams/${examId}/questions/reorder`,
      {
        questionOrders,
      }
    );
    return response.data;
  }

  /**
   * Get exams by recruiter
   * @param recruiterId - Recruiter ID
   */
  async getExamsByRecruiter(recruiterId: string) {
    const response = await this.apiClient.get(
      `/api/exams/recruiter/${recruiterId}`
    );
    return response.data;
  }

  /**
   * Publish/Unpublish exam
   * @param examId - Exam ID
   * @param isPublic - Whether to make public
   */
  async updateExamVisibility(examId: number, isPublic: boolean) {
    const response = await this.apiClient.patch(
      `/api/exams/${examId}/visibility`,
      {
        isPublic,
      }
    );
    return response.data;
  }
}

/**
 * Create an instance of ExamService
 * @param baseURL - API base URL
 */
export const createExamService = (baseURL: string) => {
  return new ExamService(baseURL);
};
