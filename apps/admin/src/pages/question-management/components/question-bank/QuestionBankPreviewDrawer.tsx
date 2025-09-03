import React, { useState } from 'react';
import {
  Drawer,
  Card,
  Tag,
  Typography,
  Tabs,
  Radio,
  Checkbox,
  Input,
  Space,
  Button,
  message,
} from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import {
  Question,
  Field,
  Topic,
  Level,
  QuestionType,
  QuestionVariant,
} from '@abc-interview-support-frontend/types';
import type { TabsProps } from 'antd';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface PreviewDrawerProps {
  visible: boolean;
  onClose: () => void;
  data: Question | null;
  fields: Field[];
  topics: Topic[];
  levels: Level[];
  questionTypes: QuestionType[];
}

const QuestionBankPreviewDrawer: React.FC<PreviewDrawerProps> = ({
  visible,
  onClose,
  data,
  fields,
  topics,
  levels,
  questionTypes,
}) => {
  const [editingVariant, setEditingVariant] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<QuestionVariant | null>(null);

  // Handle edit mode
  const startEditing = (variant: QuestionVariant) => {
    setEditingVariant(variant.questionVariantId);
    setEditingData({ ...variant });
  };

  const cancelEditing = () => {
    setEditingVariant(null);
    setEditingData(null);
  };

  const saveEditing = () => {
    if (!editingData) return;

    // Here you would typically call an API to save the changes
    // For now, we'll just show a success message
    message.success('Đã lưu thay đổi thành công!');
    setEditingVariant(null);
    setEditingData(null);
  };

  const updateEditingData = (field: keyof QuestionVariant, value: string) => {
    if (!editingData) return;
    setEditingData({
      ...editingData,
      [field]: value,
    });
  };
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'Chờ duyệt';
      case 'Approved':
        return 'Đã duyệt';
      case 'Rejected':
        return 'Đã từ chối';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return '#faad14';
      case 'Approved':
        return '#52c41a';
      case 'Rejected':
        return '#ff4d4f';
      default:
        return '#d9d9d9';
    }
  };

  // Mock QuestionVariant data based on questionVariant string
  const getQuestionVariants = (question: Question): QuestionVariant[] => {
    if (!question.questionVariant) return [];

    const variantIds = question.questionVariant.split(',');
    return variantIds.map((id, index) => {
      const mockContents = [
        'React Hook useEffect được sử dụng để thực hiện side effects trong functional components.',
        'Trong JavaScript, phương thức push() được sử dụng để thêm phần tử vào cuối mảng.',
        'RESTful API là kiến trúc API dựa trên các nguyên tắc REST.',
        'Trong CSS, thuộc tính margin được sử dụng để tạo khoảng cách giữa các phần tử.',
        'Git command "git commit -m \'message\'" được sử dụng để tạo một commit mới.',
      ];

      const mockAnswers = [
        'Thực hiện side effects trong functional components',
        'push()',
        'Kiến trúc API dựa trên REST principles',
        'margin',
        'git commit -m "message"',
      ];

      const mockChoices = [
        'Thực hiện side effects trong functional components|Render JSX elements|Tạo state trong class components|Xử lý events',
        'push()|pop()|shift()|unshift()',
        'Kiến trúc API dựa trên REST principles|Kiến trúc API dựa trên SOAP|Kiến trúc API dựa trên GraphQL|Kiến trúc API dựa trên RPC',
        'margin|padding|border|width',
        'git commit -m "message"|git add .|git push origin main|git pull origin main',
      ];

      return {
        questionVariantId: id.trim(),
        questionTypeId: String((parseInt(id.trim()) % 5) + 1), // Cycle through question types
        questionContent: mockContents[index % mockContents.length],
        questionChoose: mockChoices[index % mockChoices.length],
        questionAnswer: mockAnswers[index % mockAnswers.length],
      };
    });
  };

  const renderEditActions = (variant: QuestionVariant) => (
    <div
      style={{
        marginTop: '16px',
        display: 'flex',
        gap: '8px',
        justifyContent: 'flex-end',
      }}
    >
      {editingVariant ? (
        <>
          <Button
            size="small"
            onClick={saveEditing}
            type="primary"
            icon={<SaveOutlined />}
          >
            Lưu
          </Button>
          <Button size="small" onClick={cancelEditing} icon={<CloseOutlined />}>
            Hủy
          </Button>
        </>
      ) : (
        <Button
          size="small"
          onClick={() => startEditing(variant)}
          icon={<EditOutlined />}
        >
          Chỉnh sửa
        </Button>
      )}
    </div>
  );

  const renderQuestionVariant = (variant: QuestionVariant) => {
    const isEditing = editingVariant === variant.questionVariantId;
    const currentData = isEditing && editingData ? editingData : variant;

    const questionTypeId = parseInt(variant.questionTypeId);

    switch (questionTypeId) {
      case 1:
        return renderSingleChoiceVariant(variant, isEditing, currentData);
      case 2:
        return renderMultipleChoiceVariant(variant, isEditing, currentData);
      case 3:
        return renderFillInTheBlankVariant(variant, isEditing, currentData);
      case 4:
        return renderOpenEndedVariant(variant, isEditing, currentData);
      case 5:
        return renderReferenceVariant(variant, isEditing, currentData);
      default:
        return renderSingleChoiceVariant(variant, isEditing, currentData);
    }
  };

  const renderSingleChoiceVariant = (
    variant: QuestionVariant,
    isEditing: boolean,
    currentData: QuestionVariant
  ) => (
    <Card
      title={`Câu hỏi dạng Trắc nghiệm 1 lựa chọn (Variant ${variant.questionVariantId})`}
      size="small"
      extra={renderEditActions(variant)}
    >
      <div style={{ marginBottom: '16px' }}>
        {isEditing ? (
          <Input.TextArea
            value={currentData.questionContent}
            onChange={(e) =>
              updateEditingData('questionContent', e.target.value)
            }
            placeholder="Nhập nội dung câu hỏi..."
            rows={3}
          />
        ) : (
          <Text strong>{currentData.questionContent}</Text>
        )}
      </div>

      {isEditing ? (
        <div style={{ marginBottom: '16px' }}>
          <Text strong style={{ display: 'block', marginBottom: '8px' }}>
            Các lựa chọn (cách nhau bởi dấu |):
          </Text>
          <Input.TextArea
            value={currentData.questionChoose}
            onChange={(e) =>
              updateEditingData('questionChoose', e.target.value)
            }
            placeholder="Lựa chọn 1|Lựa chọn 2|Lựa chọn 3|Lựa chọn 4"
            rows={4}
          />
        </div>
      ) : (
        <Radio.Group
          disabled
          value={currentData.questionChoose
            ?.split('|')
            .indexOf(currentData.questionAnswer)}
        >
          <Space direction="vertical">
            {currentData.questionChoose?.split('|').map((choice, index) => (
              <Radio key={choice} value={index}>
                {choice}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      )}

      <div style={{ marginTop: '16px' }}>
        {isEditing ? (
          <div>
            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
              Đáp án đúng:
            </Text>
            <Input
              value={currentData.questionAnswer}
              onChange={(e) =>
                updateEditingData('questionAnswer', e.target.value)
              }
              placeholder="Nhập đáp án đúng..."
            />
          </div>
        ) : (
          <div
            style={{
              padding: '8px',
              backgroundColor: '#f6ffed',
              border: '1px solid #b7eb8f',
            }}
          >
            <Text strong style={{ color: '#52c41a' }}>
              Đáp án đúng: {currentData.questionAnswer}
            </Text>
          </div>
        )}
      </div>
    </Card>
  );

  const renderMultipleChoiceVariant = (
    variant: QuestionVariant,
    isEditing: boolean,
    currentData: QuestionVariant
  ) => (
    <Card
      title={`Câu hỏi dạng Trắc nghiệm nhiều lựa chọn (Variant ${variant.questionVariantId})`}
      size="small"
      extra={renderEditActions(variant)}
    >
      <div style={{ marginBottom: '16px' }}>
        {isEditing ? (
          <Input.TextArea
            value={currentData.questionContent}
            onChange={(e) =>
              updateEditingData('questionContent', e.target.value)
            }
            placeholder="Nhập nội dung câu hỏi..."
            rows={3}
          />
        ) : (
          <Text strong>{currentData.questionContent}</Text>
        )}
      </div>

      {isEditing ? (
        <div style={{ marginBottom: '16px' }}>
          <Text strong style={{ display: 'block', marginBottom: '8px' }}>
            Các lựa chọn (cách nhau bởi dấu |):
          </Text>
          <Input.TextArea
            value={currentData.questionChoose}
            onChange={(e) =>
              updateEditingData('questionChoose', e.target.value)
            }
            placeholder="Lựa chọn 1|Lựa chọn 2|Lựa chọn 3|Lựa chọn 4"
            rows={4}
          />
        </div>
      ) : (
        <Checkbox.Group
          disabled
          value={currentData.questionAnswer
            ?.split('|')
            .map((answer) =>
              currentData.questionChoose?.split('|').indexOf(answer)
            )
            .filter((index) => index !== -1)}
          style={{ width: '100%' }}
        >
          <Space direction="vertical">
            {currentData.questionChoose?.split('|').map((choice, index) => (
              <Checkbox key={choice} value={index}>
                {choice}
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
      )}

      <div style={{ marginTop: '16px' }}>
        {isEditing ? (
          <div>
            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
              Đáp án đúng (cách nhau bởi dấu |):
            </Text>
            <Input
              value={currentData.questionAnswer}
              onChange={(e) =>
                updateEditingData('questionAnswer', e.target.value)
              }
              placeholder="Đáp án 1|Đáp án 2"
            />
          </div>
        ) : (
          <div
            style={{
              padding: '8px',
              backgroundColor: '#f6ffed',
              border: '1px solid #b7eb8f',
            }}
          >
            <Text strong style={{ color: '#52c41a' }}>
              Đáp án đúng: {currentData.questionAnswer}
            </Text>
          </div>
        )}
      </div>
    </Card>
  );

  const renderFillInTheBlankVariant = (
    variant: QuestionVariant,
    isEditing: boolean,
    currentData: QuestionVariant
  ) => (
    <Card
      title={`Câu hỏi dạng Điền khuyết (Variant ${variant.questionVariantId})`}
      size="small"
      extra={renderEditActions(variant)}
    >
      <div style={{ marginBottom: '16px' }}>
        {isEditing ? (
          <Input.TextArea
            value={currentData.questionContent}
            onChange={(e) =>
              updateEditingData('questionContent', e.target.value)
            }
            placeholder="Nhập nội dung câu hỏi..."
            rows={3}
          />
        ) : (
          <Text strong>{currentData.questionContent}</Text>
        )}
      </div>

      <Input placeholder="Nhập đáp án của bạn..." disabled />

      <div style={{ marginTop: '16px' }}>
        {isEditing ? (
          <div>
            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
              Đáp án đúng:
            </Text>
            <Input
              value={currentData.questionAnswer}
              onChange={(e) =>
                updateEditingData('questionAnswer', e.target.value)
              }
              placeholder="Nhập đáp án đúng..."
            />
          </div>
        ) : (
          <div
            style={{
              padding: '8px',
              backgroundColor: '#f6ffed',
              border: '1px solid #b7eb8f',
            }}
          >
            <Text strong style={{ color: '#52c41a' }}>
              Đáp án đúng: {currentData.questionAnswer}
            </Text>
          </div>
        )}
      </div>
    </Card>
  );

  const renderOpenEndedVariant = (
    variant: QuestionVariant,
    isEditing: boolean,
    currentData: QuestionVariant
  ) => (
    <Card
      title={`Câu hỏi dạng Tự luận (Variant ${variant.questionVariantId})`}
      size="small"
      extra={renderEditActions(variant)}
    >
      <div style={{ marginBottom: '16px' }}>
        {isEditing ? (
          <Input.TextArea
            value={currentData.questionContent}
            onChange={(e) =>
              updateEditingData('questionContent', e.target.value)
            }
            placeholder="Nhập nội dung câu hỏi..."
            rows={3}
          />
        ) : (
          <Text strong>{currentData.questionContent}</Text>
        )}
      </div>

      <TextArea rows={4} placeholder="Viết câu trả lời của bạn..." disabled />

      <div style={{ marginTop: '16px' }}>
        {isEditing ? (
          <div>
            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
              Đáp án mẫu:
            </Text>
            <Input.TextArea
              value={currentData.questionAnswer}
              onChange={(e) =>
                updateEditingData('questionAnswer', e.target.value)
              }
              placeholder="Nhập đáp án mẫu..."
              rows={3}
            />
          </div>
        ) : (
          <div
            style={{
              padding: '8px',
              backgroundColor: '#f6ffed',
              border: '1px solid #b7eb8f',
            }}
          >
            <Text strong style={{ color: '#52c41a' }}>
              Đáp án mẫu: {currentData.questionAnswer}
            </Text>
          </div>
        )}
      </div>
    </Card>
  );

  const renderReferenceVariant = (
    variant: QuestionVariant,
    isEditing: boolean,
    currentData: QuestionVariant
  ) => (
    <Card
      title={`Câu hỏi dạng Tham khảo (Variant ${variant.questionVariantId})`}
      size="small"
      extra={renderEditActions(variant)}
    >
      <div style={{ marginBottom: '16px' }}>
        {isEditing ? (
          <Input.TextArea
            value={currentData.questionContent}
            onChange={(e) =>
              updateEditingData('questionContent', e.target.value)
            }
            placeholder="Nhập nội dung câu hỏi tham khảo..."
            rows={3}
          />
        ) : (
          <Text strong>{currentData.questionContent}</Text>
        )}
      </div>

      <div
        style={{
          padding: '16px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
        }}
      >
        <Text type="secondary">
          Đây là câu hỏi tham khảo. Vui lòng tìm hiểu thêm về chủ đề này trong
          tài liệu chính thức.
        </Text>
      </div>
    </Card>
  );

  const TabMenu: TabsProps['items'] = [
    {
      key: '1',
      label: 'Thông tin câu hỏi',
      children: data ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Question Header */}
          <div>
            <Title level={4} style={{ marginBottom: '8px' }}>
              {data.questionTitle}
            </Title>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '16px',
                flexWrap: 'wrap',
              }}
            >
              <Tag color="blue">{getFieldName(data.fieldId)}</Tag>
              <Tag color="green">{getTopicName(data.topicId)}</Tag>
              <Tag color="orange">{getLevelName(data.levelId)}</Tag>
              <Tag color={getStatusColor(data.status)}>
                {getStatusText(data.status)}
              </Tag>
            </div>
          </div>

          {/* Question Variants */}
          <Card title="Các variant của câu hỏi" size="small">
            <div style={{ marginBottom: '16px' }}>
              <Text strong>Question Variants: </Text>
              <Text>{data.questionVariant}</Text>
            </div>
            {data.similarityScore && (
              <div>
                <Text strong>Độ tương đồng: </Text>
                <Text>{data.similarityScore.toFixed(2)}%</Text>
              </div>
            )}
          </Card>

          {/* Metadata */}
          <Card title="Thông tin bổ sung" size="small">
            <div style={{ display: 'grid', gap: '12px' }}>
              <div>
                <Text strong>ID câu hỏi:</Text> {data.questionId}
              </div>
              <div>
                <Text strong>Người tạo:</Text> User #{data.userId}
              </div>
              <div>
                <Text strong>Lĩnh vực:</Text>{' '}
                <Tag color="blue">{getFieldName(data.fieldId)}</Tag>
              </div>
              <div>
                <Text strong>Chủ đề:</Text>{' '}
                <Tag color="green">{getTopicName(data.topicId)}</Tag>
              </div>
              <div>
                <Text strong>Mức độ:</Text>{' '}
                <Tag color="orange">{getLevelName(data.levelId)}</Tag>
              </div>
              <div>
                <Text strong>Trạng thái:</Text>{' '}
                <Tag color={getStatusColor(data.status)}>
                  {getStatusText(data.status)}
                </Tag>
              </div>
              <div>
                <Text strong>Lượt vote hữu ích:</Text> {data.usefulVote}
              </div>
              <div>
                <Text strong>Lượt vote không hữu ích:</Text> {data.unusefulVote}
              </div>
              <div>
                <Text strong>Ngày tạo:</Text>{' '}
                {new Date(data.createdAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </Card>
        </div>
      ) : null,
    },
    {
      key: '2',
      label: 'Xem dạng câu hỏi',
      children: data ? (
        <div style={{ padding: '16px 0' }}>
          <Tabs type="card" size="small">
            {questionTypes
              .map((questionType) => {
                const variantsOfType = getQuestionVariants(data).filter(
                  (variant) =>
                    variant.questionTypeId === questionType.questionTypeId
                );

                if (variantsOfType.length === 0) return null;

                return (
                  <Tabs.TabPane
                    key={questionType.questionTypeId}
                    tab={`${questionType.questionTypeName} (${variantsOfType.length})`}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                      }}
                    >
                      {variantsOfType.map((variant) => (
                        <div key={variant.questionVariantId}>
                          {renderQuestionVariant(variant)}
                        </div>
                      ))}
                    </div>
                  </Tabs.TabPane>
                );
              })
              .filter(Boolean)}
          </Tabs>
        </div>
      ) : null,
    },
  ];

  return (
    <Drawer
      title="Chi tiết câu hỏi"
      width={900}
      open={visible}
      onClose={onClose}
    >
      {data && <Tabs defaultActiveKey="1" items={TabMenu} />}
    </Drawer>
  );
};

export default QuestionBankPreviewDrawer;
