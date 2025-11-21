import React, { useState } from 'react';
import { Table, Button, Tag, Space, Tooltip } from 'antd';
import { EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Question, Field, Topic, Level } from '@abc-interview-support-frontend/types';
import QuestionDetailModal from './QuestionDetailModal';

interface QuestionTableProps {
  questions: Question[];
  fields: Field[];
  topics: Topic[];
  levels: Level[];
  onViewDetail: (question: Question) => void;
  onAddQuestion: (question: Question) => void;
  loading?: boolean;
}

const QuestionTable: React.FC<QuestionTableProps> = ({
  questions,
  fields,
  topics,
  levels,
  onViewDetail,
  onAddQuestion,
  loading = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Modal state
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  const handleViewDetail = (question: Question) => {
    setSelectedQuestion(question);
    setDetailModalVisible(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedQuestion(null);
  };

  const getFieldName = (fieldId: number) => {
    if (!Array.isArray(fields)) return 'N/A';
    const field = fields.find((f) => f.id === fieldId);
    return field?.fieldName || 'N/A';
  };

  const getTopicName = (topicId: number) => {
    if (!Array.isArray(topics)) return 'N/A';
    const topic = topics.find((t) => t.id === topicId);
    return topic?.topicName || 'N/A';
  };

  const getLevelName = (levelId: number) => {
    if (!Array.isArray(levels)) return 'N/A';
    const level = levels.find((l) => l.id === levelId);
    return level?.levelName || 'N/A';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'green';
      case 'PENDING':
        return 'orange';
      case 'REJECTED':
        return 'red';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'Câu hỏi',
      dataIndex: 'questionContent',
      key: 'questionContent',
      ellipsis: true,
      width: 200,
      render: (text: string, record: Question) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            ID: {record.id}
          </div>
        </div>
      ),
    },
    {
      title: 'Lĩnh vực',
      key: 'field',
      width: 100,
      render: (_: any, record: Question) => (
        <Tag color="blue">{getFieldName(record.fieldId)}</Tag>
      ),
    },
    {
      title: 'Chủ đề',
      key: 'topic',
      width: 80,
      render: (_: any, record: Question) => (
        <Tag color="green">{getTopicName(record.topicId)}</Tag>
      ),
    },
    {
      title: 'Độ khó',
      key: 'level',
      width: 80,
      render: (_: any, record: Question) => (
        <Tag color="orange">{getLevelName(record.levelId)}</Tag>
      ),
    },
    {
      title: 'Vote',
      key: 'votes',
      width: 80,
      render: (_: any, record: Question) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#52c41a', fontSize: '12px' }}>
            +{record.usefulVote || 0}
          </div>
          <div style={{ color: '#ff4d4f', fontSize: '12px' }}>
            -{record.unusefulVote || 0}
          </div>
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 80,
      render: (_: any, record: Question) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          <Tooltip title="Thêm câu hỏi">
            <Button
              type="text"
              icon={<PlusOutlined />}
              size="small"
              onClick={() => onAddQuestion(record)}
              style={{ color: '#52c41a' }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={questions}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize,
          total: questions.length,
          showSizeChanger: false,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} câu hỏi`,
          onChange: (page) => setCurrentPage(page),
        }}
        size="small"
        scroll={{ y: 400 }}
      />

      <QuestionDetailModal
        visible={detailModalVisible}
        onClose={handleCloseDetailModal}
        question={selectedQuestion}
      />
    </>
  );
};

export default QuestionTable;