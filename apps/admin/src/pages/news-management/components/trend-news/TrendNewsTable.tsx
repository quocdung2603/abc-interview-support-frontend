import React from 'react';
import { Table, Button, Space, Tooltip, Tag } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { News, Field, Topic } from '@abc-interview-support-frontend/types';

interface TableProps {
  dataList: News[];
  onPreview: (data: News) => void;
  onDelete: (newsId: string) => void;
  fields: Field[];
  topics: Topic[];
}

const TrendNewsTable: React.FC<TableProps> = ({
  dataList,
  onPreview,
  onDelete,
  fields,
  topics,
}) => {
  const getFieldName = (fieldId?: string) => {
    if (!fieldId) return 'N/A';
    const field = fields.find((f) => f.fieldId === fieldId);
    return field?.fieldName || 'N/A';
  };

  const getTopicName = (topicId?: string) => {
    if (!topicId) return 'N/A';
    const topic = topics.find((t) => t.topicId === topicId);
    return topic?.topicName || 'N/A';
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (title: string) => (
        <div style={{ fontWeight: 'bold', maxWidth: '300px' }}>
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </div>
        </div>
      ),
    },
    {
      title: 'Lĩnh vực',
      dataIndex: 'fieldId',
      key: 'fieldId',
      render: (fieldId: string) => (
        <Tag color="blue">{getFieldName(fieldId)}</Tag>
      ),
    },
    {
      title: 'Chủ đề',
      dataIndex: 'topicId',
      key: 'topicId',
      render: (topicId: string) => (
        <Tag color="green">{getTopicName(topicId)}</Tag>
      ),
    },
    {
      title: 'Người tạo',
      dataIndex: 'userId',
      key: 'userId',
      render: (userId: string) => <span>User #{userId}</span>,
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
      render: (record: News) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => onPreview(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa tin tức">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => onDelete(record.newsId)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={dataList}
      rowKey="newsId"
      pagination={{
        total: dataList.length,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} của ${total} tin tức`,
      }}
    />
  );
};

export default TrendNewsTable;
