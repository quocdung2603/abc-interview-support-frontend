import React from 'react';
import { Table, Button, Tag, Space } from 'antd';
import StatusTag from './StatusTag';

interface ExamsTableProps {
  examList: any[];
  onEdit: (examId: string) => void;
  onView: (exam: any) => void;
  onStatusChange: (examId: string, newStatus: string) => void;
}

const ExamsTable: React.FC<ExamsTableProps> = ({
  examList,
  onEdit,
  onView,
  onStatusChange,
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
        <Space>
          <Button onClick={() => onEdit(record.id)}>Sửa</Button>
          <Button onClick={() => onView(record)}>Xem</Button>
          {record.status === 'draft' && (
            <Button
              type="primary"
              onClick={() => onStatusChange(record.id, 'published')}
            >
              Công bố
            </Button>
          )}
          {record.status === 'published' && (
            <Button danger onClick={() => onStatusChange(record.id, 'closed')}>
              Kết thúc
            </Button>
          )}
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
