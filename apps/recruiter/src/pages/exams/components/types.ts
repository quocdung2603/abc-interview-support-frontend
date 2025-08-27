export interface Examss {
  id: string;
  title: string;
  position: string;
  status: 'published' | 'draft';
  description?: string;
  totalQuestions: number;
  duration: number;
  candidates: number;
  topics: string[];
  createdAt: string;
  startTime: string;
  endTime: string;
  examPeriod?: [string, string]; // [startDate, endDate] for RangePicker
  difficulty?: {
    easy: boolean;
    medium: boolean;
    hard: boolean;
  };
}
