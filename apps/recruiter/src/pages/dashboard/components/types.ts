export interface JobPost {
  id: string;
  title: string;
  position: string;
  location: string;
  deadline: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdAt: string;
  candidateCount: number;
}

export interface Exam {
  id: string;
  title: string;
  position: string;
  status: 'draft' | 'published' | 'closed';
  totalQuestions: number;
  duration: number;
  candidates: number;
  completedCandidates: number;
  createdAt: string;
  startTime: string;
  endTime: string;
}

export interface StatsData {
  totalJobs: number;
  activeJobs: number;
  totalCandidates: number;
  totalExams: number;
  activeExams: number;
  completedExams: number;
}

export interface ActivityData {
  date: string;
  jobPosts: number;
  candidates: number;
  exams: number;
}

export type TrendType = 'up' | 'down' | 'stable';
export type TimeRangeType = 'week' | 'month' | 'quarter';

export interface ActivitySummary {
  jobPosts: { value: number; trend: TrendType; change: number };
  candidates: { value: number; trend: TrendType; change: number };
  exams: { value: number; trend: TrendType; change: number };
}
