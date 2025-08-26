import { Table, Button, Space, Popconfirm, Image, Tag } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  LikeOutlined,
  ReadOutlined,
} from '@ant-design/icons';
import { TrendNews } from './types';
import TrendNewsStatusTag from './TrendNewsStatusTag';

interface TrendNewsTableProps {
  data: TrendNews[];
  loading: boolean;
  onEdit: (news: TrendNews) => void;
  onDelete: (id: string) => void;
  onPreview: (news: TrendNews) => void;
}

const TrendNewsTable: React.FC<TrendNewsTableProps> = ({
  data,
  loading,
  onEdit,
  onDelete,
  onPreview,
}) => {
  const columns = [
    {
      title: 'Ảnh đại diện',
      dataIndex: 'featuredImage',
      key: 'featuredImage',
      width: 100,
      render: (image: string) => (
        <Image
          width={50}
          height={50}
          src={image || '/placeholder-news.jpg'}
          alt="Featured"
          style={{ borderRadius: '6px', objectFit: 'cover' }}
          fallback="/placeholder-news.jpg"
        />
      ),
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (title: string, record: TrendNews) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: '4px' }}>{title}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.summary && record.summary.length > 80
              ? `${record.summary.substring(0, 80)}...`
              : record.summary}
          </div>
        </div>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: string) => {
        const categoryMap = {
          technology: { color: 'blue', text: 'Công nghệ' },
          career: { color: 'green', text: 'Sự nghiệp' },
          interview: { color: 'orange', text: 'Phỏng vấn' },
          skills: { color: 'purple', text: 'Kỹ năng' },
          industry: { color: 'cyan', text: 'Ngành nghề' },
        };
        const config = categoryMap[category as keyof typeof categoryMap] || {
          color: 'default',
          text: category,
        };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      width: 120,
      render: (tags: string[]) => (
        <Space wrap size={[4, 4]}>
          {tags?.slice(0, 3).map((tag, index) => (
            <Tag key={index} style={{ fontSize: '11px' }}>
              {tag}
            </Tag>
          ))}
          {tags && tags.length > 3 && (
            <Tag style={{ fontSize: '11px' }}>+{tags.length - 3}</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Tác giả',
      dataIndex: 'author',
      key: 'author',
      width: 120,
      render: (author: { name: string; avatar?: string }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {author.avatar && (
            <Image
              width={24}
              height={24}
              src={author.avatar}
              alt={author.name}
              style={{ borderRadius: '50%' }}
              fallback="/default-avatar.png"
            />
          )}
          <span>{author.name}</span>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: TrendNews['status']) => (
        <TrendNewsStatusTag status={status} />
      ),
    },
    {
      title: 'Thống kê',
      key: 'stats',
      width: 100,
      render: (record: TrendNews) => (
        <Space direction="vertical" size={0} style={{ fontSize: '12px' }}>
          <Space size={8}>
            <ReadOutlined />
            <span>{record.viewCount || 0}</span>
          </Space>
          <Space size={8}>
            <LikeOutlined />
            <span>{record.likeCount || 0}</span>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: TrendNews) => (
        <Space size="small">
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => onPreview(record)}
            title="Xem trước"
          />
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => onEdit(record)}
            title="Chỉnh sửa"
          />
          <Popconfirm
            title="Xóa tin tức"
            description="Bạn có chắc chắn muốn xóa tin tức này?"
            onConfirm={() => onDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okType="danger"
          >
            <Button icon={<DeleteOutlined />} size="small" danger title="Xóa" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} của ${total} tin tức`,
      }}
      scroll={{ x: 1200 }}
      style={{
        background: 'white',
        borderRadius: 'var(--border-radius-lg)',
        overflow: 'hidden',
      }}
    />
  );
};

export default TrendNewsTable;
