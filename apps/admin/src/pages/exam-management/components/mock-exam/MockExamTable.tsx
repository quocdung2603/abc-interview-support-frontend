import React from 'react';
import { Table, Button, Space, Tooltip, Tag } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import { Exam } from '@abc-interview-support-frontend/types';
import { useAuth } from '@abc-interview-support-frontend/sso-utils';

interface MockExamTableProps {
  data: Exam[];
  onView: (exam: Exam) => void;
  onEdit: (exam: Exam) => void;
}

const MockExamTable: React.FC<MockExamTableProps> = ({
  data,
  onView,
  onEdit,
}) => {
  const { user } = useAuth();
  const getStatusText = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'Bản nháp';
      case 'PUBLISHED':
        return 'Đã xuất bản';
      case 'INACTIVE':
        return 'Không hoạt động';
      case 'COMPLETED':
        return 'Đã hoàn thành';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'orange';
      case 'PUBLISHED':
        return 'blue';
      case 'INACTIVE':
        return 'red';
      case 'COMPLETED':
        return 'green';
      default:
        return 'default';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const columns = [
    {
      title: 'Tiêu đề bài kiểm tra',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: any) => (
        <div
          style={{
            maxWidth: '200px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          #{record.id}: {title}
        </div>
      ),
    },
    {
      title: 'Vị trí',
      dataIndex: 'position',
      key: 'position',
      render: (position: string) => position || 'N/A',
    },
    {
      title: 'Số câu hỏi',
      dataIndex: 'questionCount',
      key: 'questionCount',
      render: (count: number) => count,
    },
    {
      title: 'Thời gian',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: number) => formatDuration(duration),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (record: Exam) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => onView(record)}
            />
          </Tooltip>
          {user && record.userId === Number.parseInt(user.userId) && (
            <Tooltip title="Chỉnh sửa">
              <Button
                icon={<EditOutlined />}
                size="small"
                onClick={() => onEdit(record)}
              />
            </Tooltip>
          )}
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
        total: data.length,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} của ${total} bài kiểm tra`,
      }}
    />
  );
};

export default MockExamTable;
