import { Drawer, Typography, Image, Tag, Space, Divider, Button } from 'antd';
import {
  EditOutlined,
  CalendarOutlined,
  UserOutlined,
  EyeOutlined,
  LikeOutlined,
} from '@ant-design/icons';
import { TrendNews } from './types';
import TrendNewsStatusTag from './TrendNewsStatusTag';

interface TrendNewsPreviewDrawerProps {
  news: TrendNews | null;
  visible: boolean;
  onClose: () => void;
  onEdit: (news: TrendNews) => void;
}

const { Title, Paragraph, Text } = Typography;

const TrendNewsPreviewDrawer: React.FC<TrendNewsPreviewDrawerProps> = ({
  news,
  visible,
  onClose,
  onEdit,
}) => {
  if (!news) return null;

  const categoryMap = {
    technology: 'Công nghệ',
    career: 'Sự nghiệp',
    interview: 'Phỏng vấn',
    skills: 'Kỹ năng',
    industry: 'Ngành nghề',
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
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEdit(news)}
            size="small"
          >
            Chỉnh sửa
          </Button>
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
        {/* Featured Image */}
        {news.featuredImage && (
          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <Image
              src={news.featuredImage}
              alt={news.title}
              style={{
                maxWidth: '100%',
                maxHeight: '300px',
                borderRadius: '8px',
                objectFit: 'cover',
              }}
              fallback="/placeholder-news.jpg"
            />
          </div>
        )}

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
              {categoryMap[news.category as keyof typeof categoryMap] ||
                news.category}
            </Tag>
            {news.isFeature && <Tag color="gold">Nổi bật</Tag>}
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
              <Text type="secondary">{news.author.name}</Text>
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
                <EyeOutlined style={{ color: 'var(--color-text-secondary)' }} />
                <Text type="secondary">{news.viewCount || 0} lượt xem</Text>
              </Space>
              <Space>
                <LikeOutlined
                  style={{ color: 'var(--color-text-secondary)' }}
                />
                <Text type="secondary">{news.likeCount || 0} lượt thích</Text>
              </Space>
            </Space>
          </Space>
        </div>

        {/* Summary */}
        {news.summary && (
          <>
            <Title level={4}>Tóm tắt</Title>
            <Paragraph
              style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: 'var(--color-text-secondary)',
                fontStyle: 'italic',
                marginBottom: '24px',
              }}
            >
              {news.summary}
            </Paragraph>
          </>
        )}

        <Divider />

        {/* Content */}
        <Title level={4}>Nội dung</Title>
        <div
          style={{
            fontSize: '15px',
            lineHeight: '1.8',
            color: 'var(--color-text-primary)',
            marginBottom: '24px',
          }}
          dangerouslySetInnerHTML={{ __html: news.content }}
        />

        {/* Tags */}
        {news.tags && news.tags.length > 0 && (
          <>
            <Divider />
            <Title level={5}>Thẻ</Title>
            <Space wrap>
              {news.tags.map((tag, index) => (
                <Tag key={index} style={{ marginBottom: '8px' }}>
                  #{tag}
                </Tag>
              ))}
            </Space>
          </>
        )}

        {/* SEO Info */}
        {(news.seo?.metaTitle || news.seo?.metaDescription) && (
          <>
            <Divider />
            <Title level={5}>Thông tin SEO</Title>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              {news.seo.metaTitle && (
                <div>
                  <Text strong>Meta Title: </Text>
                  <Text>{news.seo.metaTitle}</Text>
                </div>
              )}
              {news.seo.metaDescription && (
                <div>
                  <Text strong>Meta Description: </Text>
                  <Text>{news.seo.metaDescription}</Text>
                </div>
              )}
              {news.seo.keywords && news.seo.keywords.length > 0 && (
                <div>
                  <Text strong>Keywords: </Text>
                  <Text>{news.seo.keywords.join(', ')}</Text>
                </div>
              )}
            </Space>
          </>
        )}
      </div>
    </Drawer>
  );
};

export default TrendNewsPreviewDrawer;
