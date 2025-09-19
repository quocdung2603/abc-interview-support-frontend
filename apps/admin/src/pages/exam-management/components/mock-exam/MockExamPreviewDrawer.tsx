import React, { useState, useEffect } from 'react';
import { Drawer, Card, Tag, Typography, Tabs, Table } from 'antd';
import { Exam, Question } from '@abc-interview-support-frontend/types';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface PreviewDrawerProps {
  visible: boolean;
  onClose: () => void;
  data: Exam | null;
}

const MockExamPreviewDrawer: React.FC<PreviewDrawerProps> = ({
  visible,
  onClose,
  data,
}) => {
  console.log('MockExamPreviewDrawer render:', { visible, data });

  const [questions, setQuestions] = useState<Question[]>([]);

  // Mock data for questions in the exam
  useEffect(() => {
    if (data && visible) {
      const mockQuestions: Question[] = Array.from(
        { length: data.questionCount },
        (_, i) => ({
          questionId: `q${i + 1}`,
          userId: '1',
          topicId: '1',
          fieldId: '1',
          levelId: '1',
          status: 'Approved',
          questionTitle: `Câu hỏi ${i + 1}: ${
            [
              'React Hook useEffect được sử dụng để làm gì?',
              'RESTful API là gì?',
              'Docker container khác gì với Docker image?',
              'Algorithm nào có độ phức tạp O(n log n)?',
            ][i % 4]
          }`,
          questionVariant: '1',
          similarityScore: 0,
          usefulVote: Math.floor(Math.random() * 20),
          unusefulVote: Math.floor(Math.random() * 5),
          createdAt: new Date(),
        })
      );
      setQuestions(mockQuestions);
    }
  }, [data, visible]);

  const getExamTypeText = (examType: string) => {
    switch (examType) {
      case 'Virtual':
        return 'Bài kiểm tra ảo';
      case 'Recruiter':
        return 'Bài kiểm tra nhà tuyển dụng';
      default:
        return examType;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Active':
        return 'Đang hoạt động';
      case 'Inactive':
        return 'Không hoạt động';
      case 'Completed':
        return 'Đã hoàn thành';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'green';
      case 'Inactive':
        return 'orange';
      case 'Completed':
        return 'blue';
      default:
        return 'default';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours} giờ ${mins} phút`;
    }
    return `${mins} phút`;
  };

  const questionColumns = [
    {
      title: 'STT',
      key: 'index',
      render: (_: string, record: Question, index: number) => index + 1,
      width: 60,
    },
    {
      title: 'Nội dung câu hỏi',
      dataIndex: 'questionTitle',
      key: 'questionTitle',
      render: (title: string) => (
        <div
          style={{
            maxWidth: '400px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </div>
      ),
    },
    {
      title: 'Lượt vote',
      key: 'votes',
      render: (record: Question) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#52c41a', fontWeight: 'bold' }}>
            +{record.usefulVote}
          </div>
          <div style={{ color: '#ff4d4f', fontSize: '12px' }}>
            -{record.unusefulVote}
          </div>
        </div>
      ),
      width: 100,
    },
  ];

  return (
    <Drawer
      title="Chi tiết bài kiểm tra"
      width={900}
      open={visible}
      onClose={onClose}
      style={{ zIndex: 1000 }}
    >
      {data ? (
        <Tabs defaultActiveKey="1">
          <TabPane tab="Thông tin chung" key="1">
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {/* Header */}
              <div>
                <Title level={3} style={{ marginBottom: '8px' }}>
                  {data.title}
                </Title>
                <div
                  style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}
                >
                  <Tag color={data.examType === 'Virtual' ? 'blue' : 'purple'}>
                    {getExamTypeText(data.examType)}
                  </Tag>
                  <Tag color={getStatusColor(data.status)}>
                    {getStatusText(data.status)}
                  </Tag>
                </div>
              </div>

              {/* Basic Information */}
              <Card title="Thông tin cơ bản" size="small">
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div>
                    <Text strong>ID bài kiểm tra:</Text> {data.examId}
                  </div>
                  <div>
                    <Text strong>Loại bài kiểm tra:</Text>{' '}
                    <Tag
                      color={data.examType === 'Virtual' ? 'blue' : 'purple'}
                    >
                      {getExamTypeText(data.examType)}
                    </Tag>
                  </div>
                  {data.position && (
                    <div>
                      <Text strong>Vị trí:</Text> {data.position}
                    </div>
                  )}
                  <div>
                    <Text strong>Số câu hỏi:</Text> {data.questionCount}
                  </div>
                  <div>
                    <Text strong>Thời gian làm bài:</Text>{' '}
                    {formatDuration(data.duration)}
                  </div>
                  <div>
                    <Text strong>Ngôn ngữ:</Text> {data.language}
                  </div>
                  <div>
                    <Text strong>Trạng thái:</Text>{' '}
                    <Tag color={getStatusColor(data.status)}>
                      {getStatusText(data.status)}
                    </Tag>
                  </div>
                </div>
              </Card>

              {/* Schedule Information */}
              {(data.startTime || data.endTime) && (
                <Card title="Thời gian tổ chức" size="small">
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {data.startTime && (
                      <div>
                        <Text strong>Thời gian bắt đầu:</Text>{' '}
                        {new Date(data.startTime).toLocaleString('vi-VN')}
                      </div>
                    )}
                    {data.endTime && (
                      <div>
                        <Text strong>Thời gian kết thúc:</Text>{' '}
                        {new Date(data.endTime).toLocaleString('vi-VN')}
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Topics and Question Types */}
              <Card title="Cấu trúc đề thi" size="small">
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div>
                    <Text strong>Chủ đề:</Text>
                    <div style={{ marginTop: '8px' }}>
                      {data.topics ? (
                        <Text>{data.topics}</Text>
                      ) : (
                        <Text type="secondary">Chưa có thông tin</Text>
                      )}
                    </div>
                  </div>
                  <div>
                    <Text strong>Loại câu hỏi:</Text>
                    <div style={{ marginTop: '8px' }}>
                      {data.questionTypes ? (
                        <Text>{data.questionTypes}</Text>
                      ) : (
                        <Text type="secondary">Chưa có thông tin</Text>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Metadata */}
              <Card title="Thông tin khác" size="small">
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div>
                    <Text strong>Người tạo:</Text> {data.createdBy || 'N/A'}
                  </div>
                  <div>
                    <Text strong>Ngày tạo:</Text>{' '}
                    {data.createdAt
                      ? new Date(data.createdAt).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'N/A'}
                  </div>
                </div>
              </Card>
            </div>
          </TabPane>

          <TabPane tab={`Danh sách câu hỏi (${questions.length})`} key="2">
            <Card title="Danh sách câu hỏi trong bài kiểm tra" size="small">
              <Table
                columns={questionColumns}
                dataSource={questions}
                rowKey="questionId"
                pagination={{
                  total: questions.length,
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} của ${total} câu hỏi`,
                }}
                size="small"
              />
            </Card>
          </TabPane>
        </Tabs>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Text type="secondary">Không có dữ liệu bài kiểm tra</Text>
        </div>
      )}
    </Drawer>
  );
};

export default MockExamPreviewDrawer;
