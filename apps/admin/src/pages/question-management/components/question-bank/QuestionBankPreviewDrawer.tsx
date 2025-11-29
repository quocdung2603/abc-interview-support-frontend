import React from 'react';
import {
  Drawer,
  Card,
  Tag,
  Typography,
  Tabs,
} from 'antd';
import {
  Question,
  Field,
  Topic,
  Level,
  QuestionType,
} from '@abc-interview-support-frontend/types';
import type { TabsProps } from 'antd';

const { Text } = Typography;

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
    const questionType = questionTypes.find((qt) => qt.id === questionTypeId);
    return questionType?.name || 'N/A';
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ duyệt';
      case 'APPROVED':
        return 'Đã duyệt';
      case 'REJECTED':
        return 'Đã từ chối';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '#faad14';
      case 'APPROVED':
        return '#52c41a';
      case 'REJECTED':
        return '#ff4d4f';
      default:
        return '#d9d9d9';
    }
  };

  const TabMenu: TabsProps['items'] = [
    {
      key: '1',
      label: 'Thông tin cơ bản',
      children: data ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card title="Thông tin câu hỏi" size="small">
            <div style={{ display: 'grid', gap: '12px' }}>
              <div>
                <Text strong>ID câu hỏi:</Text> {data.id}
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
                <Text strong>Loại câu hỏi:</Text>{' '}
                <Text>{getQuestionTypeName(data.questionTypeId)}</Text>
              </div>
              <div>
                <Text strong>Ngôn ngữ:</Text>{' '}
                <Text>{data.language === 'Vietnamese' ? 'Tiếng Việt' : 'Tiếng Anh'}</Text>
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
      label: 'Chi tiết câu hỏi',
      children: data ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card title="Nội dung câu hỏi" size="small">
            <Text>{data.questionContent}</Text>
          </Card>
          <Card title="Câu trả lời" size="small">
            <Text>{data.questionAnswer}</Text>
          </Card>
        </div>
      ) : null,
    },
    {
      key: '3',
      label: 'Đáp án câu hỏi',
      children: data ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card title="Giải thích câu hỏi" size="small">
            <Text></Text>
          </Card>
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
