import React, { useState } from 'react';
import {
  Drawer,
  Tabs,
  Form,
  Select,
  Input,
  Button,
  Space,
  message,
  Card,
  Tag,
  Typography,
} from 'antd';
import { News, Field, Topic } from '@abc-interview-support-frontend/types';
import type { TabsProps } from 'antd';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Paragraph, Text } = Typography;

interface PreviewDrawerProps {
  visible: boolean;
  onClose: () => void;
  data: News | null;
  onApprove: (data: News) => void;
  onReject: (data: News, reason: string) => void;
  fields: Field[];
  topics: Topic[];
}

const NewsApprovalFormDrawer: React.FC<PreviewDrawerProps> = ({
  visible,
  onClose,
  data,
  onApprove,
  onReject,
  fields,
  topics,
}) => {
  const [form] = Form.useForm();
  const [decision, setDecision] = useState<'Approve' | 'Reject'>('Approve');

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

  const getNewsTypeText = (newsType: string) => {
    switch (newsType) {
      case 'trend':
        return 'Xu hướng';
      case 'recruitment':
        return 'Tuyển dụng';
      default:
        return newsType;
    }
  };

  const getNewsTypeColor = (newsType: string) => {
    switch (newsType) {
      case 'trend':
        return '#1890ff';
      case 'recruitment':
        return '#722ed1';
      default:
        return '#d9d9d9';
    }
  };

  const TabMenu: TabsProps['items'] = [
    {
      key: '1',
      label: 'Thông tin tin tức',
      children: data ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Header */}
          <div>
            <Title level={3} style={{ marginBottom: '8px' }}>
              {data.title}
            </Title>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <Tag color={getNewsTypeColor(data.newsType)}>
                {getNewsTypeText(data.newsType)}
              </Tag>
              <Tag color="blue">{getFieldName(data.fieldId)}</Tag>
              <Tag color="green">{getTopicName(data.topicId)}</Tag>
              {data.location && <Tag color="orange">{data.location}</Tag>}
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
                <Text strong>Người đăng:</Text> User #{data.userId}
              </div>
              <div>
                <Text strong>Loại tin tức:</Text>{' '}
                <Tag color={getNewsTypeColor(data.newsType)}>
                  {getNewsTypeText(data.newsType)}
                </Tag>
              </div>
              <div>
                <Text strong>Lĩnh vực:</Text>{' '}
                <Tag color="blue">{getFieldName(data.fieldId)}</Tag>
              </div>
              <div>
                <Text strong>Chủ đề:</Text>{' '}
                <Tag color="green">{getTopicName(data.topicId)}</Tag>
              </div>
              {data.location && (
                <div>
                  <Text strong>Địa điểm:</Text>{' '}
                  <Tag color="orange">{data.location}</Tag>
                </div>
              )}
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
              {data.rejectReason && (
                <div>
                  <Text strong style={{ color: '#ff4d4f' }}>
                    Lý do từ chối:
                  </Text>
                  <div style={{ marginTop: '4px', color: '#ff4d4f' }}>
                    {data.rejectReason}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      ) : null,
    },
    {
      key: '2',
      label: 'Duyệt tin tức',
      children: (
        <div style={{ padding: '16px 0' }}>
          <Form
            form={form}
            layout="vertical"
            initialValues={{ decision: 'Approve' }}
          >
            <Form.Item
              label="Quyết định"
              name="decision"
              rules={[{ required: true, message: 'Vui lòng chọn quyết định' }]}
            >
              <Select
                placeholder="Chọn quyết định"
                onChange={(value) => setDecision(value)}
              >
                <Option value="Approve">Duyệt - Chấp nhận tin tức</Option>
                <Option value="Reject">Từ chối - Cần chỉnh sửa</Option>
              </Select>
            </Form.Item>

            {decision === 'Reject' && (
              <Form.Item
                label="Lý do từ chối"
                name="rejectedReason"
                rules={[
                  { required: true, message: 'Vui lòng nhập lý do từ chối' },
                  {
                    min: 10,
                    message: 'Lý do từ chối phải có ít nhất 10 ký tự',
                  },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Vui lòng mô tả chi tiết lý do từ chối để người đăng có thể điều chỉnh..."
                  maxLength={500}
                  showCount
                />
              </Form.Item>
            )}
          </Form>
        </div>
      ),
    },
  ];

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (data) {
        if (values.decision === 'Approve') {
          onApprove(data);
          message.success('Đã duyệt tin tức thành công!');
        } else {
          onReject(data, values.rejectedReason);
          message.success('Đã từ chối tin tức với lý do được cung cấp!');
        }
        form.resetFields();
        setDecision('Approve');
        onClose();
      }
    } catch (error) {
      console.error('Form validation error:', error);
      message.error('Vui lòng kiểm tra lại thông tin!');
    }
  };

  const handleClose = () => {
    form.resetFields();
    setDecision('Approve');
    onClose();
  };

  return (
    <Drawer
      title="Duyệt tin tức"
      width={900}
      open={visible}
      onClose={handleClose}
      footer={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button onClick={handleClose}>Đóng</Button>
          <Space>
            <Button
              danger
              onClick={() => {
                form.setFieldsValue({ decision: 'Reject' });
                setDecision('Reject');
              }}
            >
              Từ chối
            </Button>
            <Button type="primary" onClick={handleSubmit}>
              Xác nhận quyết định
            </Button>
          </Space>
        </div>
      }
    >
      {data && <Tabs defaultActiveKey="1" items={TabMenu} />}
    </Drawer>
  );
};

export default NewsApprovalFormDrawer;
