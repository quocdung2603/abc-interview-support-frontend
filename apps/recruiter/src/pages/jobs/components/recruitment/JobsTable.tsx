import React from 'react';
import { Table, Button, Tag, Space, Popconfirm, Tooltip, message } from 'antd';
import { EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import JobStatusTag from './JobStatusTag';
import { RecruitmentNews } from '@abc-interview-support-frontend/types';

interface JobsTableProps {
  jobPosts: RecruitmentNews[];
  selectedRowKeys: React.Key[];
  onSelectionChange: (newSelectedRowKeys: React.Key[]) => void;
  onPreview: (job: RecruitmentNews) => void;
  onEdit: (job: RecruitmentNews) => void;
  onDelete?: (jobId: number) => void;
}

const JobsTable: React.FC<JobsTableProps> = ({
  jobPosts,
  selectedRowKeys,
  onSelectionChange,
  onPreview,
  onEdit,
  onDelete,
}) => {
  const formatSalary = (salary: string) => {
    return salary || 'Thỏa thuận';
  };

  const columns: ColumnsType<RecruitmentNews> = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (text: string, record: RecruitmentNews) => (
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
      render: (_, record: RecruitmentNews) => (
        <div className="text-body-small">
          {formatSalary(record.salary || '')}
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
          {text ? new Date(text).toLocaleDateString('vi-VN') : 'Không giới hạn'}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: RecruitmentNews['status'], record: RecruitmentNews) => (
        <JobStatusTag
          status={status}
          rejectionReason={record.rejectReason}
        />
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 110,
      render: (text: string | Date) => (
        <div className="text-caption text-neutral-500">
          {new Date(text).toLocaleDateString('vi-VN')}
        </div>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 200,
      render: (_, record: RecruitmentNews) => (
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
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa bài đăng này?"
              onConfirm={() =>
                onDelete
                  ? onDelete(record.id)
                  : message.success('Đã xóa bài đăng')
              }
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
    getCheckboxProps: (record: RecruitmentNews) => ({
      disabled: record.status !== 'PENDING',
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
