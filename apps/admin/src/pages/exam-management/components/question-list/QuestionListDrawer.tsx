import React, { useState, useEffect } from 'react';
import { Drawer, Button, message } from 'antd';
import {
  Question,
  Field,
  Topic,
  Level,
  QuestionType,
} from '@abc-interview-support-frontend/types';
import { questionService } from '@abc-interview-support-frontend/services';
import QuestionListToolbar from './QuestionListToolbar';
import QuestionListTable from './QuestionListTable';

interface QuestionListDrawerProps {
  visible: boolean;
  onClose: () => void;
  onAddQuestion: (question: Question) => void;
  selectedQuestionIds: number[];
  fields: Field[];
  topics: Topic[];
  levels: Level[];
  questionTypes: QuestionType[];
  mode?: 'add' | 'compare'; // add for exam creation, compare for approval
  onCompareQuestions?: (question1: Question, question2: Question) => void;
}

const QuestionListDrawer: React.FC<QuestionListDrawerProps> = ({
  visible,
  onClose,
  onAddQuestion,
  selectedQuestionIds,
  fields,
  topics,
  levels,
  questionTypes,
  mode = 'add',
  onCompareQuestions,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [fieldFilter, setFieldFilter] = useState<number | undefined>();
  const [topicFilter, setTopicFilter] = useState<number | undefined>();
  const [levelFilter, setLevelFilter] = useState<number | undefined>();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Load questions from API
  useEffect(() => {
    const loadQuestions = async () => {
      if (visible) {
        setLoading(true);
        try {
          const response = await questionService.getAllQuestions();
          // Assuming response.data is an array of questions or response.data.data
          const questionsData = response.data?.data || response.data || [];
          setQuestions(questionsData);
        } catch (error) {
          console.error('Failed to load questions:', error);
          message.error('Không thể tải danh sách câu hỏi');
          setQuestions([]);
        } finally {
          setLoading(false);
        }
      }
    };

    loadQuestions();
  }, [visible]);

  // Filter questions based on search and filters
  useEffect(() => {
    const filtered = questions.filter((question) => {
      const matchesSearch = question.questionContent
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchesField = !fieldFilter || question.fieldId === fieldFilter;
      const matchesTopic = !topicFilter || question.topicId === topicFilter;
      const matchesLevel = !levelFilter || question.levelId === levelFilter;
      const matchesStatus =
        statusFilter === 'all' || question.status === statusFilter;

      return (
        matchesSearch &&
        matchesField &&
        matchesTopic &&
        matchesLevel &&
        matchesStatus
      );
    });

    setFilteredQuestions(filtered);
  }, [
    questions,
    searchText,
    fieldFilter,
    topicFilter,
    levelFilter,
    statusFilter,
  ]);

  const handleAddQuestion = (question: Question) => {
    if (selectedQuestionIds.includes(question.id)) {
      message.warning('Câu hỏi này đã được thêm vào bài kiểm tra!');
      return;
    }

    onAddQuestion(question);
    message.success('Đã thêm câu hỏi vào bài kiểm tra!');
  };

  const handleCompareQuestions = (question1: Question, question2: Question) => {
    if (onCompareQuestions) {
      onCompareQuestions(question1, question2);
    }
  };

  const getDrawerTitle = () => {
    return mode === 'compare'
      ? 'So sánh câu hỏi tương tự'
      : 'Chọn câu hỏi từ ngân hàng';
  };

  return (
    <Drawer
      title={getDrawerTitle()}
      width={900}
      open={visible}
      onClose={onClose}
      placement="left"
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose}>Đóng</Button>
        </div>
      }
      mask={false}
      zIndex={1001}
    >
      <div style={{ padding: '16px 0' }}>
        <QuestionListToolbar
          searchText={searchText}
          onSearchChange={setSearchText}
          fieldFilter={fieldFilter}
          onFieldFilterChange={setFieldFilter}
          topicFilter={topicFilter}
          onTopicFilterChange={setTopicFilter}
          levelFilter={levelFilter}
          onLevelFilterChange={setLevelFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          fields={fields}
          topics={topics}
          levels={levels}
        />

        <QuestionListTable
          questions={filteredQuestions}
          selectedQuestionIds={selectedQuestionIds}
          fields={fields}
          topics={topics}
          levels={levels}
          onAddQuestion={mode === 'add' ? handleAddQuestion : undefined}
          onCompareQuestions={mode === 'compare' ? handleCompareQuestions : undefined}
          loading={loading}
          mode={mode}
        />
      </div>
    </Drawer>
  );
};

export default QuestionListDrawer;
