import React from 'react';
import { Table, Button, Space, Tooltip, Tag } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import {
  Question,
  Field,
  Topic,
  Level,
  QuestionType,
} from '@abc-interview-support-frontend/types';

interface TableProps {
  dataList: Question[];
  onPreview: (data: Question) => void;
  onEdit: (data: Question) => void;
  fields: Field[];
  topics: Topic[];
  levels: Level[];
  questionTypes: QuestionType[];
}

const QuestionBankTable: React.FC<TableProps> = ({
  dataList,
  onPreview,
  onEdit,
  fields,
  topics,
  levels,
  questionTypes,
}) => {
  const getFieldName = (fieldId: string) => {
    const field = fields.find((f) => f.fieldId === fieldId);
    return field?.fieldName || 'N/A';
  };

  const getTopicName = (topicId: string) => {
    const topic = topics.find((t) => t.topicId === topicId);
    return topic?.topicName || 'N/A';
  };

  const getLevelName = (levelId: string) => {
    const level = levels.find((l) => l.levelId === levelId);
    return level?.levelName || 'N/A';
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'Chờ duyệt';
      case 'Approved':
        return 'Đã duyệt';
      case 'Rejected':
        return 'Đã từ chối';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return '#faad14';
      case 'Approved':
        return '#52c41a';
      case 'Rejected':
        return '#ff4d4f';
      default:
        return '#d9d9d9';
    }
  };

  const columns = [
    {
      title: 'Nội dung câu hỏi',
      dataIndex: 'questionTitle',
      key: 'questionTitle',
      render: (content: string) => (
        <div style={{ maxWidth: '300px' }}>
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {content}
          </div>
        </div>
      ),
    },
    {
      title: 'Question Variants',
      dataIndex: 'questionVariant',
      key: 'questionVariant',
      render: (variant: string) => <Tag color="geekblue">{variant}</Tag>,
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
      title: 'Mức độ',
      dataIndex: 'levelId',
      key: 'levelId',
      render: (levelId: string) => (
        <Tag color="orange">{getLevelName(levelId)}</Tag>
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
      title: 'Lượt vote',
      dataIndex: 'usefulVote',
      key: 'usefulVote',
      render: (usefulVote: number, record: Question) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#52c41a', fontWeight: 'bold' }}>
            +{usefulVote}
          </div>
          <div style={{ color: '#ff4d4f', fontSize: '12px' }}>
            -{record.unusefulVote}
          </div>
        </div>
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
      render: (record: Question) => (
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
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={dataList}
      rowKey="questionId"
      pagination={{
        total: dataList.length,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} của ${total} câu hỏi`,
      }}
    />
  );
};

export default QuestionBankTable;
