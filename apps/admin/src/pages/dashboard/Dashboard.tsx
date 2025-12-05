import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Spin, message, Button } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { UserOutlined, FileTextOutlined, QuestionCircleOutlined, MessageOutlined, CheckCircleOutlined, ClockCircleOutlined, BarChartOutlined } from '@ant-design/icons';

interface DashboardStats {
  totalUsers: number;
  totalExams: number;
  totalQuestions: number;
  totalNews: number;
  totalPosts: number;
  pendingQuestions: number;
  pendingNews: number;
  pendingUsers: number;
  pendingExams: number;
}

interface ChartData {
  date: string;
  users: number;
  exams: number;
  questions: number;
  news: number;
  posts: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalExams: 0,
    totalQuestions: 0,
    totalNews: 0,
    totalPosts: 0,
    pendingQuestions: 0,
    pendingNews: 0,
    pendingUsers: 0,
    pendingExams: 0,
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Mock data - replace with actual API calls
        setStats({
          totalUsers: 1250,
          totalExams: 450,
          totalQuestions: 3200,
          totalNews: 180,
          totalPosts: 890,
          pendingQuestions: 45,
          pendingNews: 12,
          pendingUsers: 8,
          pendingExams: 3,
        });
        setChartData([
          { date: '2023-01', users: 100, exams: 20, questions: 150, news: 10, posts: 50 },
          { date: '2023-02', users: 200, exams: 35, questions: 300, news: 15, posts: 80 },
          { date: '2023-03', users: 350, exams: 50, questions: 450, news: 20, posts: 120 },
          { date: '2023-04', users: 500, exams: 70, questions: 600, news: 25, posts: 160 },
          { date: '2023-05', users: 750, exams: 90, questions: 800, news: 30, posts: 200 },
          { date: '2023-06', users: 1000, exams: 120, questions: 1000, news: 40, posts: 250 },
          { date: '2023-07', users: 1250, exams: 150, questions: 1200, news: 50, posts: 300 },
        ]);
      } catch (error) {
        console.error('Error fetching stats:', error);
        message.error('Không thể tải dữ liệu thống kê');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Quản Trị Viên</h1>
        <p className="text-gray-600">Tổng quan về hệ thống và hoạt động gần đây</p>
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
                <p className="text-sm font-medium text-gray-600 mb-1">Tổng Người Dùng</p>
                <p className="text-2xl font-bold text-primary">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <div className="icon-container-light">
                <UserOutlined className="text-xl text-primary" />
              </div>
            </div>
          </div>
          <div className="stats-card flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Tổng Bài Kiểm Tra</p>
                <p className="text-2xl font-bold text-accent">{stats.totalExams.toLocaleString()}</p>
              </div>
              <div className="icon-container-light">
                <FileTextOutlined className="text-xl text-accent" />
              </div>
            </div>
          </div>
          <div className="stats-card flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Tổng Câu Hỏi</p>
                <p className="text-2xl font-bold text-warning">{stats.totalQuestions.toLocaleString()}</p>
              </div>
              <div className="icon-container-light">
                <QuestionCircleOutlined className="text-xl text-warning" />
              </div>
            </div>
          </div>
          <div className="stats-card flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Tổng Tin Tức</p>
                <p className="text-2xl font-bold text-secondary">{stats.totalNews.toLocaleString()}</p>
              </div>
              <div className="icon-container-light">
                <FileTextOutlined className="text-xl text-secondary" />
              </div>
            </div>
          </div>
          <div className="stats-card flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Tổng Bài Đăng</p>
                <p className="text-2xl font-bold text-success">{stats.totalPosts.toLocaleString()}</p>
              </div>
              <div className="icon-container-light">
                <MessageOutlined className="text-xl text-success" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <ClockCircleOutlined className="text-2xl text-warning mr-3" />
          <h2 className="text-2xl font-semibold text-gray-800">Chờ Duyệt</h2>
        </div>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card className="stats-card border-l-4 border-l-warning">
              <Statistic
                title="Câu Hỏi Chờ Duyệt"
                value={stats.pendingQuestions}
                valueStyle={{ color: '#d97706' }}
                prefix={<QuestionCircleOutlined />}
              />
              <Button type="link" className="p-0 mt-2">Xem Chi Tiết</Button>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="stats-card border-l-4 border-l-accent">
              <Statistic
                title="Tin Tức Chờ Duyệt"
                value={stats.pendingNews}
                valueStyle={{ color: '#0ea5e9' }}
                prefix={<FileTextOutlined />}
              />
              <Button type="link" className="p-0 mt-2">Xem Chi Tiết</Button>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="stats-card border-l-4 border-l-primary">
              <Statistic
                title="Người Dùng Chờ Duyệt"
                value={stats.pendingUsers}
                valueStyle={{ color: '#1e40af' }}
                prefix={<UserOutlined />}
              />
              <Button type="link" className="p-0 mt-2">Xem Chi Tiết</Button>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="stats-card border-l-4 border-l-success">
              <Statistic
                title="Bài Kiểm Tra Chờ Duyệt"
                value={stats.pendingExams}
                valueStyle={{ color: '#059669' }}
                prefix={<CheckCircleOutlined />}
              />
              <Button type="link" className="p-0 mt-2">Xem Chi Tiết</Button>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Charts */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <BarChartOutlined className="text-2xl text-accent mr-3" />
          <h2 className="text-2xl font-semibold text-gray-800">Xu Hướng Hoạt Động</h2>
        </div>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Người Dùng Mới" className="shadow-md">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#1e40af" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Bài Kiểm Tra Được Tạo" className="shadow-md">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="exams" stroke="#0ea5e9" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Câu Hỏi Được Thêm" className="shadow-md">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="questions" stroke="#d97706" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Tin Tức Được Đăng" className="shadow-md">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="news" stroke="#64748b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center mb-6">
          <CheckCircleOutlined className="text-2xl text-success mr-3" />
          <h2 className="text-2xl font-semibold text-gray-800">Truy Cập Nhanh</h2>
        </div>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card className="card-interactive cursor-pointer hover:bg-gray-50">
              <div className="text-center">
                <UserOutlined className="text-3xl text-primary mb-2" />
                <h3 className="font-semibold text-gray-800">Quản Lý Người Dùng</h3>
                <p className="text-sm text-gray-600 mt-1">Xem và quản lý tài khoản</p>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="card-interactive cursor-pointer hover:bg-gray-50">
              <div className="text-center">
                <QuestionCircleOutlined className="text-3xl text-warning mb-2" />
                <h3 className="font-semibold text-gray-800">Quản Lý Câu Hỏi</h3>
                <p className="text-sm text-gray-600 mt-1">Duyệt và quản lý câu hỏi</p>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="card-interactive cursor-pointer hover:bg-gray-50">
              <div className="text-center">
                <FileTextOutlined className="text-3xl text-accent mb-2" />
                <h3 className="font-semibold text-gray-800">Quản Lý Bài Kiểm Tra</h3>
                <p className="text-sm text-gray-600 mt-1">Tạo và quản lý bài thi</p>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="card-interactive cursor-pointer hover:bg-gray-50">
              <div className="text-center">
                <MessageOutlined className="text-3xl text-success mb-2" />
                <h3 className="font-semibold text-gray-800">Quản Lý Cộng Đồng</h3>
                <p className="text-sm text-gray-600 mt-1">Giám sát bài đăng</p>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
