// news-types.ts in libs/shared-utils/src/lib/types/news-types.ts

export interface News {
  newsId: string;
  userId: string;
  newsType: 'trend' | 'recruitment';
  title: string;
  content: string;
  location?: string;
  fieldId?: string;
  topicId?: string;
  examId?: string;
  createdAt: Date;
  status: 'Pending' | 'Approve' | 'Reject';
  rejectReason?: string;
}
