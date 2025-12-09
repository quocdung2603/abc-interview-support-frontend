import React, { useState, useEffect } from 'react';
import { Drawer, Typography, message } from 'antd';
import { Question, Field, Topic, Level, QuestionType } from '@abc-interview-support-frontend/types';
import { questionService } from '@abc-interview-support-frontend/services';
import QuestionFilters from './question-list/QuestionFilters';
import QuestionTable from './question-list/QuestionTable';

const { Title } = Typography;

interface QuestionListDrawerFormProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (selectedQuestion: Question) => void;
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
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [selectedField, setSelectedField] = useState<number | undefined>();
  const [selectedTopic, setSelectedTopic] = useState<number | undefined>();
  const [selectedLevel, setSelectedLevel] = useState<number | undefined>();
  const [selectedQuestionType, setSelectedQuestionType] = useState<number | undefined>();
  const [searchText, setSearchText] = useState('');

  // Load questions from API
  useEffect(() => {
    const loadQuestions = async () => {
      if (!visible) return;

      try {
        setLoading(true);
        const response = await questionService.getAllQuestions();

        // Debug response structure
        console.log('API Response:', response);
        console.log('Response data:', response?.data);

        // Handle different response structures
        let questionsData: Question[] = [];
        if (Array.isArray(response.content)) {
          questionsData = response.content;
        } else if (Array.isArray(response)) {
          questionsData = response;
        } else {
          console.warn('Unexpected response structure:', response);
          questionsData = [];
        }
        console.log('Processed questions data:', questionsData);
        setQuestions(questionsData);
      } catch (error) {
        console.error('Failed to load questions:', error);
        message.error('Không thể tải danh sách câu hỏi');
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [visible]);

  // Filter questions based on selected criteria
  useEffect(() => {
    if (!Array.isArray(questions)) {
      console.warn('Questions is not an array:', questions);
      setFilteredQuestions([]);
      return;
    }

    let filtered = questions;

    if (selectedField) {
      filtered = filtered.filter(q => q.fieldId === selectedField);
    }

    if (selectedTopic) {
      filtered = filtered.filter(q => q.topicId === selectedTopic);
    }

    if (selectedLevel) {
      filtered = filtered.filter(q => q.levelId === selectedLevel);
    }

    if (selectedQuestionType) {
      filtered = filtered.filter(q => q.questionTypeId === selectedQuestionType);
    }

    if (searchText) {
      filtered = filtered.filter(q =>
        q.questionContent.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredQuestions(filtered);
  }, [selectedField, selectedTopic, selectedLevel, selectedQuestionType, searchText, questions]);

  const handleAddQuestion = (question: Question) => {
    onConfirm(question);
    message.success(`Đã thêm câu hỏi: ${question.questionContent}`);
  };

  const handleViewDetail = (question: Question) => {
    // Modal is now handled in QuestionTable component
    console.log('View detail for question:', question.questionContent);
  };

  return (
    <Drawer
      title="Chọn câu hỏi có sẵn"
      width={900}
      open={visible}
      onClose={onClose}
      placement="left"
      mask={false}
      zIndex={1001}
      push={false}
    >
      <div style={{ padding: '16px 0' }}>
        <QuestionFilters
          fields={fields}
          topics={topics}
          levels={levels}
          questionTypes={questionTypes}
          selectedField={selectedField}
          selectedTopic={selectedTopic}
          selectedLevel={selectedLevel}
          selectedQuestionType={selectedQuestionType}
          searchText={searchText}
          onFieldChange={setSelectedField}
          onTopicChange={setSelectedTopic}
          onLevelChange={setSelectedLevel}
          onQuestionTypeChange={setSelectedQuestionType}
          onSearchChange={setSearchText}
        />

        <div style={{ marginBottom: 16 }}>
          <Title level={5} style={{ marginBottom: 8 }}>
            Danh sách câu hỏi ({Array.isArray(filteredQuestions) ? filteredQuestions.length : 0})
          </Title>
        </div>

        <QuestionTable
          questions={Array.isArray(filteredQuestions) ? filteredQuestions : []}
          fields={fields}
          topics={topics}
          levels={levels}
          onViewDetail={handleViewDetail}
          onAddQuestion={handleAddQuestion}
          loading={loading}
        />
      </div>
    </Drawer>
  );
};

export default QuestionListDrawerForm;