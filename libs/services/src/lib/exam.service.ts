import { AxiosInstance } from 'axios';
import { createRequestInstance } from './request.config.js';

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

  async createExam(examData: any) {
    const newExamData = {
      ...examData,
      language: 'Vietnamese',
    }
    console.log('Creating exam with data:', newExamData);
    const response = await this.apiClient.post('/exams', newExamData);
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
