import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  Card,
  Typography,
  Tag,
  Button,
  Space,
  Progress,
  Divider,
  Empty,
} from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import {
  Question,
  Field,
  Topic,
  Level,
  QuestionType,
  QuestionVariant,
} from '@abc-interview-support-frontend/types';

const { Title, Text } = Typography;

interface CompareDrawerProps {
  visible: boolean;
  onClose: () => void;
  currentQuestion: Question | null;
  fields: Field[];
  topics: Topic[];
  levels: Level[];
  questionTypes: QuestionType[];
}

const QuestionApprovalCompareDrawer: React.FC<CompareDrawerProps> = ({
  visible,
  onClose,
  currentQuestion,
  fields,
  topics,
  levels,
  questionTypes,
}) => {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [similarQuestions, setSimilarQuestions] = useState<Question[]>([]);

  // Mock data cho các câu hỏi tương tự
  useEffect(() => {
    if (currentQuestion && visible) {
      // Giả lập tìm kiếm câu hỏi tương tự
      const mockSimilarQuestions: Question[] = [
        {
          questionId: 'similar-1',
          userId: 'user-1',
          topicId: currentQuestion.topicId,
          fieldId: currentQuestion.fieldId,
          levelId: currentQuestion.levelId,
          status: 'Approved',
          questionTitle:
            'React Hook useEffect được sử dụng để làm gì? (Phiên bản khác)',
          questionVariant: '1,2',
          similarityScore: 85,
          usefulVote: 25,
          unusefulVote: 3,
          createdAt: new Date('2024-01-15'),
        },
        {
          questionId: 'similar-2',
          userId: 'user-2',
          topicId: currentQuestion.topicId,
          fieldId: currentQuestion.fieldId,
          levelId: currentQuestion.levelId,
          status: 'Approved',
          questionTitle:
            'Cách sử dụng useEffect trong React functional component',
          questionVariant: '1,3,4',
          similarityScore: 72,
          usefulVote: 18,
          unusefulVote: 2,
          createdAt: new Date('2024-02-20'),
        },
        {
          questionId: 'similar-3',
          userId: 'user-3',
          topicId: currentQuestion.topicId,
          fieldId: currentQuestion.fieldId,
          levelId: currentQuestion.levelId,
          status: 'Approved',
          questionTitle: 'useEffect hook trong React - cách hoạt động',
          questionVariant: '1,2,5',
          similarityScore: 68,
          usefulVote: 12,
          unusefulVote: 1,
          createdAt: new Date('2024-03-10'),
        },
      ];

      setSimilarQuestions(mockSimilarQuestions);
    }
  }, [currentQuestion, visible]);

  const getFieldName = (fieldId: string) => {
    const field = fields.find((f) => f.fieldId === fieldId);
    return field?.fieldName || 'N/A';
  };

  const getTopicName = (topicId: string) => {
    const topic = topics.find((t) => t.topicId === topicId);
    return topic?.topicName || 'N/A';
  };

  const getLevelName = (levelId: string) => {
    const level = levels.find((l) => l.levelId === levelId);
    return level?.levelName || 'N/A';
  };

  const getSimilarityColor = (score: number) => {
    if (score >= 80) return '#ff4d4f'; // High similarity - red
    if (score >= 60) return '#faad14'; // Medium similarity - orange
    return '#52c41a'; // Low similarity - green
  };

  const getSimilarityText = (score: number) => {
    if (score >= 80) return 'Rất cao';
    if (score >= 60) return 'Cao';
    if (score >= 40) return 'Trung bình';
    return 'Thấp';
  };

  // Mock function to get question variants
  const getQuestionVariants = (question: Question): QuestionVariant[] => {
    if (!question.questionVariant) return [];

    const variantIds = question.questionVariant.split(',');
    return variantIds.map((id) => ({
      questionVariantId: id.trim(),
      questionTypeId: '5', // Reference type
      questionContent: `Nội dung tham khảo cho variant ${id.trim()}`,
      questionAnswer: `Đáp án tham khảo cho variant ${id.trim()}`,
    }));
  };

  const renderQuestionDetail = (question: Question) => (
    <div style={{ padding: '16px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={4} style={{ marginBottom: '16px' }}>
            {question.questionTitle}
          </Title>

          <div style={{ display: 'grid', gap: '8px', marginBottom: '16px' }}>
            <Space wrap>
              <Tag color="blue">{getFieldName(question.fieldId)}</Tag>
              <Tag color="green">{getTopicName(question.topicId)}</Tag>
              <Tag color="orange">{getLevelName(question.levelId)}</Tag>
              <Tag color="purple">{question.status}</Tag>
            </Space>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <Text strong>Độ tương đồng: </Text>
            <span
              style={{
                color: getSimilarityColor(question.similarityScore || 0),
              }}
            >
              {question.similarityScore?.toFixed(1)}% (
              {getSimilarityText(question.similarityScore || 0)})
            </span>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <Text strong>Người tạo: </Text>
            <Text>User #{question.userId}</Text>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <Text strong>Ngày tạo: </Text>
            <Text>
              {new Date(question.createdAt).toLocaleDateString('vi-VN')}
            </Text>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <Text strong>Lượt vote: </Text>
            <Text style={{ color: '#52c41a' }}>+{question.usefulVote}</Text>
            <Text style={{ color: '#ff4d4f', marginLeft: '8px' }}>
              -{question.unusefulVote}
            </Text>
          </div>
        </div>

        <Divider />

        <div>
          <Title level={5}>Các biến thể câu hỏi</Title>
          <div style={{ marginTop: '16px' }}>
            {getQuestionVariants(question).map((variant) => (
              <Card
                key={variant.questionVariantId}
                size="small"
                style={{ marginBottom: '8px' }}
                title={`Biến thể ${variant.questionVariantId}`}
              >
                <div style={{ marginBottom: '8px' }}>
                  <Text strong>Nội dung: </Text>
                  <Text>{variant.questionContent}</Text>
                </div>
                <div>
                  <Text strong>Đáp án: </Text>
                  <Text>{variant.questionAnswer}</Text>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Space>
    </div>
  );

  return (
    <Drawer
      title="So sánh với câu hỏi đã có"
      width={850}
      open={visible}
      onClose={onClose}
      footer={null}
      placement="left"
      mask={false}
      zIndex={1001}
    >
      <div style={{ display: 'flex', height: '100%' }}>
        {/* Danh sách câu hỏi tương tự */}
        <div
          style={{
            flex: 1,
            borderRight: '1px solid #f0f0f0',
            paddingRight: '16px',
          }}
        >
          <Title level={5} style={{ marginBottom: '16px' }}>
            Câu hỏi tương tự ({similarQuestions.length})
          </Title>

          {similarQuestions.length === 0 ? (
            <Empty description="Không tìm thấy câu hỏi tương tự" />
          ) : (
            <List
              dataSource={similarQuestions}
              renderItem={(question) => (
                <List.Item
                  style={{
                    padding: '12px',
                    border:
                      selectedQuestion?.questionId === question.questionId
                        ? '2px solid #1890ff'
                        : '1px solid #f0f0f0',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedQuestion(question)}
                >
                  <div style={{ width: '100%' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '8px',
                      }}
                    >
                      <Text strong style={{ flex: 1, marginRight: '16px' }}>
                        {question.questionTitle}
                      </Text>
                      <Button
                        type="text"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedQuestion(question);
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px',
                      }}
                    >
                      <Tag color="blue">{getFieldName(question.fieldId)}</Tag>
                      <Tag color="green">{getTopicName(question.topicId)}</Tag>
                      <Tag color="orange">{getLevelName(question.levelId)}</Tag>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          Độ tương đồng:
                        </Text>
                        <Progress
                          percent={question.similarityScore}
                          size="small"
                          strokeColor={getSimilarityColor(
                            question.similarityScore || 0
                          )}
                          showInfo={false}
                        />
                        <Text
                          style={{
                            fontSize: '12px',
                            color: getSimilarityColor(
                              question.similarityScore || 0
                            ),
                          }}
                        >
                          {question.similarityScore?.toFixed(1)}% -{' '}
                          {getSimilarityText(question.similarityScore || 0)}
                        </Text>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', color: '#52c41a' }}>
                          +{question.usefulVote}
                        </div>
                        <div style={{ fontSize: '12px', color: '#ff4d4f' }}>
                          -{question.unusefulVote}
                        </div>
                      </div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          )}
        </div>

        {/* Chi tiết câu hỏi được chọn */}
        <div style={{ flex: 1, paddingLeft: '16px' }}>
          {selectedQuestion ? (
            renderQuestionDetail(selectedQuestion)
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Empty description="Chọn một câu hỏi để xem chi tiết" />
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default QuestionApprovalCompareDrawer;
