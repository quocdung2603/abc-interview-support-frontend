// question-types.ts in libs/shared-utils/src/lib/types/question-types.ts

export interface Field {
  id: number;
  name: string;
  description?: string;
}

export interface Topic {
  id: number;
  fieldId: number;
  fieldName: string;
  name: string;
  description?: string;
}

export interface Level {
  id: number;
  name: string;
  description?: string;
}

export interface QuestionType {
  id: number;
  name: string;
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
  id: number; // Changed from answerId to id
  userId: number;
  questionId: number;
  questionTypeId: number; // Added
  answerContent: string;
  isSampleAnswer?: boolean;
  isCorrect?: boolean;
  similarityScore?: number;
  usefulVote: number;
  unusefulVote: number;
  orderNumber: number; // Added
  createdAt: string; // Changed from Date to string
}

// Interface riêng cho dữ liệu từ getExamById (exam questions)
export interface QuestionInExam extends Omit<Question, 'questionContent'> {
  questionText: string; // Thay thế questionContent bằng questionText
}
