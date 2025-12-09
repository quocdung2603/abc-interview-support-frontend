import React from 'react';
import { Table, Tag, Button, Tooltip } from 'antd';
import { EyeOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Question,
  Field,
  Topic,
  Level,
} from '@abc-interview-support-frontend/types';

interface QuestionListTableProps {
  questions: Question[];
  selectedQuestionIds: number[];
  fields: Field[];
  topics: Topic[];
  levels: Level[];
  onAddQuestion?: (question: Question) => void;
  onCompareQuestions?: (question1: Question, question2: Question) => void;
  loading?: boolean;
  mode?: 'add' | 'compare';
}

const QuestionListTable: React.FC<QuestionListTableProps> = ({
  questions,
  selectedQuestionIds,
  fields,
  topics,
  levels,
  onAddQuestion,
  onCompareQuestions,
  loading = false,
  mode = 'add',
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
        return 'orange';
      case 'APPROVED':
        return 'green';
      case 'REJECTED':
        return 'red';
      default:
        return 'default';
    }
  };

  const handleAddQuestion = (question: Question) => {
    if (onAddQuestion) {
      onAddQuestion(question);
    }
  };

  const handleCompareQuestions = (question: Question) => {
    // For compare mode, we need to select two questions
    // This is a simplified implementation - in real app, you'd have selection logic
    if (onCompareQuestions && selectedQuestionIds.length === 1) {
      const selectedQuestion = questions.find(q => q.id === selectedQuestionIds[0]);
      if (selectedQuestion) {
        onCompareQuestions(selectedQuestion, question);
      }
    }
  };

  const columns = [
    {
      title: 'Nội dung câu hỏi',
      dataIndex: 'questionContent',
      key: 'questionContent',
      width: '30%',
      render: (content: string) => (
        <div
          style={{
            maxWidth: '300px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {content}
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
      title: 'Chủ đề',
      dataIndex: 'topicId',
      key: 'topicId',
      render: (topicId: number) => (
        <Tag color="green">{getTopicName(topicId)}</Tag>
      ),
    },
    {
      title: 'Mức độ',
      dataIndex: 'levelId',
      key: 'levelId',
      render: (levelId: number) => (
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
      render: (record: Question) => {
        if (mode === 'compare') {
          return (
            <Tooltip title="So sánh câu hỏi">
              <Button
                type="default"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => handleCompareQuestions(record)}
              >
                So sánh
              </Button>
            </Tooltip>
          );
        } else {
          return (
            <Tooltip title="Thêm vào bài kiểm tra">
              <Button
                type="primary"
                size="small"
                icon={<PlusOutlined />}
                onClick={() => handleAddQuestion(record)}
                disabled={selectedQuestionIds.includes(record.id)}
              >
                Thêm
              </Button>
            </Tooltip>
          );
        }
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={questions}
      rowKey="id"
      loading={loading}
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
