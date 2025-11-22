import React from 'react';
import { Table, Tag, Button, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  Question,
  Field,
  Topic,
  Level,
} from '@abc-interview-support-frontend/types';

interface QuestionListTableProps {
  questions: Question[];
  selectedQuestionIds: string[];
  fields: Field[];
  topics: Topic[];
  levels: Level[];
  onAddQuestion: (question: Question) => void;
}

const QuestionListTable: React.FC<QuestionListTableProps> = ({
  questions,
  selectedQuestionIds,
  fields,
  topics,
  levels,
  onAddQuestion,
}) => {
  const getFieldName = (fieldId: string) => {
    const field = fields.find((f) => f.id === fieldId);
    return field?.name || 'N/A';
  };

  const getTopicName = (topicId: string) => {
    const topic = topics.find((t) => t.id === topicId);
    return topic?.name || 'N/A';
  };

  const getLevelName = (levelId: string) => {
    const level = levels.find((l) => l.id === levelId);
    return level?.name || 'N/A';
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
        return 'orange';
      case 'Approved':
        return 'green';
      case 'Rejected':
        return 'red';
      default:
        return 'default';
    }
  };

  const handleAddQuestion = (question: Question) => {
    onAddQuestion(question);
  };

  const columns = [
    {
      title: 'Nội dung câu hỏi',
      dataIndex: 'questionTitle',
      key: 'questionTitle',
      width: '30%',
      render: (title: string) => (
        <div
          style={{
            maxWidth: '300px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
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
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
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
      title: 'Thao tác',
      key: 'action',
      render: (record: Question) => (
        <Tooltip title="Thêm vào bài kiểm tra">
          <Button
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => handleAddQuestion(record)}
            disabled={selectedQuestionIds.includes(record.questionId)}
          >
            Thêm
          </Button>
        </Tooltip>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={questions}
      rowKey="questionId"
      pagination={{
        total: questions.length,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} của ${total} câu hỏi`,
      }}
      scroll={{ y: 400 }}
    />
  );
};

export default QuestionListTable;
