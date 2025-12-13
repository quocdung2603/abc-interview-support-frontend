import React from 'react';
import { Table, Button, Space, Tooltip, Tag } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { RecruitmentNews, Field } from '@abc-interview-support-frontend/types';

interface TableProps {
  dataList: RecruitmentNews[];
  onPreview: (data: RecruitmentNews) => void;
  onDelete: (newsId: number) => void;
  fields: Field[];
}

const RecruitmentNewsTable: React.FC<TableProps> = ({
  dataList,
  onPreview,
  onDelete,
  fields,
}) => {
  const getFieldName = (fieldId?: number) => {
    if (!fieldId) return 'N/A';
    const field = fields.find((f) => f.id === fieldId);
    return field?.name || 'N/A';
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
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: Date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (record: RecruitmentNews) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => onPreview(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa tin tức">
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => onDelete(record.id)}
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
          `${range[0]}-${range[1]} của ${total} tin tuyển dụng`,
      }}
    />
  );
};

export default RecruitmentNewsTable;
