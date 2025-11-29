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

  /*
  FIELD METHODS
*/
  async getAllFields() {
    const response = await this.apiClient.get('/questions/fields', {
      params: {
        page: 0,
        size: 100,
      },
    });
    return response.data;
  }

  async getFieldById(fieldId: number) {
    const response = await this.apiClient.get(`/questions/fields/${fieldId}`);
    return response.data;
  }

  async createField(fieldData: { name: string; description?: string }) {
    const token = this.getToken();
    if (!token) {
      throw new Error('No access token found');
    }
    const response = await this.apiClient.post('/questions/fields', fieldData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  async updateField(
    fieldId: number,
    fieldData: { name: string; description?: string }
  ) {
    const token = this.getToken();
    if (!token) {
      throw new Error('No access token found');
    }
    const response = await this.apiClient.put(
      `/questions/fields/${fieldId}`,
      fieldData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  async deleteField(fieldId: number) {
    const token = this.getToken();
    if (!token) {
      throw new Error('No access token found');
    }
    const response = await this.apiClient.delete(
      `/questions/fields/${fieldId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /*
  TOPIC METHODS
*/
  async getAllTopics() {
    const response = await this.apiClient.get('/questions/topics', {
      params: {
        page: 0,
        size: 100,
      },
    });
    return response.data;
  }

  async getTopicById(topicId: number) {
    const response = await this.apiClient.get(`/questions/topics/${topicId}`);
    return response.data;
  }

  async createTopic(topicData: {
    name: string;
    description?: string;
    fieldId: number;
  }) {
    const token = this.getToken();
    if (!token) {
      throw new Error('No access token found');
    }
    const response = await this.apiClient.post('/questions/topics', topicData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  async updateTopic(
    topicId: number,
    topicData: { name: string; description?: string; fieldId: number }
  ) {
    const token = this.getToken();
    if (!token) {
      throw new Error('No access token found');
    }
    const response = await this.apiClient.put(
      `/questions/topics/${topicId}`,
      topicData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  }

  async deleteTopic(topicId: number) {
    const token = this.getToken();
    if (!token) {
      throw new Error('No access token found');
    }
    const response = await this.apiClient.delete(
      `/questions/topics/${topicId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  }

  /*
  LEVEL METHODS
*/
  async getAllLevels() {
    const response = await this.apiClient.get('/questions/levels', {
      params: {
        page: 0,
        size: 100,
      },
    });
    return response.data;
  }

  async getLevelById(levelId: number) {
    const response = await this.apiClient.get(`/questions/levels/${levelId}`);
    return response.data;
  }

  async createLevel(levelData: { name: string; description?: string }) {
    const token = this.getToken();
    if (!token) {
      throw new Error('No access token found');
    }
    const response = await this.apiClient.post('/questions/levels', levelData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  async updateLevel(
    levelId: number,
    levelData: { name: string; description?: string }
  ) {
    const token = this.getToken();
    if (!token) {
      throw new Error('No access token found');
    }
    const response = await this.apiClient.put(
      `/questions/levels/${levelId}`,
      levelData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  async deleteLevel(levelId: number) {
    const token = this.getToken();
    if (!token) {
      throw new Error('No access token found');
    }
    const response = await this.apiClient.delete(
      `/questions/levels/${levelId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /*
  QUESTION TYPE METHODS
*/

  async getAllQuestionTypes() {
    const response = await this.apiClient.get('/questions/question-types', {
      params: {
        page: 0,
        size: 100,
      },
    });
    return response.data;
  }

  async getQuestionTypeById(questionTypeId: number) {
    const response = await this.apiClient.get(
      `/questions/question-types/${questionTypeId}`
    );
    return response.data;
  }

  async createQuestionType(questionTypeData: {
    name: string;
    description?: string;
  }) {
    const token = this.getToken();
    if (!token) {
      throw new Error('No access token found');
    }
    const response = await this.apiClient.post(
      '/questions/question-types',
      questionTypeData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  }

  async updateQuestionType(
    questionTypeId: number,
    questionTypeData: { name: string; description?: string }
  ) {
    const token = this.getToken();
    if (!token) {
      throw new Error('No access token found');
    }
    const response = await this.apiClient.put(
      `/questions/question-types/${questionTypeId}`,
      questionTypeData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  }

  async deleteQuestionType(questionTypeId: number) {
    const token = this.getToken();
    if (!token) {
      throw new Error('No access token found');
    }
    const response = await this.apiClient.delete(
      `/questions/question-types/${questionTypeId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  }

  /*
  QUESTION METHODS
*/

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

  /*
  ANSWER METHODS
*/
  async getAnswerByQuestion(questionId: number) {
    const response = await this.apiClient.get(
      `/questions/${questionId}/answers`,
      {
        params: {
          page: 0,
          size: 100,
        },
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
