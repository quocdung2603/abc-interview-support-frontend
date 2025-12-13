import { useState } from 'react';
import { News } from '@abc-interview-support-frontend/types';
import { TrendNewsCard } from './TrendNewsCard';

interface TrendNewsListProps {
  news: News[];
  onNewsClick?: (news: News) => void;
}

export const TrendNewsList = ({
  news,
  onNewsClick,
}: TrendNewsListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Tính toán phân trang
  const totalPages = Math.ceil(news.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNews = news.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of the list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (news.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-gradient-neutral rounded-full">
            <svg
              className="w-12 h-12 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
          <h3 className="text-heading-3 text-neutral-700 mb-2">
            Không có tin tức xu hướng
          </h3>
          <p className="text-body text-neutral-500">
            Hiện tại chưa có tin tức nào về xu hướng. Hãy quay lại sau nhé!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentNews.map((newsItem) => (
          <TrendNewsCard
            key={newsItem.id}
            news={newsItem}
            onClick={onNewsClick}
          />
        ))}
      </div>

      {/* Pagination */}
      {news.length > 0 && (
        <div className="mt-8 space-y-4">
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Đầu
              </button>

              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
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
                        onClick={() => handlePageChange(1)}
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
                        onClick={() => handlePageChange(page)}
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
                        onClick={() => handlePageChange(totalPages)}
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
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau →
              </button>

              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cuối
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
