// news-types.ts in libs/shared-utils/src/lib/types/news-types.ts

export interface News {
  newsId: string;
  userId: string;
  newsType: 'trend' | 'recruitment';
  title: string;
  content: string;
  fieldId?: string;
  examId?: string;
  createdAt: Date;
}
