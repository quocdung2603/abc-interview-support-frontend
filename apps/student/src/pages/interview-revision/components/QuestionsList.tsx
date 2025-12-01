import React, { useState } from 'react';
import { QuestionCard } from './QuestionCard';
import {
  Field,
  Level,
  Question,
  Topic,
} from '@abc-interview-support-frontend/types';

interface QuestionsListProps {
  questions: Question[];
  fields: Field[];
  topics: Topic[];
  levels: Level[];
  loading: boolean;
  onVote: (questionId: number, vote: 'useful' | 'unuseful') => void;
  onQuestionClick: (questionId: number) => void;
}

export const QuestionsList: React.FC<QuestionsListProps> = ({
  questions,
  fields,
  topics,
  levels,
  loading,
  onVote,
  onQuestionClick,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;

  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = questions.slice(startIndex, endIndex);

  const getField = (fieldId: number) => {
    return fields.find((field) => field.id === fieldId);
  };

  const getTopic = (topicId: number) => {
    return topics.find((topic) => topic.id === topicId);
  };

  const getLevel = (levelId: number) => {
    return levels.find((level) => level.id === levelId);
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

          if (!field || !topic || !level) {
            return null; // Skip questions with missing data
          }

          return (
            <QuestionCard
              key={question.id}
              question={question}
              field={field}
              topic={topic}
              level={level}
              onVote={onVote}
              onQuestionClick={onQuestionClick}
            />
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 space-y-4">
          {/* Page Info */}
          <div className="text-center text-sm text-neutral-600">
            Trang {currentPage} của {totalPages} ({questions.length} câu hỏi)
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed text-sm px-3 py-2"
            >
              Đầu
            </button>

            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed text-sm px-3 py-2"
            >
              ← Trước
            </button>

            <div className="flex space-x-1">
              {(() => {
                const pages = [];
                const maxVisiblePages = 5;
                let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                // Adjust startPage if we're near the end
                if (endPage - startPage + 1 < maxVisiblePages) {
                  startPage = Math.max(1, endPage - maxVisiblePages + 1);
                }

                // Add first page and ellipsis if needed
                if (startPage > 1) {
                  pages.push(
                    <button
                      key={1}
                      onClick={() => setCurrentPage(1)}
                      className="px-3 py-2 rounded-md text-sm font-medium transition-colors bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                    >
                      1
                    </button>
                  );
                  if (startPage > 2) {
                    pages.push(
                      <span key="start-ellipsis" className="px-2 py-2 text-neutral-500">
                        ...
                      </span>
                    );
                  }
                }

                // Add visible pages
                for (let page = startPage; page <= endPage; page++) {
                  pages.push(
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === page
                        ? 'bg-primary text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                    >
                      {page}
                    </button>
                  );
                }

                // Add last page and ellipsis if needed
                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pages.push(
                      <span key="end-ellipsis" className="px-2 py-2 text-neutral-500">
                        ...
                      </span>
                    );
                  }
                  pages.push(
                    <button
                      key={totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                      className="px-3 py-2 rounded-md text-sm font-medium transition-colors bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                    >
                      {totalPages}
                    </button>
                  );
                }

                return pages;
              })()}
            </div>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed text-sm px-3 py-2"
            >
              Sau →
            </button>

            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed text-sm px-3 py-2"
            >
              Cuối
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
