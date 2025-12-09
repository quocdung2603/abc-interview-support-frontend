import React, { useEffect, useState } from 'react';
import AnswerItem from './AnswerItem';
import { DiscussionAnswer } from '@abc-interview-support-frontend/types';
import { userService } from '@abc-interview-support-frontend/services';

interface AuthorInfo {
  name: string;
  avatar: string;
}

interface AnswerListProps {
  answers: DiscussionAnswer[];
  onVote: (answerId: number, voteType: 'up' | 'down') => void;
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
  const [authors, setAuthors] = useState<Record<number, AuthorInfo>>({});

  // Fetch author info for answers
  useEffect(() => {
    const fetchAuthors = async () => {
      const authorPromises = answers.map(async (answer) => {
        // Skip if userId is undefined or already fetched
        if (!answer.userId || authors[answer.userId]) return;

        try {
          const user = await userService.getUserById(answer.userId.toString());
          const authorInfo: AuthorInfo = {
            name: user.fullName || `User ${answer.userId}`,
            avatar: user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
          };
          setAuthors(prev => ({ ...prev, [answer.userId]: authorInfo }));
        } catch (error) {
          console.error(`Error fetching user ${answer.userId}:`, error);
          // Fallback author info
          const fallbackAuthor: AuthorInfo = {
            name: `User ${answer.userId}`,
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
          };
          setAuthors(prev => ({ ...prev, [answer.userId]: fallbackAuthor }));
        }
      });

      await Promise.all(authorPromises);
    };

    if (answers.length > 0) {
      fetchAuthors();
    }
  }, [answers, authors]);
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

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((index) => (
          <div key={index} className="card-interactive p-4 animate-pulse">
            <div className="flex gap-3">
              <div className="flex flex-col items-center gap-2 min-w-[48px]">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="w-32 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-1">
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
      <div className="card-elevated p-6 text-center">
        <div className="text-gray-400 text-2xl mb-3">💬</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-1">
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
      {/* Answers Header - Compact */}
      <div className="mb-3 flex items-center gap-3">
        <h2 className="text-base font-semibold text-gray-800">
          {answers.length} Câu trả lời
        </h2>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* Answers List - Tighter spacing */}
      <div className="space-y-2 mb-4">
        {answers.map((answer, index) => (
          <AnswerItem
            key={`${answer.id}-${answer.createdAt}-${index}`}
            answer={answer}
            author={authors[answer.userId || 0] || { name: `User ${answer.userId || 'Unknown'}`, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' }}
            onVote={onVote}
          />
        ))}
      </div>

      {/* Pagination - Similar to PostsList */}
      {totalPages > 1 && (
        <div className="mt-6 space-y-3">
          {/* Page Info */}
          <div className="text-center text-sm text-gray-600">
            Trang {currentPage} của {totalPages} ({answers.length} câu trả lời)
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed text-sm px-3 py-2"
            >
              Đầu
            </button>

            <button
              onClick={handlePrevPage}
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
                      onClick={() => onPageChange(1)}
                      className="px-3 py-2 rounded-md text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      1
                    </button>
                  );
                  if (startPage > 2) {
                    pages.push(
                      <span key="start-ellipsis" className="px-2 py-2 text-gray-500">
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
                      onClick={() => onPageChange(page)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                      <span key="end-ellipsis" className="px-2 py-2 text-gray-500">
                        ...
                      </span>
                    );
                  }
                  pages.push(
                    <button
                      key={totalPages}
                      onClick={() => onPageChange(totalPages)}
                      className="px-3 py-2 rounded-md text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      {totalPages}
                    </button>
                  );
                }

                return pages;
              })()}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed text-sm px-3 py-2"
            >
              Sau →
            </button>

            <button
              onClick={() => onPageChange(totalPages)}
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

export default AnswerList;
