import React from 'react';
import { Drawer, Tag, Tabs, Table, Avatar } from 'antd';
import { EyeOutlined, UserOutlined } from '@ant-design/icons';
import { Exam } from '@abc-interview-support-frontend/types';

interface ExamFormPreviewProps {
  visible: boolean;
  onClose: () => void;
  exam: Exam | null;
}

const ExamFormPreview: React.FC<ExamFormPreviewProps> = ({
  visible,
  onClose,
  exam,
}) => {
  // Mock data cho danh sách câu hỏi
  const mockQuestions = [
    {
      id: 1,
      title: 'Câu hỏi về JavaScript cơ bản',
      type: 'Multiple Choice',
      difficulty: 'Dễ',
      points: 1,
    },
    {
      id: 2,
      title: 'Câu hỏi về React Hooks',
      type: 'Multiple Choice',
      difficulty: 'Trung bình',
      points: 1,
    },
    {
      id: 3,
      title: 'Câu hỏi về Database Design',
      type: 'Essay',
      difficulty: 'Khó',
      points: 2,
    },
  ];

  // Mock data cho danh sách thí sinh
  const mockCandidates = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      status: 'Hoàn thành',
      score: 85,
    },
    {
      id: 2,
      name: 'Trần Thị B',
      email: 'tranthib@example.com',
      status: 'Đang làm',
      score: null,
    },
    {
      id: 3,
      name: 'Lê Văn C',
      email: 'levanc@example.com',
      status: 'Chưa bắt đầu',
      score: null,
    },
  ];

  const questionColumns = [
    {
      title: 'STT',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Câu hỏi',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Độ khó',
      dataIndex: 'difficulty',
      key: 'difficulty',
    },
    {
      title: 'Điểm',
      dataIndex: 'points',
      key: 'points',
      width: 80,
    },
  ];

  const candidateColumns = [
    {
      title: 'STT',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Tên thí sinh',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusColors = {
          'Hoàn thành': 'green',
          'Đang làm': 'blue',
          'Chưa bắt đầu': 'default',
        };
        return <Tag color={statusColors[status as keyof typeof statusColors]}>{status}</Tag>;
      },
    },
    {
      title: 'Điểm số',
      dataIndex: 'score',
      key: 'score',
      render: (score: number | null) => score ? `${score}/100` : '-',
    },
  ];

  const tabItems = [
    {
      key: 'info',
      label: 'Thông tin bài kiểm tra',
      children: exam ? (
        <div className="exam-detail-content">
          <div className="detail-section">
            <h3>{exam.title}</h3>
            <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
              <div>
                <strong>Vị trí:</strong> {exam.position}
              </div>
              <div>
                <strong>Thời lượng:</strong> {exam.duration} phút
              </div>
              <div>
                <strong>Số câu hỏi:</strong> {exam.questionCount}
              </div>
              <div>
                <strong>Chủ đề:</strong>{' '}
                {exam.topics.map((topicId: number) => {
                  const topicMap: Record<number, string> = {
                    1: 'JavaScript',
                    2: 'React',
                    3: 'Node.js',
                    4: 'Database',
                    5: 'Algorithms',
                  };
                  return <Tag key={topicId}>{topicMap[topicId] || `Topic ${topicId}`}</Tag>;
                })}
              </div>
              <div>
                <strong>Ngày tạo:</strong>{' '}
                {new Date(exam.createdAt).toLocaleDateString('vi-VN')}
              </div>
            </div>
          </div>

          {exam.status === 'ACTIVE' && (
            <div
              className="stats-card"
              style={{ background: 'var(--color-success)', color: 'white', padding: '16px', borderRadius: '8px', marginTop: '16px' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>156</div>
                  <div>Thí sinh đã tham gia</div>
                </div>
                <EyeOutlined style={{ fontSize: '24px' }} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>Không có dữ liệu</div>
      ),
    },
    {
      key: 'questions',
      label: 'Danh sách câu hỏi',
      children: (
        <div>
          <Table
            columns={questionColumns}
            dataSource={mockQuestions}
            rowKey="id"
            pagination={false}
            size="small"
          />
        </div>
      ),
    },
    {
      key: 'candidates',
      label: 'Danh sách thí sinh',
      children: (
        <div>
          <Table
            columns={candidateColumns}
            dataSource={mockCandidates}
            rowKey="id"
            pagination={false}
            size="small"
          />
        </div>
      ),
    },
  ];

  return (
    <Drawer
      title="Chi tiết kỳ thi"
      placement="right"
      onClose={onClose}
      open={visible}
      width={900}
    >
      {exam && <Tabs defaultActiveKey="info" items={tabItems} />}
    </Drawer>
  );
};

export default ExamFormPreview;
