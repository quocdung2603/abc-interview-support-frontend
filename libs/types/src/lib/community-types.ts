export interface Post {
  id: number;
  userId: number;
  fieldId: number;
  topicId: number;
  levelId: number;
  fieldName: string;
  topicName: string;
  levelName: string;
  postType: 'DISCUSSION' | 'QUESTION';
  status: 'DRAFT' | 'PUBLISHED' | 'LOCKED';
  title: string;
  content: string;
  lockTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiscussionAnswer {
  id: number;
  postId: number;
  userId: number;
  content: string;
  voteCount: number;
  weightedVoteScore: number;
  votePercentage: number;
  editCount: number;
  createdAt: string;
  updatedAt: string | null;
  userVoteStatus?: 'USEFUL' | 'NOT_USEFUL' | null; // Track if current user has voted
}
