import React from 'react';

interface VerificationWarningProps {
  isVerified: boolean;
}

const VerificationWarning: React.FC<VerificationWarningProps> = ({
  isVerified,
}) => {
  if (isVerified) return null;

  return (
    <div
      className="stats-card"
      style={{
        background: 'var(--color-warning)',
        color: 'white',
        marginBottom: 'var(--spacing-lg)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-sm)',
        }}
      >
        <span style={{ fontSize: '20px' }}>⚠️</span>
        <div>
          <div style={{ fontWeight: 600, marginBottom: '4px' }}>
            Tài khoản chưa được xác thực
          </div>
          <div style={{ opacity: 0.9 }}>
            Bạn có thể tạo bài đăng nhưng không thể gửi duyệt. Hãy{' '}
            <a
              href="#/verification"
              style={{ color: 'white', textDecoration: 'underline' }}
            >
              hoàn tất xác thực
            </a>{' '}
            để sử dụng đầy đủ tính năng.
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationWarning;
