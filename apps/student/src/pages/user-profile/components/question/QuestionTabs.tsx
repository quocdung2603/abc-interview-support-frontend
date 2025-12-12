import React, { useState, useCallback, useEffect } from 'react';
import { message, Modal } from 'antd';
import { User, Question, Field, Topic, Level, QuestionType } from '@abc-interview-support-frontend/types';
import CreateQuestionButton from './CreateQuestionButton';
import QuestionTable from './QuestionTable';
import CreateQuestionDrawer, { CreateQuestionData, EditQuestionData } from './CreateQuestionDrawer';
import QuestionFilter, { QuestionFilters } from './QuestionFilter';
import { questionService } from '@abc-interview-support-frontend/services';

interface QuestionTabsProps {
  user: User;
  questions: Question[];
  fields: Field[];
  topics: Topic[];
  levels: Level[];
  questionTypes: QuestionType[];
  onRefresh: () => void;
}

const QuestionTabs: React.FC<QuestionTabsProps> = ({
  user,
  questions,
  fields,
  topics,
  levels,
  questionTypes,
  onRefresh,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<EditQuestionData | undefined>();
  const [filters, setFilters] = useState<QuestionFilters>({});
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>(questions);

  useEffect(() => {
    let filtered = [...questions];

    if (filters.fieldId) {
      filtered = filtered.filter(question => question.fieldId === filters.fieldId);
    }
    if (filters.topicId) {
      filtered = filtered.filter(question => question.topicId === filters.topicId);
    }
    if (filters.levelId) {
      filtered = filtered.filter(question => question.levelId === filters.levelId);
    }
    if (filters.questionTypeId) {
      filtered = filtered.filter(question => question.questionTypeId === filters.questionTypeId);
    }
    if (filters.language) {
      filtered = filtered.filter(question => question.language === filters.language);
    }
    if (filters.questionContent) {
      filtered = filtered.filter(question =>
        question.questionContent.toLowerCase().includes(filters.questionContent!.toLowerCase())
      );
    }

    setFilteredQuestions(filtered);
  }, [questions, filters]);

  const handleCreateQuestion = useCallback(() => {
    setEditMode(false);
    setEditData(undefined);
    setDrawerOpen(true);
  }, []);

  const handleEditQuestion = useCallback((question: Question) => {
    setEditMode(true);
    setEditData({
      questionId: question.id,
      userId: question.userId,
      topicId: question.topicId,
      fieldId: question.fieldId,
      levelId: question.levelId,
      questionTypeId: question.questionTypeId,
      content: question.questionContent,
      answer: question.questionAnswer,
      language: question.language,
    });
    setDrawerOpen(true);
  }, []);

  const handleDeleteQuestion = useCallback((questionId: number) => {
    // Find the question to get its title for the confirmation dialog
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    Modal.confirm({
      title: 'Xác nhận xóa câu hỏi',
      content: `Bạn có chắc chắn muốn xóa câu hỏi "${question.questionContent}" không?`,
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          await questionService.deleteQuestion(questionId);
          message.success('Xóa câu hỏi thành công!');
          onRefresh();
        } catch (error) {
          console.error('Error deleting question:', error);
          message.error('Không thể xóa câu hỏi. Vui lòng thử lại!');
        }
      },
    });
  }, [questions, onRefresh]);

  const handleSubmitQuestion = useCallback(async (data: CreateQuestionData) => {
    try {
      if (editMode && editData?.questionId) {
        await questionService.updateQuestion(editData.questionId, data);
        message.success('Cập nhật câu hỏi thành công!');
      } else {
        await questionService.createQuestion(data);
        message.success('Tạo câu hỏi thành công!');
      }
      onRefresh();
    } catch (error) {
      console.error('Error submitting question:', error);
      throw error; // Re-throw to let the drawer handle the error
    }
  }, [editMode, editData, onRefresh]);

  const handleViewQuestion = useCallback((questionId: number) => {
    // Navigate to question detail page
    window.open(`/question-detail/${questionId}`, '_blank');
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
    setEditMode(false);
    setEditData(undefined);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header with create button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            📚 Quản lý câu hỏi
          </h2>
          <p className="text-gray-600">
            Tạo và quản lý các câu hỏi cho hệ thống phỏng vấn
          </p>
        </div>
        <CreateQuestionButton onClick={handleCreateQuestion} />
      </div>

      {/* Question Filter */}
      <QuestionFilter
        fields={fields}
        topics={topics}
        levels={levels}
        questionTypes={questionTypes}
        onFilterChange={setFilters}
      />

      {/* Questions table */}
      <QuestionTable
        questions={filteredQuestions}
        onViewQuestion={handleViewQuestion}
        onEditQuestion={handleEditQuestion}
        onDeleteQuestion={handleDeleteQuestion}
      />

      {/* Create/Edit Question Drawer */}
      <CreateQuestionDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        fields={fields}
        topics={topics}
        levels={levels}
        questionTypes={questionTypes}
        onSubmit={handleSubmitQuestion}
        editMode={editMode}
        editData={editData}
      />
    </div>
  );
};

export default QuestionTabs;
