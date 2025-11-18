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
    const field = fields.find((f) => f.id === fieldId);
    return field?.fieldName || 'N/A';
  };

  const getTopicName = (topicId: string) => {
    const topic = topics.find((t) => t.id === topicId);
    return topic?.topicName || 'N/A';
  };

  const getLevelName = (levelId: string) => {
    const level = levels.find((l) => l.id === levelId);
    return level?.levelName || 'N/A';
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ duyệt';
      case 'APPROVED':
        return 'Đã duyệt';
      case 'REJECTED':
        return 'Đã từ chối';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '#faad14';
      case 'APPROVED':
        return '#52c41a';
      case 'REJECTED':
        return '#ff4d4f';
      default:
        return '#d9d9d9';
    }
  };

  const columns = [
    {
      title: 'Nội dung câu hỏi',
      dataIndex: 'questionContent',
      key: 'questionContent',
      render: (content: string) => (
        <div style={{ maxWidth: '150px' }}>
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
      title: 'Lĩnh vực',
      dataIndex: 'fieldId',
      key: 'fieldId',
      render: (fieldId: number) => (
        <Tag color="blue" style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getFieldName(fieldId.toString())}</Tag>
      ),
    },
    {
      title: 'Chủ đề',
      dataIndex: 'topicId',
      key: 'topicId',
      render: (topicId: number) => (
        <Tag color="green" style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getTopicName(topicId.toString())}</Tag>
      ),
    },
    {
      title: 'Mức độ',
      dataIndex: 'levelId',
      key: 'levelId',
      render: (levelId: number) => (
        <Tag color="orange" style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getLevelName(levelId.toString())}</Tag>
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
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
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
      rowKey="id"
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
