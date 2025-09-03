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
  userId?: string;
  topicId: string;
  fieldId: string;
  levelId: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  rejectReason?:string;
  questionTitle: string; // tiêu đề câu hỏi
  questionVariant: string; // Chuỗi chứa danh sách questionVariant (VD: "1,2,3" hoặc JSON như {"ids": [1, 2, 3]})
  similarityScore?: number;
  usefulVote: number;
  unusefulVote: number;
  createdAt: Date;
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
