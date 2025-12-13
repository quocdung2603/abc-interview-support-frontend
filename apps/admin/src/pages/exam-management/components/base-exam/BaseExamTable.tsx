import React from 'react';
import { Table, Button, Space, Tooltip, Tag } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { Exam, Field, Level, Topic } from '@abc-interview-support-frontend/types';

interface BaseExamTableProps {
  data: Exam[];
  onView: (exam: Exam) => void;
  fields: Field[];
  topics: Topic[];
  levels: Level[];
}

const BaseExamTable: React.FC<BaseExamTableProps> = ({ data, onView, fields, topics, levels }) => {
  const getFieldName = (fieldId: number) => {
    const field = fields.find(f => f.id === fieldId);
    return field ? field.name : 'N/A';
  };

  const getTopicName = (topicId: number) => {
    const topic = topics.find(t => t.id === topicId);
    return topic ? topic.name : 'N/A';
  };

  const getLevelName = (levelId: number) => {
    const level = levels.find(l => l.id === levelId);
    return level ? level.name : 'N/A';
  };
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
      title: 'Lĩnh vực',
      dataIndex: 'fieldId',
      key: 'fieldId',
      render: (fieldId: number) => getFieldName(fieldId),
    },
    {
      title: 'Chủ đề',
      dataIndex: 'topicIds',
      key: 'topicIds',
      render: (topicIds: number[]) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {topicIds?.map(topicId => (
            <Tag key={topicId} color="blue">
              {getTopicName(topicId)}
            </Tag>
          )) || 'N/A'}
        </div>
      ),
    },
    {
      title: 'Cấp độ',
      dataIndex: 'levelId',
      key: 'levelId',
      render: (levelId: number) => getLevelName(levelId),
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

export default BaseExamTable;
