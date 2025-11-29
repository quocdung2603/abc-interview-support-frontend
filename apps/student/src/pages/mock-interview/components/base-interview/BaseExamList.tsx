import { useState } from 'react';

import { Exam } from '@abc-interview-support-frontend/types';
import BaseExamCard from './BaseExamCard';

interface ExamListProps {
  title: string;
  exams: Exam[];
  emptyMessage?: string;
  onStartExam?: (examId: string) => void;
  onRegister?: (examId: string) => void;
  onUnregister?: (examId: string) => void;
  showCreatedBadge?: boolean;
  isRegistered?: boolean;
  registerLoading?: Set<string>;
  unregisterLoading?: Set<string>;
}

const BaseExamList: React.FC<ExamListProps> = ({
  title,
  exams,
  emptyMessage = 'Không có bài kiểm tra nào.',
  onStartExam,
  onRegister,
  onUnregister,
  showCreatedBadge = false,
  isRegistered = false,
  registerLoading = new Set(),
  unregisterLoading = new Set(),
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Tính toán phân trang
  const totalPages = Math.ceil(exams.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExams = exams.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of the list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-base text-primary font-semibold">{title}</h2>
        <span className="badge-secondary text-sm">{exams.length}</span>
      </div>

      {exams.length === 0 ? (
        <div className="text-center p-8 bg-neutral-50 border-2 border-dashed border-neutral-300 rounded-lg">
          <div className="text-neutral-400 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-neutral-500 text-body-large font-medium mb-2">
            {emptyMessage}
          </p>
          <p className="text-neutral-400 text-body-small">
            Hãy tạo bài kiểm tra mới hoặc thay đổi tiêu chí tìm kiếm
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentExams.map((exam, index) => (
              <div
                key={`${exam.id}-${index}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <BaseExamCard
                  exam={exam}
                  onStartExam={onStartExam}
                  onRegister={onRegister}
                  onUnregister={onUnregister}
                  isCreated={showCreatedBadge}
                  isRegistered={isRegistered}
                  registerLoading={registerLoading.has(exam.id.toString())}
                  unregisterLoading={unregisterLoading.has(exam.id.toString())}
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 space-y-4">
              {/* Page Info */}
              <div className="text-center text-body text-neutral-600">
                Trang {currentPage} của {totalPages} ({exams.length} bài kiểm tra)
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
        </>
      )}
    </div>
  );
};

export default BaseExamList;
