// news-types.ts in libs/shared-utils/src/lib/types/news-types.ts

export interface BaseNews {
  id: number;
  userId: number;
  title: string;
  content: string;
  fieldId?: number;
  newsType: 'NEWS' | 'RECRUITMENT';
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PUBLISHED';
  createdAt: string | Date;
  approvedBy?: number;
  usefulVote?: number;
  interestVote?: number;
  rejectReason?: string;
  publishedAt?: string | Date;
  expiredAt?: string | Date;
}

export interface News extends BaseNews {
  newsType: 'NEWS';
}

export interface RecruitmentNews extends BaseNews {
  newsType: 'RECRUITMENT';
  examId?: number;
  companyName?: string;
  location?: string;
  salary?: string;
  experience?: string;
  position?: string;
  workingHours?: string;
  deadline?: string;
  applicationMethod?: string;
}

// Union type for all news types
export type NewsItem = News | RecruitmentNews;
