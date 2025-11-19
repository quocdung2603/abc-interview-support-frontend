// question-types.ts in libs/shared-utils/src/lib/types/question-types.ts

export interface Field {
  id: number;
  fieldName: string;
  description?: string;
}

export interface Topic {
  id: number;
  fieldId: number;
  topicName: string;
  description?: string;
}

export interface Level {
  id: number;
  levelName: 'Fresher' | 'Junior' | 'Senior' | 'Middle';
  description?: string;
}

export interface QuestionType {
  id: number;
  questionTypeName: string;
  description?: string;
}

export interface Question {
  id: number;
  userId: number;
  topicId: number;
  fieldId: number;
  levelId: number;
  questionTypeId: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  questionContent: string;
  questionAnswer: string;
  language: string;
  similarityScore: number;
  usefulVote: number;
  unusefulVote: number;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: number;
  fieldName: string;
  levelName: string;
  topicName: string;
  questionTypeName: string;
}

export interface QuestionVariant {
  questionVariantId: number;
  questionTypeId: number;
  questionContent?: string; //chứa nội dung bổ sung của câu hỏi. Ví dụ: dạng FillInTheBlank cần 1 đoạn văn khuyết từ
  questionChoose?: string; //Chứa các lựa chọn cách nhau bởi dấu "|". Ví dụ: dạng SingleChoice, MultipleChoice cần
  questionAnswer: string; //Đáp án, nếu nhiều đáp án thì cách nhau bởi dấu "|"
}

export interface Answer {
  answerId: number;
  userId: number;
  questionId: number;
  questionVariantId: number;
  answerContent: string;
  isSampleAnswer?: boolean;
  isCorrect?: boolean;
  similarityScore?: number;
  usefulVote: number;
  unusefulVote: number;
  createdAt: Date;
}
