import React from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import AnswerItem from './AnswerItem';

interface Answer {
  id: string;
  content: string;
  author: string;
  authorAvatar: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  userVote: 'up' | 'down' | null;
}

interface AnswerListProps {
  answers: Answer[];
  onVote: (answerId: string, voteType: 'up' | 'down') => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const AnswerList: React.FC<AnswerListProps> = ({
  answers,
  onVote,
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
}) => {
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((index) => (
          <div key={index} className="card-interactive p-6 animate-pulse">
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-2 min-w-[48px]">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="w-32 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-4 bg-gray-200 rounded"></div>
                  <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                  <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (answers.length === 0) {
    return (
      <div className="card-elevated p-8 text-center">
        <div className="text-gray-400 text-4xl mb-4">💬</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Chưa có câu trả lời nào
        </h3>
        <p className="text-gray-500">
          Hãy là người đầu tiên trả lời câu hỏi này!
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Answers Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {answers.length} Câu trả lời
        </h2>
        <div className="w-12 h-1 bg-blue-600 rounded"></div>
      </div>

      {/* Answers List */}
      <div className="space-y-4 mb-8">
        {answers.map((answer) => (
          <AnswerItem key={answer.id} answer={answer} onVote={onVote} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-6">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`btn-outline btn-sm inline-flex items-center gap-1 ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <LeftOutlined />
            Trước
          </button>

          <div className="flex items-center gap-1 mx-4">
            {getVisiblePages().map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`btn-outline btn-sm inline-flex items-center gap-1 ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Sau
            <RightOutlined />
          </button>
        </div>
      )}
    </div>
  );
};

export default AnswerList;
