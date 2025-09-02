import React from 'react';
import { Table, Button, Space, Tooltip, Tag } from 'antd';
import {
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { News, Field, Topic } from '@abc-interview-support-frontend/types';

interface TableProps {
  dataList: News[];
  onPreview: (data: News) => void;
  onApprove: (data: News) => void;
  fields: Field[];
  topics: Topic[];
}

const NewsApprovalTable: React.FC<TableProps> = ({
  dataList,
  onPreview,
  onApprove,
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'Chờ duyệt';
      case 'Approve':
        return 'Đã duyệt';
      case 'Reject':
        return 'Đã từ chối';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return '#faad14';
      case 'Approve':
        return '#52c41a';
      case 'Reject':
        return '#ff4d4f';
      default:
        return '#d9d9d9';
    }
  };

  const getNewsTypeText = (newsType: string) => {
    switch (newsType) {
      case 'trend':
        return 'Xu hướng';
      case 'recruitment':
        return 'Tuyển dụng';
      default:
        return newsType;
    }
  };

  const getNewsTypeColor = (newsType: string) => {
    switch (newsType) {
      case 'trend':
        return '#1890ff';
      case 'recruitment':
        return '#722ed1';
      default:
        return '#d9d9d9';
    }
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
      title: 'Loại tin tức',
      dataIndex: 'newsType',
      key: 'newsType',
      render: (newsType: string) => (
        <Tag color={getNewsTypeColor(newsType)}>
          {getNewsTypeText(newsType)}
        </Tag>
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
      title: 'Địa điểm',
      dataIndex: 'location',
      key: 'location',
      render: (location?: string) => (
        <Tag color="orange">{location || 'Toàn quốc'}</Tag>
      ),
    },
    {
      title: 'Người đăng',
      dataIndex: 'userId',
      key: 'userId',
      render: (userId: string) => <span>User #{userId}</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span
          style={{
            color: getStatusColor(status),
            fontWeight: 'bold',
          }}
        >
          {getStatusText(status)}
        </span>
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
          {record.status === 'Pending' && (
            <Tooltip title="Duyệt tin tức">
              <Button
                type="text"
                style={{ color: '#52c41a' }}
                icon={<CheckCircleOutlined />}
                size="small"
                onClick={() => onApprove(record)}
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

export default NewsApprovalTable;
