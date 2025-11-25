import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Tabs,
  Form,
  Select,
  Button,
  Space,
  message,
  Card,
  Tag,
  Typography,
  Spin,
  Descriptions,
} from 'antd';
import { NewsItem, Field, User } from '@abc-interview-support-frontend/types';
import { newsService, userService } from '@abc-interview-support-frontend/services';
import type { TabsProps } from 'antd';

const { Option } = Select;
const { Title, Paragraph, Text } = Typography;

interface PreviewDrawerProps {
  visible: boolean;
  onClose: () => void;
  newsId: number | null;
  userId: number | null;
  fields: Field[];
  onSuccess?: () => void;
}

const NewsApprovalFormDrawer: React.FC<PreviewDrawerProps> = ({
  visible,
  onClose,
  newsId,
  userId,
  fields,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [userData, setUserData] = useState<User | null>(null);
  const [newsData, setNewsData] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible && newsId && userId) {
      fetchData(newsId, userId);
    } else {
      setUserData(null);
      setNewsData(null);
    }
  }, [visible, newsId, userId]);

  const fetchData = async (newsId: number, userId: number) => {
    try {
      setLoading(true);
      const [newsResponse, userResponse] = await Promise.all([
        newsService.getNewById(newsId),
        userService.getUserById(userId.toString())
      ]);
      setNewsData(newsResponse);
      setUserData(userResponse.content || userResponse);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Không thể tải dữ liệu');
      setUserData(null);
      setNewsData(null);
    } finally {
      setLoading(false);
    }
  };

  const getFieldName = (fieldId?: number) => {
    if (!fieldId) return 'N/A';
    const field = fields.find((f) => f.id === fieldId);
    return field?.name || 'N/A';
  };

  const getNewsTypeText = (newsType: string) => {
    switch (newsType) {
      case 'NEWS':
        return 'Xu hướng';
      case 'RECRUITMENT':
        return 'Tuyển dụng';
      default:
        return newsType;
    }
  };

  const getNewsTypeColor = (newsType: string) => {
    switch (newsType) {
      case 'NEWS':
        return '#1890ff';
      case 'RECRUITMENT':
        return '#722ed1';
      default:
        return '#d9d9d9';
    }
  };

  const TabMenu: TabsProps['items'] = [
    {
      key: '1',
      label: 'Thông tin người đăng',
      children: loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : userData ? (
        <Card title="Thông tin người dùng" size="small">
          <Descriptions column={2}>
            <Descriptions.Item label="ID">{userData.id}</Descriptions.Item>
            <Descriptions.Item label="Họ tên">{userData.fullName || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Email">{userData.email || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Vai trò ID">{userData.roleId || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">{userData.status || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="ELO Rank">{userData.eloRank || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Điểm ELO">{userData.eloScore || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      ) : (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Text>Không có dữ liệu người dùng</Text>
        </div>
      ),
    },
    {
      key: '2',
      label: 'Chi tiết tin tức',
      children: loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : newsData ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Header */}
          <div>
            <Title level={3} style={{ marginBottom: '8px' }}>
              {newsData.title}
            </Title>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <Tag color={getNewsTypeColor(newsData.newsType)}>
                {getNewsTypeText(newsData.newsType)}
              </Tag>
              <Tag color="blue">{getFieldName(newsData.fieldId)}</Tag>
              {newsData.newsType === 'RECRUITMENT' && newsData.location && <Tag color="orange">{newsData.location}</Tag>}
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
              {newsData.content}
            </Paragraph>
          </Card>

          {/* Metadata */}
          <Card title="Thông tin bổ sung" size="small">
            <div style={{ display: 'grid', gap: '12px' }}>
              <div>
                <Text strong>ID tin tức:</Text> {newsData.id}
              </div>
              <div>
                <Text strong>Người đăng:</Text> User {newsData.userId}
              </div>
              <div>
                <Text strong>Loại tin tức:</Text>{' '}
                <Tag color={getNewsTypeColor(newsData.newsType)}>
                  {getNewsTypeText(newsData.newsType)}
                </Tag>
              </div>
              <div>
                <Text strong>Lĩnh vực:</Text>{' '}
                <Tag color="blue">{getFieldName(newsData.fieldId)}</Tag>
              </div>
              {newsData.newsType === 'RECRUITMENT' && newsData.location && (
                <div>
                  <Text strong>Địa điểm:</Text>{' '}
                  <Tag color="orange">{newsData.location}</Tag>
                </div>
              )}
              <div>
                <Text strong>Ngày tạo:</Text>{' '}
                {new Date(newsData.createdAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              {newsData.publishedAt && (
                <div>
                  <Text strong>Ngày xuất bản:</Text>{' '}
                  {new Date(newsData.publishedAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              )}
              {newsData.approvedBy && (
                <div>
                  <Text strong>Người duyệt:</Text> User {newsData.approvedBy}
                </div>
              )}
              {(newsData.usefulVote !== undefined || newsData.interestVote !== undefined) && (
                <div>
                  <Text strong>Đánh giá:</Text>{' '}
                  {newsData.usefulVote !== undefined && `Hữu ích: ${newsData.usefulVote}`}
                  {newsData.usefulVote !== undefined && newsData.interestVote !== undefined && ' | '}
                  {newsData.interestVote !== undefined && `Thú vị: ${newsData.interestVote}`}
                </div>
              )}
              {newsData.rejectReason && (
                <div>
                  <Text strong style={{ color: '#ff4d4f' }}>
                    Lý do từ chối:
                  </Text>
                  <div style={{ marginTop: '4px', color: '#ff4d4f' }}>
                    {newsData.rejectReason}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Text>Không có dữ liệu tin tức</Text>
        </div>
      ),
    },
    {
      key: '3',
      label: 'Xác nhận kiểm duyệt',
      children: (
        <div style={{ padding: '16px 0' }}>
          <Form
            form={form}
            layout="vertical"
            initialValues={{ decision: 'Approve' }}
          >
            <Form.Item
              label="Quyết định kiểm duyệt"
              name="decision"
              rules={[{ required: true, message: 'Vui lòng chọn quyết định' }]}
            >
              <Select placeholder="Chọn quyết định">
                <Option value="Approve">Đồng ý kiểm duyệt</Option>
                <Option value="Reject">Từ chối kiểm duyệt</Option>
              </Select>
            </Form.Item>
          </Form>
        </div>
      ),
    },
  ];

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!newsId) return;

      setSubmitting(true);

      if (values.decision === 'Approve') {
        await newsService.approveNews(newsId);
        message.success('Đã duyệt tin tức thành công!');
      } else {
        await newsService.rejectNews(newsId);
        message.success('Đã từ chối tin tức thành công!');
      }

      form.resetFields();
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
      message.error('Có lỗi xảy ra khi xử lý yêu cầu!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
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
              }}
            >
              Từ chối
            </Button>
            <Button type="primary" onClick={handleSubmit} loading={submitting}>
              Xác nhận quyết định
            </Button>
          </Space>
        </div>
      }
    >
      <Tabs defaultActiveKey="1" items={TabMenu} />
    </Drawer>
  );
};

export default NewsApprovalFormDrawer;
