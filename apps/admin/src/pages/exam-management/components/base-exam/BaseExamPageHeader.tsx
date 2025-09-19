import React from 'react';

const BaseExamPageHeader: React.FC = () => {
  return (
    <div style={{ marginBottom: 'var(--spacing-xl)' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-md)',
        }}
      >
        <div>
          <div
            className="text-heading-2 text-gradient-primary"
            style={{ marginBottom: 'var(--spacing-sm)' }}
          >
            📃 Quản lý bài kiểm tra cơ bản
          </div>
          <div className="text-body text-neutral-600">
            Xem các bài kiểm tra cơ bản được tạo bởi doanh nghiệp.
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseExamPageHeader;
