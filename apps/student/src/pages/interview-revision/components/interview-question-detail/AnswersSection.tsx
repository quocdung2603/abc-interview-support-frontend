import { Answer } from '@abc-interview-support-frontend/types';
import React from 'react';

interface AnswersSectionProps {
  answers: Answer[];
  onAnswerVote: (answerId: number, vote: 'useful' | 'unuseful') => void;
}

export const AnswersSection: React.FC<AnswersSectionProps> = ({
  answers,
  onAnswerVote,
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  // Chỉ lấy câu trả lời mẫu
  const sampleAnswer = answers.find((answer) => answer.isSampleAnswer);

  if (!sampleAnswer) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
        <div className="text-center">
          <svg
            className="w-12 h-12 text-neutral-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-heading-4 text-neutral-600 mb-2">
            Chưa có câu trả lời
          </h3>
          <p className="text-neutral-500">
            Câu trả lời mẫu cho câu hỏi này sẽ được cập nhật sớm.
          </p>
        </div>
      </div>
    );
  }

  const renderAnswerContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => {
      if (paragraph.trim() === '') {
        return <br key={`br-${index}-${paragraph.length}`} />;
      }

      // Handle code blocks
      if (paragraph.includes('```')) {
        const parts = paragraph.split('```');
        return parts.map((part, partIndex) => {
          if (partIndex % 2 === 1) {
            // This is code
            return (
              <pre
                key={`code-${index}-${partIndex}-${part.slice(0, 10)}`}
                className="bg-neutral-100 p-3 rounded-lg my-3 overflow-x-auto"
              >
                <code className="text-sm text-neutral-800">{part}</code>
              </pre>
            );
          } else {
            // This is regular text
            return (
              part && (
                <span key={`text-${index}-${partIndex}-${part.slice(0, 10)}`}>
                  {part}
                </span>
              )
            );
          }
        });
      }

      // Handle bold text
      const boldParts = paragraph.split(/(\*\*.*?\*\*)/);
      return (
        <p
          key={`paragraph-${index}-${paragraph.slice(0, 20)}`}
          className="mb-3 text-neutral-700 leading-relaxed"
        >
          {boldParts.map((part, partIndex) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong
                  key={`bold-${index}-${partIndex}-${part.slice(2, 12)}`}
                  className="font-semibold text-neutral-900"
                >
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return (
              <span key={`normal-${index}-${partIndex}-${part.slice(0, 10)}`}>
                {part}
              </span>
            );
          })}
        </p>
      );
    });
  };

  return (
    <div className="space-y-4">
      {/* Tiêu đề section */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <h2 className="text-heading-3 text-neutral-900 mb-6">
          Câu trả lời mẫu
        </h2>

        {/* Sample Answer Card */}
        <div className="border border-blue-200 rounded-xl p-6 bg-blue-50">
          {/* Answer Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-medium">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-blue-900">
                    Câu trả lời chính thức
                  </span>
                  <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Mẫu
                  </span>
                </div>
                <p className="text-blue-700 text-sm">
                  {formatDate(sampleAnswer.createdAt)}
                </p>
              </div>
            </div>

            {/* Vote buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onAnswerVote(sampleAnswer.answerId, 'useful')}
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-green-200 hover:bg-green-50 transition-colors group"
              >
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                <span className="text-sm font-medium text-green-700">
                  {sampleAnswer.usefulVote}
                </span>
              </button>

              <button
                onClick={() => onAnswerVote(sampleAnswer.answerId, 'unuseful')}
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-red-200 hover:bg-red-50 transition-colors group"
              >
                <svg
                  className="w-4 h-4 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  style={{ transform: 'rotate(180deg)' }}
                >
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                <span className="text-sm font-medium text-red-700">
                  {sampleAnswer.unusefulVote}
                </span>
              </button>
            </div>
          </div>

          {/* Answer Content - Hiển thị đầy đủ */}
          <div className="prose max-w-none">
            <div className="text-neutral-800 leading-relaxed">
              {renderAnswerContent(sampleAnswer.answerContent)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
