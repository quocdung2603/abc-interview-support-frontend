import { Table, Button, Space, Popconfirm, Tag } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  LikeOutlined,
  ReadOutlined,
} from '@ant-design/icons';
import { News } from '@abc-interview-support-frontend/types';
import TrendNewsStatusTag from './TrendNewsStatusTag';

interface TrendNewsTableProps {
  data: News[];
  onEdit: (news: News) => void;
  onDelete: (id: number) => void;
  onPreview: (news: News) => void;
}

const TrendNewsTable: React.FC<TrendNewsTableProps> = ({
  data,
  onEdit,
  onDelete,
  onPreview,
}) => {
  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (title: string, record: News) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: '4px' }}>#{record.id}: {title}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.content && record.content.length > 80
              ? `${record.content.substring(0, 80)}...`
              : record.content}
          </div>
        </div>
      ),
    },
    {
      title: 'Loại tin tức',
      dataIndex: 'newsType',
      key: 'newsType',
      width: 120,
      render: (newsType: string) => {
        const typeMap = {
          NEWS: { color: 'blue', text: 'Xu hướng' },
          RECRUITMENT: { color: 'green', text: 'Tuyển dụng' },
        };
        const config = typeMap[newsType as keyof typeof typeMap] || {
          color: 'default',
          text: newsType,
        };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: News['status']) => (
        <TrendNewsStatusTag status={status} />
      ),
    },
    {
      title: 'Thống kê',
      key: 'stats',
      width: 100,
      render: (record: News) => (
        <Space direction="vertical" size={0} style={{ fontSize: '12px' }}>
          <Space size={8}>
            <LikeOutlined />
            <span>{record.usefulVote || 0}</span>
          </Space>
          <Space size={8}>
            <ReadOutlined />
            <span>{record.interestVote || 0}</span>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
      render: (date: string | Date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: News) => (
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
