import React from 'react';
import { Modal, Typography, Tag, Space, Divider, Card } from 'antd';
import { Question } from '@abc-interview-support-frontend/types';

const { Title, Text, Paragraph } = Typography;

interface QuestionDetailModalProps {
  visible: boolean;
  onClose: () => void;
  question: Question | null;
}

const QuestionDetailModal: React.FC<QuestionDetailModalProps> = ({
  visible,
  onClose,
  question,
}) => {
  if (!question) return null;

  const renderQuestionContent = () => {
    switch (question.questionTypeName) {
      case 'SingleChoice':
      case 'MultipleChoice': {
        // For now, we'll show a placeholder since questionVariant is not in Question interface
        // In a real implementation, you'd need to fetch the QuestionVariant separately
        return (
          <div>
            <Paragraph strong style={{ marginBottom: 12 }}>
              {question.questionContent}
            </Paragraph>
            <Text type="secondary">Chi tiết lựa chọn sẽ được hiển thị khi có dữ liệu QuestionVariant</Text>
          </div>
        );
      }
      case 'TrueFalse':
        return (
          <Paragraph strong>
            {question.questionContent}
          </Paragraph>
        );
      case 'FillInTheBlank':
        return (
          <div>
            <Paragraph strong style={{ marginBottom: 12 }}>
              {question.questionContent}
            </Paragraph>
            <Text type="secondary">Điền vào chỗ trống</Text>
          </div>
        );
      default:
        return (
          <Paragraph strong>
            {question.questionContent}
          </Paragraph>
        );
    }
  };

  const renderAnswer = () => {
    switch (question.questionTypeName) {
      case 'SingleChoice':
      case 'MultipleChoice': {
        // For now, show the answer directly since we don't have questionVariant data
        return (
          <div>
            <Text strong>Đáp án: </Text>
            <Tag color="green" style={{ fontSize: 14, padding: '4px 8px' }}>
              {question.questionAnswer}
            </Tag>
          </div>
        );
      }
      case 'TrueFalse':
        return (
          <div>
            <Text strong>Đáp án: </Text>
            <Tag color={question.questionAnswer === 'True' ? 'green' : 'red'} style={{ fontSize: 14, padding: '4px 8px' }}>
              {question.questionAnswer}
            </Tag>
          </div>
        );
      case 'FillInTheBlank':
      default:
        return (
          <div>
            <Text strong>Đáp án: </Text>
            <Text style={{ fontSize: 14 }}>{question.questionAnswer}</Text>
          </div>
        );
    }
  };

  return (
    <Modal
      title={
        <Space>
          <span>Chi tiết câu hỏi</span>
          <Tag color="blue">{question.questionTypeName}</Tag>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      centered
    >
      <div style={{ padding: '16px 0' }}>
        {/* Question Title */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Title level={4} style={{ marginBottom: 8 }}>
            {question.questionContent}
          </Title>
          <Space wrap>
            <Tag color="purple">{question.fieldName}</Tag>
            <Tag color="cyan">{question.topicName}</Tag>
            <Tag color="orange">{question.levelName}</Tag>
          </Space>
        </Card>

        {/* Question Content */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Title level={5} style={{ marginBottom: 12 }}>
            Nội dung câu hỏi
          </Title>
          {renderQuestionContent()}
        </Card>

        {/* Answer */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Title level={5} style={{ marginBottom: 12 }}>
            Đáp án
          </Title>
          {renderAnswer()}
        </Card>

        <Divider />

        {/* Additional Information */}
        <Card size="small">
          <Title level={5} style={{ marginBottom: 12 }}>
            Thông tin bổ sung
          </Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>Trạng thái: </Text>
              <Tag color={question.status === 'APPROVED' ? 'green' : 'orange'}>
                {question.status === 'APPROVED' ? 'Đã duyệt' : 'Chờ duyệt'}
              </Tag>
            </div>
            <div>
              <Text strong>Đánh giá: </Text>
              <Space>
                <Tag color="green">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3'%3E%3C/svg%3E" alt="thumbs up" style={{ width: 14, height: 14, marginRight: 4 }} />
                  {question.usefulVote}
                </Tag>
                <Tag color="red">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='M10 15v4a3 3 0 0 0 3 3l4-9V3H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zM17 4h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3'%3E%3C/svg%3E" alt="thumbs down" style={{ width: 14, height: 14, marginRight: 4 }} />
                  {question.unusefulVote}
                </Tag>
              </Space>
            </div>
            <div>
              <Text strong>Ngày tạo: </Text>
              <Text>{new Date(question.createdAt).toLocaleDateString('vi-VN')}</Text>
            </div>
            {question.approvedAt && (
              <div>
                <Text strong>Ngày duyệt: </Text>
                <Text>{new Date(question.approvedAt).toLocaleDateString('vi-VN')}</Text>
              </div>
            )}
            <div>
              <Text strong>Ngôn ngữ: </Text>
              <Text>{question.language === 'vi' ? 'Tiếng Việt' : 'English'}</Text>
            </div>
          </Space>
        </Card>
      </div>
    </Modal>
  );
};

export default QuestionDetailModal;