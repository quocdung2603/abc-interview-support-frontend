import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Table,
  Button,
  Tag,
  message,
} from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import {
  Question,
  Field,
  Topic,
  Level,
  QuestionType,
} from '@abc-interview-support-frontend/types';
import { questionService } from '@abc-interview-support-frontend/services';
import QuestionComparisonModal from './QuestionComparisonModal';

interface CompareDrawerProps {
  visible: boolean;
  onClose: () => void;
  currentQuestion: Question | null;
  fields: Field[];
  topics: Topic[];
  levels: Level[];
  questionTypes: QuestionType[];
}

const QuestionApprovalCompareDrawer: React.FC<CompareDrawerProps> = ({
  visible,
  onClose,
  currentQuestion,
  fields,
  topics,
  levels,
  questionTypes,
}) => {
  const [similarQuestions, setSimilarQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCompareQuestion, setSelectedCompareQuestion] = useState<Question | null>(null);

  useEffect(() => {
    const fetchSimilarQuestions = async () => {
      if (currentQuestion && visible) {
        setLoading(true);
        try {
          const res = await questionService.getAllQuestions();
          const allQuestions = (res.content as Question[]) || [];
          const filteredQuestions = allQuestions.filter(q =>
            q.status === 'APPROVED' &&
            q.fieldId === currentQuestion.fieldId &&
            q.topicId === currentQuestion.topicId &&
            q.levelId === currentQuestion.levelId &&
            q.questionTypeId === currentQuestion.questionTypeId &&
            q.id !== currentQuestion.id
          );
          setSimilarQuestions(filteredQuestions);
        } catch (error) {
          console.error('Error fetching similar questions:', error);
          message.error('Không thể tải danh sách câu hỏi tương tự');
          setSimilarQuestions([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSimilarQuestions();
  }, [currentQuestion, visible]);

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

  const handleCompare = (question: Question) => {
    setSelectedCompareQuestion(question);
    setModalVisible(true);
  };

  const columns = [
    {
      title: 'Nội dung câu hỏi',
      dataIndex: 'questionContent',
      key: 'questionContent',
      render: (content: string) => (
        <div style={{ maxWidth: '200px' }}>
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
      title: 'Loại câu hỏi',
      dataIndex: 'questionTypeId',
      key: 'questionTypeId',
      render: (questionTypeId: number) => (
        <Tag color="purple">{questionTypes.find(t => t.id === questionTypeId)?.name || 'N/A'}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (record: Question) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleCompare(record)}
        >
          So sánh
        </Button>
      ),
    },
  ];

  return (
    <>
      <Drawer
        title="Câu hỏi tương tự trong ngân hàng"
        width={900}
        open={visible}
        onClose={onClose}
        footer={null}
        placement='left'
        zIndex={1001}
        mask={false}
      >
        <Table
          columns={columns}
          dataSource={similarQuestions}
          rowKey="id"
          loading={loading}
          pagination={{
            total: similarQuestions.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} câu hỏi`,
          }}
        />
      </Drawer>

      <QuestionComparisonModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        currentQuestion={currentQuestion}
        compareQuestion={selectedCompareQuestion}
        fields={fields}
        topics={topics}
        levels={levels}
        questionTypes={questionTypes}
      />
    </>
  );
};

export default QuestionApprovalCompareDrawer;
