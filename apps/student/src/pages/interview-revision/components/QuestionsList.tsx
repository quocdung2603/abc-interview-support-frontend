import React, { useState } from 'react';
import { QuestionCard } from './QuestionCard';
import {
  Answer,
  Field,
  Level,
  Question,
  Topic,
} from '@abc-interview-support-frontend/types';

interface QuestionsListProps {
  questions: Question[];
  answers: Answer[];
  fields: Field[];
  topics: Topic[];
  levels: Level[];
  loading: boolean;
  onVote: (questionId: string, vote: 'useful' | 'unuseful') => void;
  onAnswerVote: (answerId: string, vote: 'useful' | 'unuseful') => void;
  onQuestionClick: (questionId: string) => void;
}

export const QuestionsList: React.FC<QuestionsListProps> = ({
  questions,
  answers,
  fields,
  topics,
  levels,
  loading,
  onVote,
  onAnswerVote,
  onQuestionClick,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;

  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = questions.slice(startIndex, endIndex);

  const getQuestionAnswers = (questionId: string) => {
    return answers.filter((answer) => answer.questionId === questionId);
  };

  const getField = (fieldId: string) => {
    return fields.find((field) => field.fieldId === fieldId);
  };

  const getTopic = (topicId: string) => {
    return topics.find((topic) => topic.topicId === topicId);
  };

  const getLevel = (levelId: string) => {
    return levels.find((level) => level.levelId === levelId);
  };

  if (loading) {
    const skeletonItems = ['skeleton-1', 'skeleton-2', 'skeleton-3'];

    return (
      <div className="space-y-6">
        {skeletonItems.map((skeletonId) => (
          <div
            key={skeletonId}
            className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 animate-pulse"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1 space-y-3">
                <div className="flex gap-2">
                  <div className="h-6 bg-neutral-200 rounded-full w-20"></div>
                  <div className="h-6 bg-neutral-200 rounded-full w-16"></div>
                  <div className="h-6 bg-neutral-200 rounded-full w-14"></div>
                </div>
                <div className="h-6 bg-neutral-200 rounded w-3/4"></div>
                <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="h-8 w-8 bg-neutral-200 rounded"></div>
                <div className="h-4 w-6 bg-neutral-200 rounded"></div>
                <div className="h-8 w-8 bg-neutral-200 rounded"></div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="h-10 w-32 bg-neutral-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-12 text-center">
        <svg
          className="w-16 h-16 mx-auto mb-4 text-neutral-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        <h3 className="text-heading-4 text-neutral-600 mb-2">
          Không có câu hỏi nào
        </h3>
        <p className="text-neutral-500">
          Vui lòng chọn lĩnh vực và chủ đề để xem câu hỏi ôn tập
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Questions List */}
      <div className="space-y-6">
        {currentQuestions.map((question) => {
          const field = getField(question.fieldId);
          const topic = getTopic(question.topicId);
          const level = getLevel(question.levelId);
          const questionAnswers = getQuestionAnswers(question.questionId);

          if (!field || !topic || !level) {
            return null; // Skip questions with missing data
          }

          return (
            <QuestionCard
              key={question.questionId}
              question={question}
              answers={questionAnswers}
              field={field}
              topic={topic}
              level={level}
              onVote={onVote}
              onAnswerVote={onAnswerVote}
              onQuestionClick={onQuestionClick}
            />
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-neutral-200 px-6 py-4">
          <div className="text-neutral-600">
            Hiển thị {startIndex + 1}-{Math.min(endIndex, questions.length)}{' '}
            trong tổng số {questions.length} câu hỏi
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-neutral-600 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="flex space-x-1">
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                const isCurrentPage = page === currentPage;
                const isNearCurrentPage = Math.abs(page - currentPage) <= 2;
                const isFirstOrLastPage = page === 1 || page === totalPages;

                if (!isNearCurrentPage && !isFirstOrLastPage) {
                  if (page === 2 || page === totalPages - 1) {
                    return (
                      <span key={page} className="px-2 py-2 text-neutral-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                }

                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isCurrentPage
                        ? 'bg-primary text-white'
                        : 'text-neutral-600 hover:text-primary hover:bg-neutral-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-neutral-600 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
