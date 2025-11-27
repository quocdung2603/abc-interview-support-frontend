import React, { useEffect, useState } from 'react';
import { Drawer, Button, Table, Tag, Input, Select, Space } from 'antd';
import { Question, Field, Topic, Level, QuestionType } from '@abc-interview-support-frontend/types';
import { questionService } from '@abc-interview-support-frontend/services';

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
  const [searchText, setSearchText] = useState('');
  const [questionList, setQuestionList] = useState<Question[]>([]); // This would be fetched from an API in a real app
  const [selectedField, setSelectedField] = useState<number | undefined>();
  const [selectedTopic, setSelectedTopic] = useState<number | undefined>();
  const [selectedLevel, setSelectedLevel] = useState<number | undefined>();

  const filteredQuestions = questionList.filter(question => {
    const matchesSearch = question.questionContent.toLowerCase().includes(searchText.toLowerCase());
    const matchesField = !selectedField || question.fieldId === selectedField;
    const matchesTopic = !selectedTopic || question.topicId === selectedTopic;
    const matchesLevel = !selectedLevel || question.levelId === selectedLevel;

    return matchesSearch && matchesField && matchesTopic && matchesLevel;
  });

  const getAllQuestion = async () => {
    try {
      const res = await questionService.getAllQuestions();
      setQuestionList(res.content || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestionList([]);
    }
  }

  useEffect(() => {
    getAllQuestion();
  }, [])

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
    {
      title: 'Hành động',
      key: 'action',
      render: (record: Question) => (
        <Button type="primary" onClick={() => onConfirm(record)}>
          Chọn
        </Button>
      ),
    },
  ];

  return (
    <Drawer
      title="Chọn câu hỏi từ ngân hàng"
      width={900}
      placement='left'
      push={false}
      mask={false}
      zIndex={1002}
      open={visible}
      onClose={onClose}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose}>Đóng</Button>
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
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
      />
    </Drawer>
  );
};

export default QuestionListDrawerForm;