// exam-types.ts in libs/shared-utils/src/lib/types/exam-types.ts

export interface Exam {
  id: number;
  userId: number;
  examType: 'VIRTUAL' | 'RECRUITER' | 'PRACTICE';
  title: string;
  position: string;
  fieldId: number;
  levelId: number;
  topicIds: number[]; // Array of topic IDs
  questionTypeIds: number[]; // Array of question type IDs
  questionCount: number;
  duration: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ONGOING' | 'COMPLETED';
  language: string;
  createdAt: string;
  createdBy: number;
  questions?: ExamQuestion[];
}

export interface ExamQuestion {
  id: string;
  fieldId: number;
  topicId: number;
  levelId: number;
  questionTypeId: number;
  questionText: string;
  questionAnswer: string;
}

export interface ExamResult {
  id: number;
  examId: number;
  userId: number;
  score: number;
  passStatus: boolean;
  feedback?: string;
  completedAt: string;
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
  fieldId: number;
  levelId: number;
  topicIds: number[];
  questionTypeIds: number[];
  questionCount: number;
  duration: number;
  userId: number;
}

export interface UpdateExamData {
  userId: number;
  examType: string;
  title: string;
  position: string;
  fieldId: number;
  topicId: number;
  levelId: number;
  topics: number[];
  questionTypes: number[];
  questionCount: number;
  duration: number;
  language: string;
}

// export interface CreateExamWithRandomQuestion {}
