export interface Post {
  id: number;
  userId: number;
  title: string;
  content: string;
  lockTime: string | null;
  createdAt: string;
  updatedAt: string;
}
