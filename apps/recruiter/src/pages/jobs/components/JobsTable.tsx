import React from 'react';
import { Table, Button, Tag, Space, Popconfirm, Tooltip, message } from 'antd';
import {
  EditOutlined,
  EyeOutlined,
  CopyOutlined,
  DeleteOutlined,
  SendOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import JobStatusTag from './JobStatusTag';
import { JobPost } from './types';

interface JobsTableProps {
  jobPosts: JobPost[];
  selectedRowKeys: React.Key[];
  onSelectionChange: (newSelectedRowKeys: React.Key[]) => void;
  onPreview: (job: JobPost) => void;
  onSubmitForApproval: (jobId: string) => void;
  isVerified: boolean;
}

const JobsTable: React.FC<JobsTableProps> = ({
  jobPosts,
  selectedRowKeys,
  onSelectionChange,
  onPreview,
  onSubmitForApproval,
  isVerified,
}) => {
  const formatSalary = (min: number, max: number, currency: string) => {
    const formatNumber = (num: number) => {
      if (num >= 1000000) {
        return `${(num / 1000000).toFixed(0)}M`;
      }
      return num.toLocaleString();
    };

    return `${formatNumber(min)} - ${formatNumber(max)} ${currency}`;
  };

  const columns: ColumnsType<JobPost> = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (text: string, record: JobPost) => (
        <div>
          <div
            className="text-body"
            style={{ fontWeight: 500, marginBottom: '4px' }}
          >
            {text}
          </div>
          <div className="text-caption text-neutral-500">{record.position}</div>
        </div>
      ),
    },
    {
      title: 'Địa điểm',
      dataIndex: 'location',
      key: 'location',
      width: 120,
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: 'Mức lương',
      key: 'salary',
      width: 140,
      render: (_, record: JobPost) => (
        <div className="text-body-small">
          {formatSalary(
            record.salaryMin,
            record.salaryMax,
            record.salaryCurrency
          )}
        </div>
      ),
    },
    {
      title: 'Hạn nộp',
      dataIndex: 'deadline',
      key: 'deadline',
      width: 110,
      render: (text: string) => (
        <div className="text-body-small">
          {new Date(text).toLocaleDateString('vi-VN')}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: JobPost['status'], record: JobPost) => (
        <JobStatusTag
          status={status}
          rejectionReason={record.rejectionReason}
        />
      ),
    },
    {
      title: 'Cập nhật',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 110,
      render: (text: string) => (
        <div className="text-caption text-neutral-500">
          {new Date(text).toLocaleDateString('vi-VN')}
        </div>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 200,
      render: (_, record: JobPost) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => onPreview(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => message.info('Chuyển đến trang chỉnh sửa')}
            />
          </Tooltip>
          {record.status === 'draft' && (
            <Tooltip
              title={!isVerified ? 'Cần xác thực tài khoản' : 'Gửi duyệt'}
            >
              <Button
                type="text"
                icon={<SendOutlined />}
                size="small"
                disabled={!isVerified}
                onClick={() => onSubmitForApproval(record.id)}
              />
            </Tooltip>
          )}
          <Tooltip title="Sao chép">
            <Button
              type="text"
              icon={<CopyOutlined />}
              size="small"
              onClick={() => message.success('Đã tạo bản sao')}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa bài đăng này?"
              onConfirm={() => message.success('Đã xóa bài đăng')}
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectionChange,
    getCheckboxProps: (record: JobPost) => ({
      disabled: record.status !== 'draft',
    }),
  };

  return (
    <Table
      columns={columns}
      dataSource={jobPosts}
      rowKey="id"
      rowSelection={rowSelection}
      pagination={{
        total: jobPosts.length,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} của ${total} bài đăng`,
      }}
      scroll={{ x: 1200 }}
    />
  );
};

export default JobsTable;
