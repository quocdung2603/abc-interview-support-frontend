import React from 'react';
import { Table, Button, Space, Tooltip, Tag } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
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
  fields: Field[];
  topics: Topic[];
  levels: Level[];
  questionTypes: QuestionType[];
}

const QuestionApprovalTable: React.FC<TableProps> = ({
  dataList,
  onPreview,
  fields,
  topics,
  levels,
  questionTypes,
}) => {
  const getFieldName = (fieldId: number) => {
    const field = fields.find((f) => f.id === fieldId);
    return field?.name || 'N/A';
  };

  const getTopicName = (topicId: number) => {
    const topic = topics.find((t) => t.id === topicId);
    return topic?.name || 'N/A';
  };

  const getLevelName = (levelId: number) => {
    const level = levels.find((l) => l.id === levelId);
    return level?.name || 'N/A';
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
      render: (content: string, record: any) => (
        <div style={{ maxWidth: '150px' }}>
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            #{record.id}: {content}
          </div>
        </div>
      ),
    },
    {
      title: 'Lĩnh vực',
      dataIndex: 'fieldId',
      key: 'fieldId',
      render: (fieldId: number) => (
        <Tag color="blue" style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getFieldName(fieldId)}</Tag>
      ),
    },
    {
      title: 'Chủ đề',
      dataIndex: 'topicId',
      key: 'topicId',
      render: (topicId: number) => (
        <Tag color="green" style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getTopicName(topicId)}</Tag>
      ),
    },
    {
      title: 'Mức độ',
      dataIndex: 'levelId',
      key: 'levelId',
      render: (levelId: number) => (
        <Tag color="orange" style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getLevelName(levelId)}</Tag>
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
          <Tooltip title="Kiểm duyệt">
            <Button
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
          `${range[0]}-${range[1]} của ${total} câu hỏi`,
      }}
    />
  );
};

export default QuestionApprovalTable;
