import React, { useState } from 'react';
import { Drawer, Button, Table, Tag, Input, Select, Space } from 'antd';
import { Question, Field, Topic, Level, QuestionType } from '@abc-interview-support-frontend/types';

const { Option } = Select;

interface QuestionListDrawerFormProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (question: Question) => void;
  fields: Field[];
  topics: Topic[];
  levels: Level[];
  questionTypes: QuestionType[];
}

const QuestionListDrawerForm: React.FC<QuestionListDrawerFormProps> = ({
  visible,
  onClose,
  onConfirm,
  fields,
  topics,
  levels,
  questionTypes,
}) => {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedField, setSelectedField] = useState<number | undefined>();
  const [selectedTopic, setSelectedTopic] = useState<number | undefined>();
  const [selectedLevel, setSelectedLevel] = useState<number | undefined>();

  // Mock data for questions
  const mockQuestions: Question[] = [
    {
      id: 1,
      userId: 1,
      topicId: 1,
      fieldId: 1,
      levelId: 1,
      questionTypeId: 1,
      status: 'APPROVED',
      questionContent: 'React Hook useEffect được sử dụng để làm gì?',
      questionAnswer: 'Đáp án mẫu',
      language: 'vi',
      similarityScore: 0,
      usefulVote: 15,
      unusefulVote: 2,
      createdAt: new Date().toISOString(),
      fieldName: 'Frontend',
      levelName: 'Junior',
      topicName: 'React',
      questionTypeName: 'Multiple Choice',
    },
    {
      id: 2,
      userId: 1,
      topicId: 2,
      fieldId: 1,
      levelId: 2,
      questionTypeId: 2,
      status: 'APPROVED',
      questionContent: 'RESTful API là gì?',
      questionAnswer: 'Đáp án mẫu',
      language: 'vi',
      similarityScore: 0,
      usefulVote: 20,
      unusefulVote: 1,
      createdAt: new Date().toISOString(),
      fieldName: 'Backend',
      levelName: 'Mid',
      topicName: 'API',
      questionTypeName: 'Essay',
    },
  ];

  const filteredQuestions = mockQuestions.filter(question => {
    const matchesSearch = question.questionContent.toLowerCase().includes(searchText.toLowerCase());
    const matchesField = !selectedField || question.fieldId === selectedField;
    const matchesTopic = !selectedTopic || question.topicId === selectedTopic;
    const matchesLevel = !selectedLevel || question.levelId === selectedLevel;

    return matchesSearch && matchesField && matchesTopic && matchesLevel;
  });

  const columns = [
    {
      title: 'Câu hỏi',
      dataIndex: 'questionContent',
      key: 'questionContent',
      ellipsis: true,
    },
    {
      title: 'Lĩnh vực',
      dataIndex: 'fieldName',
      key: 'fieldName',
      render: (fieldName: string) => <Tag color="blue">{fieldName}</Tag>,
    },
    {
      title: 'Chủ đề',
      dataIndex: 'topicName',
      key: 'topicName',
      render: (topicName: string) => <Tag color="green">{topicName}</Tag>,
    },
    {
      title: 'Độ khó',
      dataIndex: 'levelName',
      key: 'levelName',
      render: (levelName: string) => <Tag color="orange">{levelName}</Tag>,
    },
    {
      title: 'Vote',
      key: 'votes',
      render: (record: Question) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#52c41a', fontWeight: 'bold' }}>
            +{record.usefulVote}
          </div>
          <div style={{ color: '#ff4d4f', fontSize: '12px' }}>
            -{record.unusefulVote}
          </div>
        </div>
      ),
    },
  ];

  const handleSelectQuestion = (question: Question) => {
    setSelectedQuestion(question);
  };

  const handleConfirm = () => {
    if (selectedQuestion) {
      onConfirm(selectedQuestion);
      onClose();
      setSelectedQuestion(null);
    }
  };

  return (
    <Drawer
      title="Chọn câu hỏi từ ngân hàng"
      width={900}
      open={visible}
      onClose={onClose}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={onClose}>Hủy</Button>
          <Button
            type="primary"
            onClick={handleConfirm}
            disabled={!selectedQuestion}
          >
            Chọn câu hỏi
          </Button>
        </div>
      }
    >
      <div style={{ marginBottom: 16 }}>
        <Space style={{ width: '100%', marginBottom: 16 }}>
          <Input
            placeholder="Tìm kiếm câu hỏi..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Select
            placeholder="Lĩnh vực"
            allowClear
            value={selectedField}
            onChange={setSelectedField}
            style={{ width: 120 }}
          >
            {fields.map(field => (
              <Option key={field.id} value={field.id}>{field.name}</Option>
            ))}
          </Select>
          <Select
            placeholder="Chủ đề"
            allowClear
            value={selectedTopic}
            onChange={setSelectedTopic}
            style={{ width: 120 }}
          >
            {topics.map(topic => (
              <Option key={topic.id} value={topic.id}>{topic.name}</Option>
            ))}
          </Select>
          <Select
            placeholder="Độ khó"
            allowClear
            value={selectedLevel}
            onChange={setSelectedLevel}
            style={{ width: 120 }}
          >
            {levels.map(level => (
              <Option key={level.id} value={level.id}>{level.name}</Option>
            ))}
          </Select>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredQuestions}
        rowKey="id"
        rowSelection={{
          type: 'radio',
          selectedRowKeys: selectedQuestion ? [selectedQuestion.id] : [],
          onChange: (_, selectedRows) => {
            if (selectedRows.length > 0) {
              handleSelectQuestion(selectedRows[0]);
            } else {
              setSelectedQuestion(null);
            }
          },
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
      />
    </Drawer>
  );
};

export default QuestionListDrawerForm;