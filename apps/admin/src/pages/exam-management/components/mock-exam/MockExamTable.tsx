import React from 'react';
import { Table, Button, Space, Tooltip, Tag } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Exam } from '@abc-interview-support-frontend/types';

interface MockExamTableProps {
  data: Exam[];
  onView: (exam: Exam) => void;
  onEdit: (exam: Exam) => void;
  onDelete: (examId: string) => void;
}

const MockExamTable: React.FC<MockExamTableProps> = ({
  data,
  onView,
  onEdit,
  onDelete,
}) => {
  const getExamTypeText = (examType: string) => {
    switch (examType) {
      case 'Virtual':
        return 'Bài kiểm tra ảo';
      case 'Recruiter':
        return 'Bài kiểm tra nhà tuyển dụng';
      default:
        return examType;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Active':
        return 'Đang hoạt động';
      case 'Inactive':
        return 'Không hoạt động';
      case 'Completed':
        return 'Đã hoàn thành';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'green';
      case 'Inactive':
        return 'orange';
      case 'Completed':
        return 'blue';
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
      width: '25%',
      render: (title: string) => (
        <div
          style={{
            maxWidth: '300px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </div>
      ),
    },
    {
      title: 'Loại bài kiểm tra',
      dataIndex: 'examType',
      key: 'examType',
      render: (examType: string) => (
        <Tag color={examType === 'Virtual' ? 'blue' : 'purple'}>
          {getExamTypeText(examType)}
        </Tag>
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
      render: (date: Date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (record: Exam) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => onView(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => onEdit(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="examId"
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
