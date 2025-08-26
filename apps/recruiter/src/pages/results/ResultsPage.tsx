import React, { useState } from 'react';
import {
  Table,
  Card,
  Statistic,
  Button,
  Select,
  Input,
  Space,
  Tag,
  Progress,
  Avatar,
  Drawer,
  DatePicker,
  Row,
  Col,
} from 'antd';
import {
  DownloadOutlined,
  EyeOutlined,
  SearchOutlined,
  TrophyOutlined,
  StarOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

// Component definitions outside main component
const ScoreTag = ({ score }: { score: number }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'blue';
    if (score >= 40) return 'orange';
    return 'red';
  };

  return <Tag color={getScoreColor(score)}>{score}/100</Tag>;
};

const CandidateDetail = ({
  visible,
  onClose,
  candidate,
}: {
  visible: boolean;
  onClose: () => void;
  candidate: any;
}) => (
  <Drawer
    title="Chi tiết thí sinh"
    placement="right"
    onClose={onClose}
    open={visible}
    width={600}
  >
    {candidate && (
      <div className="candidate-detail-content">
        <div className="candidate-header">
          <Avatar size={64} style={{ backgroundColor: 'var(--color-primary)' }}>
            {candidate.name.charAt(0)}
          </Avatar>
          <div style={{ marginLeft: '16px' }}>
            <h3>{candidate.name}</h3>
            <p>{candidate.email}</p>
            <p>{candidate.phone}</p>
          </div>
        </div>

        <div className="exam-results" style={{ marginTop: '24px' }}>
          <h4>Kết quả thi</h4>
          <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
            <div>
              <strong>Điểm số:</strong> <ScoreTag score={candidate.score} />
            </div>
            <div>
              <strong>Thời gian làm bài:</strong> {candidate.duration} phút
            </div>
            <div>
              <strong>Số câu đúng:</strong> {candidate.correctAnswers}/
              {candidate.totalQuestions}
            </div>
            <div>
              <strong>Tỷ lệ chính xác:</strong> {candidate.accuracy}%
            </div>
            <div>
              <strong>Thời gian nộp bài:</strong>{' '}
              {new Date(candidate.submittedAt).toLocaleString('vi-VN')}
            </div>
          </div>
        </div>

        <div className="performance-breakdown" style={{ marginTop: '24px' }}>
          <h4>Phân tích kết quả</h4>
          <div className="topic-scores">
            {candidate.topicScores?.map((topic: any) => (
              <div key={topic.name} style={{ marginBottom: '12px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '4px',
                  }}
                >
                  <span>{topic.name}</span>
                  <span>{topic.score}%</span>
                </div>
                <Progress percent={topic.score} size="small" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )}
  </Drawer>
);

const ResultsPage: React.FC = () => {
  // State management
  const [selectedExam, setSelectedExam] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchText, setSearchText] = useState<string>('');
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  // Mock verification state - replace with actual auth context
  const isVerified = true;

  // Mock data
  const examOptions = [
    { id: 'all', title: 'Tất cả kỳ thi' },
    { id: '1', title: 'Frontend Developer Q1/2024' },
    { id: '2', title: 'Backend Developer' },
    { id: '3', title: 'Fullstack Developer' },
  ];

  const resultsData = [
    {
      id: '1',
      name: 'Nguyễn Văn An',
      email: 'an.nguyen@email.com',
      phone: '0901234567',
      examTitle: 'Frontend Developer Q1/2024',
      score: 85,
      rank: 1,
      duration: 75,
      correctAnswers: 21,
      totalQuestions: 25,
      accuracy: 84,
      submittedAt: '2024-01-20T14:30:00',
      status: 'passed',
      topicScores: [
        { name: 'JavaScript', score: 90 },
        { name: 'React', score: 85 },
        { name: 'HTML/CSS', score: 80 },
      ],
    },
    {
      id: '2',
      name: 'Trần Thị Bình',
      email: 'binh.tran@email.com',
      phone: '0901234568',
      examTitle: 'Frontend Developer Q1/2024',
      score: 78,
      rank: 2,
      duration: 85,
      correctAnswers: 19,
      totalQuestions: 25,
      accuracy: 76,
      submittedAt: '2024-01-20T15:45:00',
      status: 'passed',
      topicScores: [
        { name: 'JavaScript', score: 80 },
        { name: 'React', score: 75 },
        { name: 'HTML/CSS', score: 78 },
      ],
    },
    {
      id: '3',
      name: 'Lê Minh Cường',
      email: 'cuong.le@email.com',
      phone: '0901234569',
      examTitle: 'Frontend Developer Q1/2024',
      score: 65,
      rank: 3,
      duration: 90,
      correctAnswers: 16,
      totalQuestions: 25,
      accuracy: 64,
      submittedAt: '2024-01-20T16:20:00',
      status: 'passed',
      topicScores: [
        { name: 'JavaScript', score: 70 },
        { name: 'React', score: 60 },
        { name: 'HTML/CSS', score: 65 },
      ],
    },
    {
      id: '4',
      name: 'Phạm Thu Dung',
      email: 'dung.pham@email.com',
      phone: '0901234570',
      examTitle: 'Frontend Developer Q1/2024',
      score: 45,
      rank: 4,
      duration: 88,
      correctAnswers: 11,
      totalQuestions: 25,
      accuracy: 44,
      submittedAt: '2024-01-20T17:10:00',
      status: 'failed',
      topicScores: [
        { name: 'JavaScript', score: 50 },
        { name: 'React', score: 40 },
        { name: 'HTML/CSS', score: 45 },
      ],
    },
  ];

  // Statistics calculation
  const totalCandidates = resultsData.length;
  const passedCandidates = resultsData.filter(
    (r) => r.status === 'passed'
  ).length;
  const averageScore = Math.round(
    resultsData.reduce((sum, r) => sum + r.score, 0) / totalCandidates
  );
  const passRate = Math.round((passedCandidates / totalCandidates) * 100);

  // Filtered data
  const filteredData = resultsData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus =
      selectedStatus === 'all' || item.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Handler functions
  const handleViewCandidate = (candidate: any) => {
    setSelectedCandidate(candidate);
    setDetailVisible(true);
  };

  const handleExportData = () => {
    console.log('Exporting results data...');
  };

  // Table columns
  const columns = [
    {
      title: 'Xếp hạng',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      render: (rank: number) => (
        <div style={{ textAlign: 'center' }}>
          {rank === 1 && (
            <TrophyOutlined style={{ color: '#faad14', fontSize: '16px' }} />
          )}
          {rank === 2 && (
            <StarOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
          )}
          {rank === 3 && (
            <CheckCircleOutlined
              style={{ color: '#1890ff', fontSize: '16px' }}
            />
          )}
          {rank > 3 && <span style={{ fontWeight: 'bold' }}>#{rank}</span>}
        </div>
      ),
    },
    {
      title: 'Thí sinh',
      key: 'candidate',
      render: (record: any) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            {record.name}
          </div>
          <div
            style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}
          >
            {record.email}
          </div>
        </div>
      ),
    },
    {
      title: 'Kỳ thi',
      dataIndex: 'examTitle',
      key: 'examTitle',
    },
    {
      title: 'Điểm số',
      dataIndex: 'score',
      key: 'score',
      sorter: (a: any, b: any) => a.score - b.score,
      render: (score: number) => <ScoreTag score={score} />,
    },
    {
      title: 'Độ chính xác',
      key: 'accuracy',
      render: (record: any) => (
        <div>
          <div>
            {record.correctAnswers}/{record.totalQuestions}
          </div>
          <Progress percent={record.accuracy} size="small" />
        </div>
      ),
    },
    {
      title: 'Thời gian',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: number) => `${duration} phút`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'passed' ? 'green' : 'red'}>
          {status === 'passed' ? 'Đã qua' : 'Chưa đạt'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (record: any) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => handleViewCandidate(record)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  // Show not verified state
  if (!isVerified) {
    return (
      <div className="page-container">
        <div className="not-verified-state">
          <div className="illustration">📊</div>
          <h2>Cần xác thực doanh nghiệp</h2>
          <p>
            Bạn cần hoàn tất xác thực doanh nghiệp để xem kết quả thi và bảng
            xếp hạng.
          </p>
          <Button type="primary" href="/verification">
            Xác thực ngay
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1>Kết quả & Bảng xếp hạng</h1>
            <p>Theo dõi kết quả thi và xếp hạng thí sinh</p>
          </div>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExportData}
          >
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="page-content">
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng thí sinh"
                value={totalCandidates}
                prefix={<TrophyOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Đã qua"
                value={passedCandidates}
                valueStyle={{ color: '#3f8600' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Điểm trung bình"
                value={averageScore}
                suffix="/100"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tỷ lệ đậu"
                value={passRate}
                suffix="%"
                valueStyle={{ color: passRate >= 60 ? '#3f8600' : '#cf1322' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card style={{ marginBottom: '16px' }}>
          <Space wrap>
            <Select
              style={{ width: 200 }}
              placeholder="Chọn kỳ thi"
              value={selectedExam}
              onChange={setSelectedExam}
            >
              {examOptions.map((exam) => (
                <Option key={exam.id} value={exam.id}>
                  {exam.title}
                </Option>
              ))}
            </Select>

            <Select
              style={{ width: 150 }}
              placeholder="Trạng thái"
              value={selectedStatus}
              onChange={setSelectedStatus}
            >
              <Option value="all">Tất cả</Option>
              <Option value="passed">Đã qua</Option>
              <Option value="failed">Chưa đạt</Option>
            </Select>

            <Input
              placeholder="Tìm kiếm thí sinh..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
            />

            <RangePicker placeholder={['Từ ngày', 'Đến ngày']} />
          </Space>
        </Card>

        {/* Results Table */}
        <div className="content-card">
          {filteredData.length > 0 ? (
            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey="id"
              pagination={{
                total: filteredData.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} thí sinh`,
              }}
            />
          ) : (
            <div className="empty-state">
              <div className="illustration">📈</div>
              <h3>Chưa có kết quả thi nào</h3>
              <p>
                Kết quả thi sẽ hiển thị sau khi có thí sinh hoàn thành bài thi.
              </p>
            </div>
          )}
        </div>
      </div>

      <CandidateDetail
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
        candidate={selectedCandidate}
      />
    </div>
  );
};

export default ResultsPage;
