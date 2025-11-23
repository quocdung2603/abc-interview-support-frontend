// news-types.ts in libs/shared-utils/src/lib/types/news-types.ts

export interface News {
  id: number;
  userId: number;
  newsType: 'NEWS' | 'RECRUITMENT';
  title: string;
  content: string;
  location?: string;
  fieldId?: number;
  examId?: number;
  createdAt: string | Date;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PUBLISHED';
  rejectReason?: string;
  publishedAt?: string | Date;
  approvedBy?: number;
  usefulVote?: number;
  interestVote?: number;
}
