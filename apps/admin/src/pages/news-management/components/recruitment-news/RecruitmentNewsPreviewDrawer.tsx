import React from 'react';
import { Drawer, Card, Tag, Typography } from 'antd';
import { News, Field, Topic } from '@abc-interview-support-frontend/types';

const { Title, Paragraph, Text } = Typography;

interface PreviewDrawerProps {
  visible: boolean;
  onClose: () => void;
  data: News | null;
  fields: Field[];
  topics: Topic[];
}

const RecruitmentNewsPreviewDrawer: React.FC<PreviewDrawerProps> = ({
  visible,
  onClose,
  data,
  fields,
  topics,
}) => {
  const getFieldName = (fieldId?: string) => {
    if (!fieldId) return 'N/A';
    const field = fields.find((f) => f.fieldId === fieldId);
    return field?.fieldName || 'N/A';
  };

  const getTopicName = (topicId?: string) => {
    if (!topicId) return 'N/A';
    const topic = topics.find((t) => t.topicId === topicId);
    return topic?.topicName || 'N/A';
  };

  return (
    <Drawer
      title="Chi tiết tin tức tuyển dụng"
      width={800}
      open={visible}
      onClose={onClose}
    >
      {data && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Header */}
          <div>
            <Title level={3} style={{ marginBottom: '8px' }}>
              {data.title}
            </Title>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <Tag color="blue">{getFieldName(data.fieldId)}</Tag>
              <Tag color="green">{getTopicName(data.topicId)}</Tag>
              {data.location && <Tag color="orange">{data.location}</Tag>}
              <Tag color="purple">Tuyển dụng</Tag>
            </div>
          </div>

          {/* Content */}
          <Card title="Nội dung tin tức" size="small">
            <Paragraph
              style={{
                fontSize: '16px',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap',
              }}
            >
              {data.content}
            </Paragraph>
          </Card>

          {/* Metadata */}
          <Card title="Thông tin bổ sung" size="small">
            <div style={{ display: 'grid', gap: '12px' }}>
              <div>
                <Text strong>ID tin tức:</Text> {data.newsId}
              </div>
              <div>
                <Text strong>Người tạo:</Text> User #{data.userId}
              </div>
              <div>
                <Text strong>Loại tin tức:</Text>{' '}
                <Tag color="orange">
                  {data.newsType === 'trend' ? 'Xu hướng' : 'Tuyển dụng'}
                </Tag>
              </div>
              {data.location && (
                <div>
                  <Text strong>Địa điểm:</Text>{' '}
                  <Tag color="orange">{data.location}</Tag>
                </div>
              )}
              <div>
                <Text strong>Lĩnh vực:</Text>{' '}
                <Tag color="blue">{getFieldName(data.fieldId)}</Tag>
              </div>
              <div>
                <Text strong>Chủ đề:</Text>{' '}
                <Tag color="green">{getTopicName(data.topicId)}</Tag>
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
      )}
    </Drawer>
  );
};

export default RecruitmentNewsPreviewDrawer;
