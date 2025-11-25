import { Drawer, Typography, Tag, Space, Divider } from 'antd';
import {
  CalendarOutlined,
  UserOutlined,
  LikeOutlined,
} from '@ant-design/icons';
import { News } from '@abc-interview-support-frontend/types';
import TrendNewsStatusTag from './TrendNewsStatusTag';

interface TrendNewsPreviewDrawerProps {
  news: News | null;
  visible: boolean;
  onClose: () => void;
}

const { Title, Text } = Typography;

const TrendNewsPreviewDrawer: React.FC<TrendNewsPreviewDrawerProps> = ({
  news,
  visible,
  onClose,
}) => {
  if (!news) return null;

  const newsTypeMap = {
    NEWS: 'Xu hướng',
    RECRUITMENT: 'Tuyển dụng',
  };

  return (
    <Drawer
      title={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>Xem trước tin tức</span>
        </div>
      }
      width={1000}
      onClose={onClose}
      open={visible}
      styles={{
        body: {
          padding: 0,
        },
      }}
    >
      <div style={{ padding: '24px' }}>
        {/* Header Info */}
        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <TrendNewsStatusTag status={news.status} />
            <Tag color="blue">
              {newsTypeMap[news.newsType] || news.newsType}
            </Tag>
          </div>

          <Title
            level={2}
            style={{ marginBottom: '12px', color: 'var(--color-text-primary)' }}
          >
            {news.title}
          </Title>

          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            <Space>
              <UserOutlined style={{ color: 'var(--color-text-secondary)' }} />
              <Text type="secondary">User {news.userId}</Text>
            </Space>
            <Space>
              <CalendarOutlined
                style={{ color: 'var(--color-text-secondary)' }}
              />
              <Text type="secondary">
                {new Date(news.createdAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </Space>
            <Space size="large">
              <Space>
                <LikeOutlined
                  style={{ color: 'var(--color-text-secondary)' }}
                />
                <Text type="secondary">Hữu ích: {news.usefulVote || 0}</Text>
              </Space>
              <Space>
                <LikeOutlined
                  style={{ color: 'var(--color-text-secondary)' }}
                />
                <Text type="secondary">Thú vị: {news.interestVote || 0}</Text>
              </Space>
            </Space>
          </Space>
        </div>

        <Divider />

        {/* Content */}
        <Title level={4}>Nội dung</Title>
        <div
          style={{
            fontSize: '15px',
            lineHeight: '1.8',
            color: 'var(--color-text-primary)',
            marginBottom: '24px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {news.content}
        </div>

        {/* Additional Info */}
        <Divider />
        <Title level={5}>Thông tin bổ sung</Title>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div>
            <Text strong>ID: </Text>
            <Text>{news.id}</Text>
          </div>
          {news.fieldId && (
            <div>
              <Text strong>Lĩnh vực: </Text>
              <Text>Field {news.fieldId}</Text>
            </div>
          )}
          {news.publishedAt && (
            <div>
              <Text strong>Ngày xuất bản: </Text>
              <Text>
                {new Date(news.publishedAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </div>
          )}
          {news.expiredAt && (
            <div>
              <Text strong>Ngày hết hạn: </Text>
              <Text>
                {new Date(news.expiredAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </div>
          )}
          {news.approvedBy && (
            <div>
              <Text strong>Người duyệt: </Text>
              <Text>User {news.approvedBy}</Text>
            </div>
          )}
          {news.rejectReason && (
            <div>
              <Text strong style={{ color: '#ff4d4f' }}>Lý do từ chối: </Text>
              <Text style={{ color: '#ff4d4f' }}>{news.rejectReason}</Text>
            </div>
          )}
        </Space>
      </div>
    </Drawer>
  );
};

export default TrendNewsPreviewDrawer;
