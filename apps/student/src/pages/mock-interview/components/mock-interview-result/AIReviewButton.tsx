import React from 'react';

interface AIReviewButtonProps {
  onClick: () => void;
}

const AIReviewButton: React.FC<AIReviewButtonProps> = ({ onClick }) => {
  return (
    <>
      <button
        onClick={onClick}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '4rem',
          height: '4rem',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          boxShadow: '0 8px 25px -8px rgba(102, 126, 234, 0.6)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          color: 'white',
          transition: 'all 0.3s ease',
          zIndex: 1000,
          animation: 'float 3s ease-in-out infinite',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
          e.currentTarget.style.boxShadow =
            '0 12px 30px -8px rgba(102, 126, 234, 0.8)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow =
            '0 8px 25px -8px rgba(102, 126, 234, 0.6)';
        }}
        title="Nhận đánh giá từ AI"
      >
        🤖
      </button>

      {/* Tooltip */}
      <div
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '6.5rem',
          background: '#1e293b',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          whiteSpace: 'nowrap',
          opacity: 0,
          transform: 'translateX(10px)',
          transition: 'all 0.3s ease',
          pointerEvents: 'none',
          zIndex: 999,
        }}
        id="ai-tooltip"
      >
        💡 Nhận đánh giá từ AI
        <div
          style={{
            position: 'absolute',
            right: '-6px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 0,
            height: 0,
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            borderLeft: '6px solid #1e293b',
          }}
        />
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          
          button:hover + #ai-tooltip {
            opacity: 1 !important;
            transform: translateX(0) !important;
          }
        `}
      </style>
    </>
  );
};

export default AIReviewButton;
