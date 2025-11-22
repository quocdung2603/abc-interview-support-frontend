import React, { useState, useEffect } from 'react';
import { Drawer, Tag, Tabs, Table, message } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { Exam, QuestionType } from '@abc-interview-support-frontend/types';
import { examService } from '@abc-interview-support-frontend/services';

// Interface for exam detail with questions
interface ExamDetail extends Exam {
  questions: Array<{
    id: number;
    field: string;
    topics: string[];
    level: string;
    questionType: string;
    questionText: string;
    questionAnswer: string;
  }>;
}

interface ExamFormPreviewProps {
  visible: boolean;
  onClose: () => void;
  exam: Exam | null;
  questionTypes: QuestionType[];
}

const ExamFormPreview: React.FC<ExamFormPreviewProps> = ({
  visible,
  onClose,
  exam,
  questionTypes,
}) => {
  const [examDetail, setExamDetail] = useState<ExamDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExamDetail = async () => {
      if (exam && visible) {
        setLoading(true);
        try {
          const response = await examService.getExamById(exam.id.toString());
          console.log('API Response:', response);
          console.log('Questions in response:', response.questions);
          setExamDetail(response);
        } catch (error) {
          console.error('Error fetching exam detail:', error);
          message.error('Không thể tải chi tiết bài kiểm tra');
          setExamDetail(null);
        } finally {
          setLoading(false);
        }
      } else if (!visible) {
        // Reset exam detail when drawer is closed
        setExamDetail(null);
      }
    };

    fetchExamDetail();
  }, [exam, visible]);
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
      dataIndex: 'questionText',
      key: 'questionText',
      render: (text: string) => (
        <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Lĩnh vực',
      dataIndex: 'field',
      key: 'field',
    },
    {
      title: 'Chủ đề',
      dataIndex: 'topics',
      key: 'topics',
      render: (topics: string[]) => (
        <div>
          {topics.map((topic) => (
            <Tag key={topic} color="blue" style={{ marginBottom: '2px' }}>
              {topic}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Mức độ',
      dataIndex: 'level',
      key: 'level',
    },
    {
      title: 'Loại',
      dataIndex: 'questionType',
      key: 'questionType',
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
      children: examDetail ? (
        <div className="exam-detail-content">
          <div className="detail-section">
            <h3>{examDetail.title}</h3>
            <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
              <div>
                <strong>Vị trí:</strong> {examDetail.position}
              </div>
              <div>
                <strong>Thời lượng:</strong> {examDetail.duration} phút
              </div>
              <div>
                <strong>Số câu hỏi:</strong> {examDetail.questionCount}
              </div>
              <div>
                <strong>Chủ đề:</strong>{' '}
                {examDetail.questions && examDetail.questions.length > 0 ? (
                  <div>
                    {Array.from(new Set(examDetail.questions.flatMap(q => q.topics))).map((topic) => (
                      <Tag key={topic} color="blue">
                        {topic}
                      </Tag>
                    ))}
                  </div>
                ) : (
                  'Chưa có chủ đề'
                )}
              </div>
              <div>
                <strong>Loại câu hỏi:</strong>{' '}
                {examDetail.questions && examDetail.questions.length > 0 ? (
                  <div>
                    {Array.from(new Set(examDetail.questions.map(q => q.questionType))).map((type) => {
                      const questionType = questionTypes.find(qt => qt.id.toString() === type);
                      return (
                        <Tag key={type} color="green">
                          {questionType ? questionType.name : type}
                        </Tag>
                      );
                    })}
                  </div>
                ) : (
                  'Chưa có loại câu hỏi'
                )}
              </div>
              <div>
                <strong>Ngày tạo:</strong>{' '}
                {new Date(examDetail.createdAt).toLocaleDateString('vi-VN')}
              </div>
            </div>
          </div>

          {examDetail.status === 'ACTIVE' && (
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
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    {examDetail.questions ? examDetail.questions.length : 0}
                  </div>
                  <div>Câu hỏi trong bài thi</div>
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
            dataSource={examDetail?.questions || []}
            rowKey={(record, index) => `${record.id}-${index}`}
            pagination={false}
            size="small"
            loading={loading}
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
