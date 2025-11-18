import React from 'react';

const MockExamPageHeader: React.FC = () => {
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
            📃 Quản lý bài phỏng vấn ảo
          </div>
          <div className="text-body text-neutral-600">
            Xem các bài phỏng vấn ảo được tạo bởi doanh nghiệp.
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockExamPageHeader;
