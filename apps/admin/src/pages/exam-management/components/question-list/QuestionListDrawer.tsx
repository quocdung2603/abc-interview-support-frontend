import React, { useState, useEffect } from 'react';
import { Drawer, Button, message } from 'antd';
import {
  Question,
  Field,
  Topic,
  Level,
  QuestionType,
} from '@abc-interview-support-frontend/types';
import QuestionListToolbar from './QuestionListToolbar';
import QuestionListTable from './QuestionListTable';

interface QuestionListDrawerProps {
  visible: boolean;
  onClose: () => void;
  onAddQuestion: (question: Question) => void;
  selectedQuestionIds: string[];
  fields: Field[];
  topics: Topic[];
  levels: Level[];
  questionTypes: QuestionType[];
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
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [searchText, setSearchText] = useState('');
  const [fieldFilter, setFieldFilter] = useState<string>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock data for questions
  useEffect(() => {
    if (visible) {
      const mockQuestions: Question[] = Array.from({ length: 50 }, (_, i) => {
        const questionTitles = [
          'React Hook useEffect được sử dụng để làm gì?',
          'Trong JavaScript, phương thức nào được sử dụng để thêm phần tử vào cuối mảng?',
          'RESTful API là gì?',
          'Trong CSS, thuộc tính nào được sử dụng để tạo khoảng cách giữa các phần tử?',
          'Git command nào được sử dụng để tạo một commit mới?',
          'Trong SQL, mệnh đề nào được sử dụng để lọc dữ liệu?',
          'Docker container khác gì với Docker image?',
          'Trong React, lifecycle method nào được gọi sau khi component được render lần đầu?',
          'Algorithm nào có độ phức tạp thời gian O(n log n)?',
          'Trong HTML, thẻ nào được sử dụng để tạo hyperlink?',
        ];

        const field = fields[Math.floor(Math.random() * fields.length)];
        const topic = topics.filter((t) => t.fieldId === field.fieldId)[
          Math.floor(
            Math.random() *
              topics.filter((t) => t.fieldId === field.fieldId).length
          )
        ];
        const level = levels[Math.floor(Math.random() * levels.length)];

        return {
          questionId: String(i + 1),
          userId: String(Math.floor(Math.random() * 10) + 1),
          topicId: topic?.topicId || '1',
          fieldId: field.fieldId,
          levelId: level.levelId,
          status: ['Pending', 'Approved', 'Rejected'][
            Math.floor(Math.random() * 3)
          ] as 'Pending' | 'Approved' | 'Rejected',
          questionTitle: questionTitles[i % questionTitles.length],
          questionVariant: `${Math.floor(Math.random() * 3) + 1}`,
          similarityScore: Math.random() * 100,
          usefulVote: Math.floor(Math.random() * 50),
          unusefulVote: Math.floor(Math.random() * 10),
          createdAt: new Date(
            Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
          ),
        } as Question;
      });

      setQuestions(mockQuestions);
    }
  }, [visible, fields, topics, levels]);

  // Filter questions based on search and filters
  useEffect(() => {
    const filtered = questions.filter((question) => {
      const matchesSearch = question.questionTitle
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchesField =
        fieldFilter === 'all' || question.fieldId === fieldFilter;
      const matchesTopic =
        topicFilter === 'all' || question.topicId === topicFilter;
      const matchesLevel =
        levelFilter === 'all' || question.levelId === levelFilter;
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
    if (selectedQuestionIds.includes(question.questionId)) {
      message.warning('Câu hỏi này đã được thêm vào bài kiểm tra!');
      return;
    }

    onAddQuestion(question);
    message.success('Đã thêm câu hỏi vào bài kiểm tra!');
  };

  return (
    <Drawer
      title="Chọn câu hỏi từ ngân hàng"
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
          onAddQuestion={handleAddQuestion}
        />
      </div>
    </Drawer>
  );
};

export default QuestionListDrawer;
