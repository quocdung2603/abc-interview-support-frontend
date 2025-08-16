// question-types.ts in libs/shared-utils/src/lib/types/question-types.ts

export interface Field {
  fieldId: string;
  fieldName: string;
  description?: string;
}

export interface Topic {
  topicId: string;
  fieldId: string;
  topicName: string;
  description?: string;
}

export interface Level {
  levelId: string;
  levelName: 'Fresher' | 'Junior' | 'Senior' | 'Middle';
  description?: string;
}

export interface QuestionType {
  questionTypeId: string;
  questionTypeName:
    | 'SingleChoice'
    | 'MultipleChoice'
    | 'FillInTheBlank'
    | 'OpenEnded'
    | 'Reference';
  description?: string;
}

export interface Question {
  questionId: string;
  userId: string;
  topicId: string;
  fieldId: string;
  levelId: string;
  questionTypeId: string;
  questionContent: string;
  questionAnswer?: string;
  similarityScore?: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  language: string;
  createdAt: Date;
  approvedAt?: Date;
  approvedBy?: string;
  usefulVote: number;
  unusefulVote: number;
}

export interface Answer {
  answerId: string;
  userId: string;
  questionId: string;
  questionTypeId: string;
  answerContent: string;
  isCorrect?: boolean;
  similarityScore?: number;
  usefulVote: number;
  unusefulVote: number;
  isSampleAnswer?: boolean;
  orderNumber?: number;
  createdAt: Date;
}
