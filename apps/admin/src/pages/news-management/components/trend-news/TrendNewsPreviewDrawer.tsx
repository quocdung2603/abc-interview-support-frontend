import React, { useState, useEffect } from 'react';
import { Drawer, Card, Tag, Typography, Spin, message } from 'antd';
import { News, Field } from '@abc-interview-support-frontend/types';
import { newsService } from '@abc-interview-support-frontend/services';

const { Title, Paragraph, Text } = Typography;

interface PreviewDrawerProps {
  visible: boolean;
  onClose: () => void;
  newsId: number | null;
  fields: Field[];
}

const TrendNewsPreviewDrawer: React.FC<PreviewDrawerProps> = ({
  visible,
  onClose,
  newsId,
  fields,
}) => {
  const [newsData, setNewsData] = useState<News | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && newsId) {
      fetchNewsDetail(newsId);
    } else {
      setNewsData(null);
    }
  }, [visible, newsId]);

  const fetchNewsDetail = async (id: number) => {
    try {
      setLoading(true);
      const response = await newsService.getNewById(id);
      setNewsData(response);
    } catch (error) {
      console.error('Error fetching news detail:', error);
      message.error('Không thể tải chi tiết tin tức');
      setNewsData(null);
    } finally {
      setLoading(false);
    }
  };
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFieldName = (fieldId?: number) => {
    if (!fieldId) return 'N/A';
    const field = fields.find((f) => f.id === fieldId);
    return field?.name || 'N/A';
  };

  return (
    <Drawer
      title="Chi tiết tin tức xu hướng"
      width={800}
      open={visible}
      onClose={onClose}
    >
      {loading ? (
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
              <Tag color="blue">{getFieldName(newsData.fieldId)}</Tag>
              <Tag color="purple">Xu hướng</Tag>
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
                <Text strong>Người tạo:</Text> User {newsData.userId}
              </div>
              <div>
                <Text strong>Loại tin tức:</Text>{' '}
                <Tag color="orange">
                  {newsData.newsType === 'NEWS' ? 'Xu hướng' : 'Tuyển dụng'}
                </Tag>
              </div>
              <div>
                <Text strong>Lĩnh vực:</Text>{' '}
                <Tag color="blue">{getFieldName(newsData.fieldId)}</Tag>
              </div>
              <div>
                <Text strong>Ngày tạo:</Text>{' '}
                {formatDate(newsData.createdAt)}
              </div>
              {newsData.publishedAt && (
                <div>
                  <Text strong>Ngày xuất bản:</Text>{' '}
                  {formatDate(newsData.publishedAt)}
                </div>
              )}
              {newsData.expiredAt && (
                <div>
                  <Text strong>Ngày hết hạn:</Text>{' '}
                  {formatDate(newsData.expiredAt)}
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
            </div>
          </Card>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Text>Không có dữ liệu để hiển thị</Text>
        </div>
      )}
    </Drawer>
  );
};

export default TrendNewsPreviewDrawer;
