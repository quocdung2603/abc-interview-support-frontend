import React from 'react';
import { Table, Button, Tag, Space, Tooltip, Popconfirm, message } from 'antd';
import { EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import StatusTag from './StatusTag';
import { Examss } from './types';

interface ExamsTableProps {
  examList: Examss[];
  onEdit: (exam: Examss) => void;
  onPreview: (exam: Examss) => void;
  onDelete: (examId: string) => void;
}

const ExamsTable: React.FC<ExamsTableProps> = ({
  examList,
  onEdit,
  onPreview,
  onDelete,
}) => {
  const columns = [
    {
      title: 'Tên kỳ thi',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: any) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{title}</div>
          <div
            style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}
          >
            {record.position}
          </div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status} />,
    },
    {
      title: 'Thí sinh',
      dataIndex: 'candidates',
      key: 'candidates',
      render: (candidates: number) => (
        <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
          {candidates}
        </div>
      ),
    },
    {
      title: 'Chủ đề',
      dataIndex: 'topics',
      key: 'topics',
      render: (topics: string[]) => (
        <div>
          {topics.slice(0, 2).map((topic) => (
            <Tag key={topic}>{topic}</Tag>
          ))}
          {topics.length > 2 && <Tag>+{topics.length - 2}</Tag>}
        </div>
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
      render: (record: any) => (
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

  return (
    <Table
      columns={columns}
      dataSource={examList}
      rowKey="id"
      pagination={{
        total: examList.length,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} của ${total} kỳ thi`,
      }}
    />
  );
};

export default ExamsTable;
