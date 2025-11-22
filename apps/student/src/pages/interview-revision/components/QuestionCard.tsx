import {
  Field,
  Level,
  Question,
  Topic,
} from '@abc-interview-support-frontend/types';
import React, { useState } from 'react';

interface QuestionCardProps {
  question: Question;
  field: Field;
  topic: Topic;
  level: Level;
  onVote: (questionId: number, vote: 'useful' | 'unuseful') => void;
  onQuestionClick: (questionId: number) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  field,
  topic,
  level,
  onVote,
  onQuestionClick,
}) => {
  const [showPreview, setShowPreview] = useState(false);

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(date));
  };

  const getLevelColor = (levelName: string) => {
    switch (levelName.toLowerCase()) {
      case 'fresher':
        return 'bg-green-100 text-green-800';
      case 'junior':
        return 'bg-blue-100 text-blue-800';
      case 'middle':
        return 'bg-yellow-100 text-yellow-800';
      case 'senior':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Get best answer for preview
  const answerContent = question.questionAnswer || 'Chưa có câu trả lời mẫu.';

  const handleQuestionClick = () => {
    onQuestionClick(question.id);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Question Header - Clickable */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="badge-primary text-xs">{field.name}</span>
              <span className="badge-secondary text-xs">{topic.name}</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(
                  level.name
                )}`}
              >
                {level.name}
              </span>
              <span className="text-neutral-400 text-xs">
                {formatDate(question.createdAt)}
              </span>
            </div>

            {/* Clickable Question Title */}
            <button
              className="text-heading-3 text-neutral-900 mb-2 cursor-pointer hover:text-primary transition-colors text-left w-full"
              onClick={handleQuestionClick}
            >
              #{question.id}: {question.questionContent}
            </button>
          </div>

          {/* Question Vote */}
          <div className="flex flex-col items-center gap-1 min-w-[60px]">
            <button
              onClick={() => onVote(question.id, 'useful')}
              className="p-1 rounded hover:bg-green-50 text-neutral-400 hover:text-green-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
            </button>
            <span className="text-sm font-medium text-neutral-600">
              {question.usefulVote - question.unusefulVote}
            </span>
            <button
              onClick={() => onVote(question.id, 'unuseful')}
              className="p-1 rounded hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                style={{ transform: 'rotate(180deg)' }}
              >
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Quick Preview Button */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${showPreview
              ? 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              : 'bg-primary text-white hover:bg-primary-dark'
              }`}
          >
            {showPreview ? (
              <>
                <svg
                  className="w-4 h-4 mr-2 inline"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
                Ẩn xem nhanh
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-2 inline"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                Xem nhanh
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview Mode - Hiển thị 1 phần câu trả lời */}
      {showPreview && (
        <div className="border-t border-neutral-200 overflow-hidden transition-all duration-300 ease-out transform">
          <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 animate-fadeIn">
            <div className="flex items-center gap-2 mb-3">
              <svg
                className="w-4 h-4 text-yellow-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium text-yellow-800">
                Câu trả lời mẫu
              </span>
            </div>

            <div className="bg-white rounded-lg p-4 relative overflow-hidden">
              <div className="prose prose-sm max-w-none text-neutral-700">
                {truncateText(answerContent, 200)}
              </div>

              {answerContent.length > 200 && (
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent rounded-b-lg" />
              )}
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-3">
                {/* Bỏ vote cho answer vì không có answers riêng */}
              </div>

              <span className="text-xs text-neutral-500">
                {formatDate(question.createdAt)}
              </span>
            </div>

            {/* Call to Action */}
            <div className="mt-4 pt-3 border-t border-yellow-200">
              <button
                onClick={handleQuestionClick}
                className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-medium py-2 px-4 rounded-lg hover:shadow-md transition-all duration-200"
              >
                Xem chi tiết câu hỏi và tất cả câu trả lời →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
