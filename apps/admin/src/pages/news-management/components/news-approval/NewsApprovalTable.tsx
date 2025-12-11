import React from 'react';
import { Table, Button, Space, Tooltip, Tag } from 'antd';
import {
  EyeOutlined,
} from '@ant-design/icons';
import { NewsItem, Field } from '@abc-interview-support-frontend/types';

interface TableProps {
  dataList: NewsItem[];
  onPreview: (data: NewsItem) => void;
  fields: Field[];
}

const NewsApprovalTable: React.FC<TableProps> = ({
  dataList,
  onPreview,
  fields,
}) => {
  const getFieldName = (fieldId?: number) => {
    if (!fieldId) return 'N/A';
    const field = fields.find((f) => f.id === fieldId);
    return field?.name || 'N/A';
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
      case 'NEWS':
        return 'Xu hướng';
      case 'RECRUITMENT':
        return 'Tuyển dụng';
      default:
        return newsType;
    }
  };

  const getNewsTypeColor = (newsType: string) => {
    switch (newsType) {
      case 'NEWS':
        return '#1890ff';
      case 'RECRUITMENT':
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
      render: (title: string, record: NewsItem) => (
        <div style={{ fontWeight: 'bold', maxWidth: '300px' }}>
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            #{record.id}: {title}
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
      render: (fieldId: number) => (
        <Tag color="blue">{getFieldName(fieldId)}</Tag>
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
      render: (record: NewsItem) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => onPreview(record)}
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
      rowKey="id"
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
