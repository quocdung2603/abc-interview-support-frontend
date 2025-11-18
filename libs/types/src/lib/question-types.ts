// question-types.ts in libs/shared-utils/src/lib/types/question-types.ts

export interface Field {
  id: string;
  fieldName: string;
  description?: string;
}

export interface Topic {
  id: string;
  fieldId: string;
  topicName: string;
  description?: string;
}

export interface Level {
  id: string;
  levelName: 'Fresher' | 'Junior' | 'Senior' | 'Middle';
  description?: string;
}

export interface QuestionType {
  id: string;
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
  questionVariantId: string;
  questionTypeId: string;
  questionContent?: string; //chứa nội dung bổ sung của câu hỏi. Ví dụ: dạng FillInTheBlank cần 1 đoạn văn khuyết từ
  questionChoose?: string; //Chứa các lựa chọn cách nhau bởi dấu "|". Ví dụ: dạng SingleChoice, MultipleChoice cần
  questionAnswer: string; //Đáp án, nếu nhiều đáp án thì cách nhau bởi dấu "|"
}

export interface Answer {
  answerId: string;
  userId: string;
  questionId: string;
  questionVariantId: string;
  answerContent: string;
  isCorrect?: boolean;
  similarityScore?: number;
  usefulVote: number;
  unusefulVote: number;
  createdAt: Date;
}
