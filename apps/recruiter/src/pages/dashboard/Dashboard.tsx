import React, { useEffect, useState } from 'react';
import { message, Button, Card, Row, Col, Statistic, Spin } from 'antd';
import {
  FileTextOutlined,
  UserOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons';
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
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="container-center animate-fade-in-up p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard nhà tuyển dụng</h1>
        <p className="text-gray-600">Tổng quan về hoạt động tuyển dụng và quản lý kì thi</p>
      </div>

      {/* Overview Stats */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <BarChartOutlined className="text-2xl text-primary mr-3" />
          <h2 className="text-2xl font-semibold text-gray-800">Thống Kê Tổng Quan</h2>
        </div>
        <div className="flex flex-wrap gap-6">
          <div className="stats-card flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Tin tuyển dụng</p>
                <p className="text-2xl font-bold text-primary">{statsData.totalJobs}</p>
                <p className="text-xs text-gray-500">{statsData.activeJobs} đang hoạt động</p>
              </div>
              <div className="icon-container-light">
                <FileTextOutlined className="text-xl text-primary" />
              </div>
            </div>
          </div>
          <div className="stats-card flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Ứng viên</p>
                <p className="text-2xl font-bold text-accent">{statsData.totalCandidates}</p>
                <p className="text-xs text-gray-500">Tổng số ứng viên</p>
              </div>
              <div className="icon-container-light">
                <UserOutlined className="text-xl text-accent" />
              </div>
            </div>
          </div>
          <div className="stats-card flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Kỳ thi</p>
                <p className="text-2xl font-bold text-warning">{statsData.totalExams}</p>
                <p className="text-xs text-gray-500">{statsData.activeExams} đang diễn ra</p>
              </div>
              <div className="icon-container-light">
                <TrophyOutlined className="text-xl text-warning" />
              </div>
            </div>
          </div>
          <div className="stats-card flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Tỷ lệ hoàn thành</p>
                <p className="text-2xl font-bold text-success">
                  {statsData.totalExams > 0 ? Math.round((statsData.completedExams / statsData.totalExams) * 100) : 0}%
                </p>
                <p className="text-xs text-gray-500">Kỳ thi đã hoàn thành</p>
              </div>
              <div className="icon-container-light">
                <ClockCircleOutlined className="text-xl text-success" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <BarChartOutlined className="text-2xl text-accent mr-3" />
          <h2 className="text-2xl font-semibold text-gray-800">Hoạt Động Gần Đây</h2>
        </div>
        <ActivityChart
          data={activityData}
          summary={activitySummary}
          timeRange={timeRange}
          onTimeRangeChange={handleTimeRangeChange}
        />
      </div>

      {/* Recent Items */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <CheckCircleOutlined className="text-2xl text-success mr-3" />
          <h2 className="text-2xl font-semibold text-gray-800">Quản Lý Gần Đây</h2>
        </div>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card
              title="Tin tuyển dụng gần đây"
              className="card-elevated"
              extra={
                <Button type="link" onClick={() => console.log('View all jobs')}>
                  Xem tất cả
                </Button>
              }
            >
              <div className="space-y-4">
                {recentJobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 mb-1">{job.title}</h4>
                      <p className="text-sm text-gray-600">{job.location} • {job.candidateCount} ứng viên</p>
                      <p className="text-xs text-gray-500">Hạn: {new Date(job.deadline).toLocaleDateString('vi-VN')}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewJob(job.id)}
                        size="small"
                      />
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEditJob(job.id)}
                        size="small"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card
              title="Kỳ thi gần đây"
              className="card-elevated"
              extra={
                <Button type="link" onClick={() => console.log('View all exams')}>
                  Xem tất cả
                </Button>
              }
            >
              <div className="space-y-4">
                {recentExams.slice(0, 3).map((exam) => (
                  <div key={exam.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 mb-1">{exam.title}</h4>
                      <p className="text-sm text-gray-600">{exam.position} • {exam.candidates} thí sinh</p>
                      <p className="text-xs text-gray-500">{exam.duration} phút • {exam.totalQuestions} câu hỏi</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewExam(exam.id)}
                        size="small"
                      />
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEditExam(exam.id)}
                        size="small"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center mb-6">
          <PlusOutlined className="text-2xl text-primary mr-3" />
          <h2 className="text-2xl font-semibold text-gray-800">Truy Cập Nhanh</h2>
        </div>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card className="card-interactive cursor-pointer hover:bg-gray-50">
              <div className="text-center">
                <FileTextOutlined className="text-3xl text-primary mb-2" />
                <h3 className="font-semibold text-gray-800">Quản Lý Tin Tuyển Dụng</h3>
                <p className="text-sm text-gray-600 mt-1">Tạo và quản lý tin tuyển dụng</p>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="card-interactive cursor-pointer hover:bg-gray-50">
              <div className="text-center">
                <TrophyOutlined className="text-3xl text-warning mb-2" />
                <h3 className="font-semibold text-gray-800">Quản Lý Kỳ Thi</h3>
                <p className="text-sm text-gray-600 mt-1">Tạo và quản lý bài thi</p>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="card-interactive cursor-pointer hover:bg-gray-50">
              <div className="text-center">
                <UserOutlined className="text-3xl text-accent mb-2" />
                <h3 className="font-semibold text-gray-800">Quản Lý Ứng Viên</h3>
                <p className="text-sm text-gray-600 mt-1">Xem và đánh giá ứng viên</p>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="card-interactive cursor-pointer hover:bg-gray-50">
              <div className="text-center">
                <BarChartOutlined className="text-3xl text-success mb-2" />
                <h3 className="font-semibold text-gray-800">Báo Cáo & Thống Kê</h3>
                <p className="text-sm text-gray-600 mt-1">Xem báo cáo chi tiết</p>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
