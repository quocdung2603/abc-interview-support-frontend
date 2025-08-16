// exam-types.ts in libs/shared-utils/src/lib/types/exam-types.ts

export interface Exam {
  examId: string;
  userId?: string;
  examType: 'Virtual' | 'Recruiter';
  title: string;
  position?: string;
  topics: string; // JSON string
  questionTypes: string; // JSON string
  questionCount: number;
  duration: number;
  startTime?: Date;
  endTime?: Date;
  status: 'Active' | 'Inactive' | 'Completed';
  language: string;
  createdAt: Date;
  createdBy: string;
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
