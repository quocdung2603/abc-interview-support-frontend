import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Card,
  Tag,
  Typography,
  Tabs,
  Table,
  Select,
  Input,
  Button,
  Space,
  message,
} from 'antd';
import { Exam, Field, Topic, Level, QuestionType, Question } from '@abc-interview-support-frontend/types';
import QuestionListDrawer from '../question-list/QuestionListDrawer';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

interface ExamApprovalFormDrawerProps {
  visible: boolean;
  onClose: () => void;
  data: Exam | null;
  onApprove: (examId: number) => void;
  onReject: (examId: number, reason: string) => void;
  fields: Field[];
  topics: Topic[];
  levels: Level[];
  questionTypes: QuestionType[];
}

const ExamApprovalFormDrawer: React.FC<ExamApprovalFormDrawerProps> = ({
  visible,
  onClose,
  data,
  onApprove,
  onReject,
  fields,
  topics,
  levels,
  questionTypes,
}) => {
  const [approvalStatus, setApprovalStatus] = useState<'Approved' | 'Rejected'>(
    'Approved'
  );
  const [rejectReason, setRejectReason] = useState<string>('');
  const [questionListDrawerVisible, setQuestionListDrawerVisible] = useState(false);
  const [selectedQuestionForComparison, setSelectedQuestionForComparison] = useState<Question | null>(null);

  // Load questions data
  useEffect(() => {
    if (data && visible) {
      // TODO: Load questions from API using data.questions or fetch by exam ID
      // For now, show questions from exam.questions if available
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
      render: (_: string, record: any, index: number) => index + 1,
      width: 60,
    },
    {
      title: 'Nội dung câu hỏi',
      dataIndex: 'questionText',
      key: 'questionText',
      render: (text: string) => (
        <div
          style={{
            maxWidth: '400px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: 'Đáp án',
      dataIndex: 'questionAnswer',
      key: 'questionAnswer',
      render: (answer: string) => (
        <div
          style={{
            maxWidth: '200px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {answer}
        </div>
      ),
    },
  ];

  const handleCompareQuestions = (question1: Question, question2: Question) => {
    // TODO: Implement question comparison logic
    message.info(`So sánh câu hỏi ${question1.id} với ${question2.id}`);
    setQuestionListDrawerVisible(false);
  };

  const handleOpenQuestionComparison = () => {
    setQuestionListDrawerVisible(true);
  };

  const handleSubmitApproval = () => {
    if (!data) return;

    if (approvalStatus === 'Approved') {
      onApprove(data.id);
      message.success('Đã chấp nhận bài kiểm tra thành công!');
    } else {
      if (!rejectReason.trim()) {
        message.error('Vui lòng nhập lý do từ chối!');
        return;
      }
      onReject(data.id, rejectReason);
      message.success('Đã từ chối bài kiểm tra thành công!');
    }
    onClose();
  };

  return (
    <>
      <Drawer
        title="Chi tiết bài kiểm tra cần duyệt"
        width={900}
        open={visible}
        onClose={onClose}
        style={{ zIndex: 1000 }}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={onClose}>Hủy</Button>
              <Button type="primary" onClick={handleSubmitApproval}>
                Xác nhận
              </Button>
            </Space>
          </div>
        }
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
                    <Tag color={data.examType === 'VIRTUAL' ? 'blue' : 'purple'}>
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
                      <Text strong>ID bài kiểm tra:</Text> {data.id}
                    </div>
                    <div>
                      <Text strong>Loại bài kiểm tra:</Text>{' '}
                      <Tag
                        color={data.examType === 'VIRTUAL' ? 'blue' : 'purple'}
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

                {/* Topics and Question Types */}
                <Card title="Cấu trúc đề thi" size="small">
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div>
                      <Text strong>Chủ đề:</Text>
                      <div style={{ marginTop: '8px' }}>
                        {data.topicIds && data.topicIds.length > 0 ? (
                          <Text>{data.topicIds.join(', ')}</Text>
                        ) : (
                          <Text type="secondary">Chưa có thông tin</Text>
                        )}
                      </div>
                    </div>
                    <div>
                      <Text strong>Loại câu hỏi:</Text>
                      <div style={{ marginTop: '8px' }}>
                        {data.questionTypeIds && data.questionTypeIds.length > 0 ? (
                          <Text>{data.questionTypeIds.join(', ')}</Text>
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

            <TabPane tab={`Danh sách câu hỏi (${data?.questions?.length || 0})`} key="2">
              <Card title="Danh sách câu hỏi trong bài kiểm tra" size="small">
                <div style={{ marginBottom: 16 }}>
                  <Button type="primary" onClick={handleOpenQuestionComparison}>
                    So sánh câu hỏi tương tự
                  </Button>
                </div>
                {data?.questions && data.questions.length > 0 ? (
                  <Table
                    columns={questionColumns}
                    dataSource={data.questions}
                    rowKey="id"
                    pagination={{
                      total: data.questions.length,
                      pageSize: 10,
                      showSizeChanger: true,
                      showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} câu hỏi`,
                    }}
                    size="small"
                  />
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Text type="secondary">Chưa có câu hỏi nào được tải</Text>
                  </div>
                )}
              </Card>
            </TabPane>

            <TabPane tab="Kiểm duyệt" key="3">
              <Card title="Quyết định kiểm duyệt" size="small">
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  <div>
                    <Text
                      strong
                      style={{ marginBottom: '8px', display: 'block' }}
                    >
                      Trạng thái kiểm duyệt:
                    </Text>
                    <Select
                      value={approvalStatus}
                      onChange={setApprovalStatus}
                      style={{ width: '200px' }}
                    >
                      <Option value="Approved">Chấp nhận</Option>
                      <Option value="Rejected">Từ chối</Option>
                    </Select>
                  </div>

                  {approvalStatus === 'Rejected' && (
                    <div>
                      <Text
                        strong
                        style={{ marginBottom: '8px', display: 'block' }}
                      >
                        Lý do từ chối:
                      </Text>
                      <TextArea
                        rows={4}
                        placeholder="Vui lòng nhập lý do từ chối bài kiểm tra..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </Card>
            </TabPane>
          </Tabs>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Text type="secondary">Không có dữ liệu bài kiểm tra</Text>
          </div>
        )}
      </Drawer>

      <QuestionListDrawer
        visible={questionListDrawerVisible}
        onClose={() => setQuestionListDrawerVisible(false)}
        onAddQuestion={() => { }} // Not used in compare mode
        selectedQuestionIds={selectedQuestionForComparison ? [selectedQuestionForComparison.id] : []}
        fields={fields}
        topics={topics}
        levels={levels}
        questionTypes={questionTypes}
        mode="compare"
        onCompareQuestions={handleCompareQuestions}
      />
    </>
  );
};

export default ExamApprovalFormDrawer;
