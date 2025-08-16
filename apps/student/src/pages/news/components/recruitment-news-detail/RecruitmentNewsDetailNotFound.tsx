import React from 'react';

export const RecruitmentNewsDetailNotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-heading-2 text-neutral-900 mb-4">
          Không tìm thấy tin tức tuyển dụng
        </h1>
        <p className="text-body-large text-neutral-600 mb-8">
          Tin tức bạn đang tìm kiếm có thể đã bị xóa hoặc không tồn tại.
        </p>
        <button onClick={() => window.history.back()} className="btn-primary">
          Quay lại
        </button>
      </div>
    </div>
  );
};
