// exam-types.ts in libs/shared-utils/src/lib/types/exam-types.ts

export interface Exam {
  id: number;
  userId: number;
  examType: 'VIRTUAL' | 'RECRUITER';
  title: string;
  position: string;
  topics: number[]; // Array of topic IDs
  questionTypes: number[]; // Array of question type IDs
  questionCount: number;
  duration: number;
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'COMPLETED';
  language: string;
  createdAt: string;
  createdBy: number;
}

export interface ExamQuestion {
  examQuestionId: string;
  examId: string;
  questionId: string;
  orderNumber: number;
}

export interface Result {
  resultId: string;
  examId: string;
  userId: string;
  score: number;
  passStatus: boolean;
  feedback?: string;
  completedAt: Date;
}

export interface UserAnswer {
  userAnswerId: string;
  examId: string;
  questionId: string;
  userId: string;
  answerContent: string;
  isCorrect?: boolean;
  similarityScore?: number;
  createdAt: Date;
}

export interface ExamRegistration {
  registrationId: string;
  examId: string;
  userId: string;
  registrationStatus: 'Pending' | 'Approved' | 'Rejected';
  registeredAt: Date;
}

export interface CreateExamData {
  examType: string;
  title: string;
  position: string;
  topics: number[];
  questionTypes: number[];
  questionCount: number;
  duration: number;
  userId: number;
}

export interface UpdateExamData {
  userId: number;
  examType: string;
  title: string;
  position: string;
  topics: number[];
  questionTypes: number[];
  questionCount: number;
  duration: number;
  language: string;
}
