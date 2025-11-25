import { useState } from 'react';
import { RecruitmentNews as RNews } from '@abc-interview-support-frontend/types';
import { RecruitmentNewsCard } from './RecruitmentNewsCard';

interface RecruitmentNewsListProps {
  news: RNews[]; // CHỈ NHẬN DANH SÁCH TIN TỨC CÓ NEWSTYPE = 'RECRUITMENT'
  onNewsClick?: (news: RNews) => void;
}

export const RecruitmentNewsList = ({
  news,
  onNewsClick,
}: RecruitmentNewsListProps) => {
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
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
              />
            </svg>
          </div>
          <h3 className="text-heading-3 text-neutral-700 mb-2">
            Không có tin tức tuyển dụng
          </h3>
          <p className="text-body text-neutral-500">
            Hiện tại chưa có tin tức tuyển dụng nào. Hãy quay lại sau nhé!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentNews.map((newsItem) => (
          <RecruitmentNewsCard
            key={newsItem.id}
            news={newsItem}
            onClick={onNewsClick}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 space-y-4">
          {/* Page Info */}
          <div className="text-center text-body text-neutral-600">
            Trang {currentPage} của {totalPages} ({news.length} tin tức)
          </div>

          {/* Pagination Controls */}
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
        </div>
      )}

      {/* Quick Stats */}
      {news.length > 0 && (
        <div className="mt-8 p-4 bg-gradient-neutral rounded-xl">
          <div className="text-center">
            <h4 className="text-heading-3 text-neutral-800 mb-4">
              Thống kê tuyển dụng
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="stats-card">
                <div className="text-center">
                  <div className="text-heading-2 text-primary font-bold mb-2">
                    {news.length}
                  </div>
                  <div className="text-caption text-neutral-600 font-medium">
                    Cơ hội việc làm
                  </div>
                </div>
              </div>

              <div className="stats-card">
                <div className="text-center">
                  <div className="text-heading-2 text-primary font-bold mb-2">
                    15+
                  </div>
                  <div className="text-caption text-neutral-600 font-medium">
                    Ngành nghề
                  </div>
                </div>
              </div>

              <div className="stats-card">
                <div className="text-center">
                  <div className="text-heading-2 text-primary font-bold mb-2">
                    98%
                  </div>
                  <div className="text-caption text-neutral-600 font-medium">
                    Tỷ lệ hài lòng
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
