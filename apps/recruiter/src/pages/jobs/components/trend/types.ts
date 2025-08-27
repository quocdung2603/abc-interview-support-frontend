export interface TrendNews {
  id: string;
  title: string;
  summary?: string;
  content: string;
  category: 'technology' | 'career' | 'interview' | 'skills' | 'industry';
  tags?: string[];
  featuredImage?: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  status: 'published' | 'draft' | 'pending' | 'archived';
  viewCount?: number;
  likeCount?: number;
  isFeature?: boolean;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}
