import React from 'react';
import { Modal, Typography, Divider, Space, Tag, Card } from 'antd';
import {
  Question,
  Field,
  Topic,
  Level,
  QuestionType,
} from '@abc-interview-support-frontend/types';

const { Title, Text, Paragraph } = Typography;

interface QuestionComparisonModalProps {
  visible: boolean;
  onClose: () => void;
  currentQuestion: Question | null;
  compareQuestion: Question | null;
  fields: Field[];
  topics: Topic[];
  levels: Level[];
  questionTypes: QuestionType[];
}

const QuestionComparisonModal: React.FC<QuestionComparisonModalProps> = ({
  visible,
  onClose,
  currentQuestion,
  compareQuestion,
  fields,
  topics,
  levels,
  questionTypes,
}) => {
  const getFieldName = (fieldId: number) => {
    const field = fields.find((f) => f.id === fieldId);
    return field?.name || 'N/A';
  };

  const getTopicName = (topicId: number) => {
    const topic = topics.find((t) => t.id === topicId);
    return topic?.name || 'N/A';
  };

  const getLevelName = (levelId: number) => {
    const level = levels.find((l) => l.id === levelId);
    return level?.name || 'N/A';
  };

  const getQuestionTypeName = (questionTypeId: number) => {
    const type = questionTypes.find((t) => t.id === questionTypeId);
    return type?.name || 'N/A';
  };

  const renderQuestionInfo = (question: Question, title: string, isCurrentQuestion = false) => (
    <Card
      title={
        isCurrentQuestion ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{title}</span>
            {question.similarityScore !== undefined && question.similarityScore !== null && (
              <div style={{ padding: '4px 8px', backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '4px' }}>
                <Text strong style={{ color: '#52c41a', fontSize: '14px' }}>
                  Tương đồng: {question.similarityScore.toFixed(1)}%
                </Text>
              </div>
            )}
          </div>
        ) : title
      }
      style={{ flex: 1 }}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <Title level={5}>Nội dung câu hỏi</Title>
          <Paragraph style={{ fontSize: '14px', lineHeight: '1.6' }}>
            {question.questionContent}
          </Paragraph>
        </div>

        {question.questionAnswer && (
          <div>
            <Title level={5}>Đáp án</Title>
            <Paragraph style={{ fontSize: '12px', lineHeight: '1.6' }}>
              {question.questionAnswer}
            </Paragraph>
          </div>
        )}

        <Divider />

        <div>
          <Title level={5}>Thông tin phân loại</Title>
          <Space wrap style={{ marginTop: '8px' }}>
            <Tag color="blue">{getFieldName(question.fieldId)}</Tag>
            <Tag color="green">{getTopicName(question.topicId)}</Tag>
            <Tag color="orange">{getLevelName(question.levelId)}</Tag>
            <Tag color="purple">{getQuestionTypeName(question.questionTypeId)}</Tag>
          </Space>
        </div>

        <Divider />

        <div>
          <Title level={5}>Thông tin khác</Title>
          <div style={{ display: 'grid', gap: '4px', marginTop: '8px' }}>
            <div>
              <Text strong>Người tạo:</Text> User #{question.userId}
            </div>
            <div>
              <Text strong>Trạng thái:</Text> {question.status}
            </div>
            <div>
              <Text strong>Ngày tạo:</Text>{' '}
              {new Date(question.createdAt).toLocaleDateString('vi-VN')}
            </div>
            <div>
              <Text strong>Lượt vote:</Text>{' '}
              <Text style={{ color: '#52c41a' }}>+{question.usefulVote}</Text>
              <Text style={{ color: '#ff4d4f', marginLeft: '8px' }}>
                -{question.unusefulVote}
              </Text>
            </div>
          </div>
        </div>
      </Space>
    </Card>
  );

  return (
    <Modal
      title="So sánh câu hỏi"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1400}
      zIndex={1002}
      centered
    >
      {currentQuestion && compareQuestion && (
        <div style={{ display: 'flex', gap: '16px' }}>
          {renderQuestionInfo(compareQuestion, 'Câu hỏi trong ngân hàng')}
          {renderQuestionInfo(currentQuestion, 'Câu hỏi đang kiểm duyệt', true)}
        </div>
      )}
    </Modal>
  );
};

export default QuestionComparisonModal;