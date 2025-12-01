export interface Post {
  id: number;
  userId: number;
  fieldId: number;
  topicId: number;
  levelId?: number;
  postType: 'DISCUSSION' | 'QUESTION';
  status: 'DRAFT' | 'PUBLISHED' | 'LOCKED';
  title: string;
  content: string;
  lockTime: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DiscussionAnswer {
  id: number;
  postId: number;
  userId: number;
  content: string;
  upVotes: number;
  downVotes: number;
  createdAt: string;
  updatedAt: string;
}
