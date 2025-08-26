import { useEffect, useState } from 'react';
import { message } from 'antd';
import {
  StatsCards,
  RecentJobs,
  RecentExams,
  ActivityChart,
} from './components';
import type {
  StatsData,
  JobPost,
  Exam,
  ActivityData,
} from './components/types';

type TrendType = 'up' | 'down' | 'stable';
type TimeRangeType = 'week' | 'month' | 'quarter';

interface ActivitySummary {
  jobPosts: { value: number; trend: TrendType; change: number };
  candidates: { value: number; trend: TrendType; change: number };
  exams: { value: number; trend: TrendType; change: number };
}

const Dashboard: React.FC = () => {
  const [statsData, setStatsData] = useState<StatsData>({
    totalJobs: 0,
    activeJobs: 0,
    totalCandidates: 0,
    totalExams: 0,
    activeExams: 0,
    completedExams: 0,
  });
  const [recentJobs, setRecentJobs] = useState<JobPost[]>([]);
  const [recentExams, setRecentExams] = useState<Exam[]>([]);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [activitySummary, setActivitySummary] = useState<ActivitySummary>({
    jobPosts: { value: 0, trend: 'stable', change: 0 },
    candidates: { value: 0, trend: 'stable', change: 0 },
    exams: { value: 0, trend: 'stable', change: 0 },
  });
  const [timeRange, setTimeRange] = useState<TimeRangeType>('week');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Mock data - replace with actual API calls
      const mockStatsData: StatsData = {
        totalJobs: 24,
        activeJobs: 18,
        totalCandidates: 156,
        totalExams: 12,
        activeExams: 1,
        completedExams: 1,
      };

      const mockRecentJobs: JobPost[] = [
        {
          id: '1',
          title: 'Senior Frontend Developer',
          position: 'Frontend Developer',
          location: 'Hồ Chí Minh',
          deadline: '2024-02-15',
          status: 'approved',
          createdAt: '2024-01-20',
          candidateCount: 25,
        },
        {
          id: '2',
          title: 'Backend Developer - Java Spring',
          position: 'Backend Developer',
          location: 'Hà Nội',
          deadline: '2024-02-20',
          status: 'pending',
          createdAt: '2024-01-18',
          candidateCount: 18,
        },
        {
          id: '3',
          title: 'DevOps Engineer',
          position: 'DevOps Engineer',
          location: 'Đà Nẵng',
          deadline: '2024-02-25',
          status: 'draft',
          createdAt: '2024-01-15',
          candidateCount: 8,
        },
      ];

      const mockRecentExams: Exam[] = [
        {
          id: '1',
          title: 'Frontend Developer Assessment',
          position: 'Frontend Developer',
          status: 'draft',
          totalQuestions: 30,
          duration: 90,
          candidates: 45,
          completedCandidates: 32,
          createdAt: '2024-01-10',
          startTime: '2024-01-15T09:00:00Z',
          endTime: '2024-02-15T17:00:00Z',
        },
        {
          id: '2',
          title: 'Java Backend Skills Test',
          position: 'Backend Developer',
          status: 'published',
          totalQuestions: 25,
          duration: 120,
          candidates: 38,
          completedCandidates: 28,
          createdAt: '2024-01-08',
          startTime: '2024-01-12T08:00:00Z',
          endTime: '2024-02-12T18:00:00Z',
        },
        {
          id: '3',
          title: 'System Design Interview',
          position: 'Senior Developer',
          status: 'draft',
          totalQuestions: 15,
          duration: 180,
          candidates: 12,
          completedCandidates: 5,
          createdAt: '2024-01-05',
          startTime: '2024-01-20T10:00:00Z',
          endTime: '2024-02-20T16:00:00Z',
        },
      ];

      const mockActivityData: ActivityData[] = [
        { date: '2024-01-01', jobPosts: 5, candidates: 12, exams: 2 },
        { date: '2024-01-02', jobPosts: 3, candidates: 8, exams: 1 },
        { date: '2024-01-03', jobPosts: 7, candidates: 15, exams: 3 },
        { date: '2024-01-04', jobPosts: 4, candidates: 10, exams: 1 },
        { date: '2024-01-05', jobPosts: 6, candidates: 18, exams: 2 },
        { date: '2024-01-06', jobPosts: 8, candidates: 22, exams: 4 },
        { date: '2024-01-07', jobPosts: 2, candidates: 6, exams: 1 },
      ];

      const mockActivitySummary: ActivitySummary = {
        jobPosts: { value: 35, trend: 'up', change: 12.5 },
        candidates: { value: 101, trend: 'up', change: 8.3 },
        exams: { value: 14, trend: 'down', change: 2.1 },
      };

      setStatsData(mockStatsData);
      setRecentJobs(mockRecentJobs);
      setRecentExams(mockRecentExams);
      setActivityData(mockActivityData);
      setActivitySummary(mockActivitySummary);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      message.error('Không thể tải dữ liệu dashboard');
    }
  };

  const handleViewJob = (jobId: string) => {
    console.log('View job:', jobId);
    // Navigate to job detail page
  };

  const handleEditJob = (jobId: string) => {
    console.log('Edit job:', jobId);
    // Navigate to job edit page
  };

  const handleViewExam = (examId: string) => {
    console.log('View exam:', examId);
    // Navigate to exam detail page
  };

  const handleEditExam = (examId: string) => {
    console.log('Edit exam:', examId);
    // Navigate to exam edit page
  };

  const handleTimeRangeChange = (range: TimeRangeType) => {
    setTimeRange(range);
    // Reload data for new time range
    loadDashboardData();
  };

  return (
    <div className="container-center flex flex-col space-y-10 animate-fade-in-up ">
      <div>
        <StatsCards data={statsData} />
      </div>
      <div>
        <ActivityChart
          data={activityData}
          summary={activitySummary}
          timeRange={timeRange}
          onTimeRangeChange={handleTimeRangeChange}
        />
      </div>
      <div className="flex flex-row justify-center space-x-5">
        <div className="w-1/2">
          <RecentJobs
            jobs={recentJobs}
            onViewJob={handleViewJob}
            onEditJob={handleEditJob}
          />
        </div>
        <div className="w-1/2">
          <RecentExams
            exams={recentExams}
            onViewExam={handleViewExam}
            onEditExam={handleEditExam}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
