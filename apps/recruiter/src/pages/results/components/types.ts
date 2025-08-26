export interface TopicScore {
  name: string;
  score: number;
}

export interface ResultsData {
  id: string;
  name: string;
  email: string;
  phone: string;
  examTitle: string;
  score: number;
  rank: number;
  duration: number;
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
  submittedAt: string;
  status: 'passed' | 'failed';
  topicScores?: TopicScore[];
}

export interface ExamOption {
  id: string;
  title: string;
}

export interface StatisticsData {
  totalCandidates: number;
  passedCandidates: number;
  averageScore: number;
  passRate: number;
}

export interface FiltersData {
  selectedExam: string;
  selectedStatus: string;
  searchText: string;
  dateRange?: [string, string];
}
