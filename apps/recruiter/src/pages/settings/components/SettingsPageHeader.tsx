import React from 'react';

const ExamPageHeader: React.FC = () => {
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
            Cài đặt
          </div>
          <div className="text-body text-neutral-600">
            Quản lý thông tin công ty và tùy chọn hệ thống
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPageHeader;
