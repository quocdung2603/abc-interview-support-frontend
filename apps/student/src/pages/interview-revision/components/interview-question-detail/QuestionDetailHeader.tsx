import {
  Field,
  Level,
  Question,
  Topic,
} from '@abc-interview-support-frontend/types';
import React from 'react';

interface QuestionDetailHeaderProps {
  question: Question;
  field?: Field;
  topic?: Topic;
  level?: Level;
  onVote: (questionId: number, vote: 'useful' | 'unuseful') => void;
  onBack: () => void;
}

export const QuestionDetailHeader: React.FC<QuestionDetailHeaderProps> = ({
  question,
  field,
  topic,
  level,
  onVote,
  onBack,
}) => {
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-6">
      {/* Navigation */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors font-medium"
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
          Quay lại danh sách câu hỏi
        </button>
      </div>

      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          {/* Question Meta */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {field && (
              <span className="badge-primary text-sm">{field.fieldName}</span>
            )}
            {topic && (
              <span className="badge-secondary text-sm">{topic.topicName}</span>
            )}
            {level && (
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(
                  level.levelName
                )}`}
              >
                {level.levelName}
              </span>
            )}
            <span className="text-neutral-400 text-sm">
              {formatDate(question.createdAt)}
            </span>
          </div>

          {/* Question Title */}
          <h1 className="text-heading-2 text-neutral-900 mb-4">
            {question.questionContent}
          </h1>

          {/* Question Description */}
          {question.questionAnswer && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium text-blue-900">
                  Gợi ý trả lời:
                </span>
              </div>
              <p className="text-blue-800 text-sm">{question.questionAnswer}</p>
            </div>
          )}
        </div>

        {/* Vote Section */}
        <div className="flex flex-col items-center gap-2 min-w-[80px]">
          <button
            onClick={() => onVote(question.id, 'useful')}
            className="p-2 rounded-lg hover:bg-green-50 text-neutral-400 hover:text-green-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
          </button>
          <div className="text-center">
            <div className="text-lg font-bold text-neutral-800">
              {question.usefulVote - question.unusefulVote}
            </div>
            <div className="text-xs text-neutral-500">điểm hữu ích</div>
          </div>
          <button
            onClick={() => onVote(question.id, 'unuseful')}
            className="p-2 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              style={{ transform: 'rotate(180deg)' }}
            >
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 mt-6 pt-4 border-t border-neutral-200">
        <div className="flex items-center gap-2 text-neutral-600">
          <svg
            className="w-4 h-4"
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
          <span className="text-sm">2.5k lượt xem</span>
        </div>
        <div className="flex items-center gap-2 text-neutral-600">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span className="text-sm">Câu hỏi tham khảo</span>
        </div>
      </div>
    </div>
  );
};
