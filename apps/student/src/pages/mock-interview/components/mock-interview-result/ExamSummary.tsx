import React from 'react';
import { Exam } from '../../../../../../../libs/types/src/index';

interface ExamSummaryProps {
  exam: Exam;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // in seconds
  score: number;
}

const ExamSummary: React.FC<ExamSummaryProps> = ({
  exam,
  totalQuestions,
  correctAnswers,
  timeSpent,
  score,
}) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return '#059669'; // green
    if (percentage >= 60) return '#d97706'; // orange
    return '#dc2626'; // red
  };

  const getScoreStatus = (percentage: number) => {
    if (percentage >= 80) return 'Xuất sắc';
    if (percentage >= 60) return 'Khá';
    if (percentage >= 40) return 'Trung bình';
    return 'Cần cải thiện';
  };

  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <div
      className="card-elevated"
      style={{ padding: '2rem', marginBottom: '2rem' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1
          className="text-heading-1"
          style={{ marginBottom: '0.5rem', color: '#1e293b' }}
        >
          Kết quả bài kiểm tra
        </h1>
        <h2
          className="text-heading-2"
          style={{ color: '#64748b', fontWeight: '500' }}
        >
          {exam.title}
        </h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {/* Score Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            padding: '1.5rem',
            borderRadius: '1rem',
            border: `2px solid ${getScoreColor(percentage)}`,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '3rem',
              fontWeight: '700',
              color: getScoreColor(percentage),
              marginBottom: '0.5rem',
            }}
          >
            {percentage}%
          </div>
          <div
            style={{
              fontSize: '1rem',
              color: '#64748b',
              marginBottom: '0.25rem',
            }}
          >
            Điểm số: {score.toFixed(1)}
          </div>
          <div
            style={{
              fontSize: '0.875rem',
              color: getScoreColor(percentage),
              fontWeight: '600',
            }}
          >
            {getScoreStatus(percentage)}
          </div>
        </div>

        {/* Questions Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            padding: '1.5rem',
            borderRadius: '1rem',
            border: '2px solid #f59e0b',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#92400e',
              marginBottom: '0.5rem',
            }}
          >
            {correctAnswers}/{totalQuestions}
          </div>
          <div
            style={{
              fontSize: '1rem',
              color: '#78716c',
              marginBottom: '0.25rem',
            }}
          >
            Câu trả lời đúng
          </div>
          <div
            style={{
              fontSize: '0.875rem',
              color: '#92400e',
            }}
          >
            {totalQuestions - correctAnswers} câu sai
          </div>
        </div>

        {/* Time Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
            padding: '1.5rem',
            borderRadius: '1rem',
            border: '2px solid #6366f1',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#4338ca',
              marginBottom: '0.5rem',
            }}
          >
            {formatTime(timeSpent)}
          </div>
          <div
            style={{
              fontSize: '1rem',
              color: '#64748b',
              marginBottom: '0.25rem',
            }}
          >
            Thời gian làm bài
          </div>
          <div
            style={{
              fontSize: '0.875rem',
              color: '#4338ca',
            }}
          >
            Giới hạn: {exam.duration} phút
          </div>
        </div>
      </div>

      {/* Exam Info */}
      <div
        style={{
          background: '#f8fafc',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          border: '1px solid #e2e8f0',
        }}
      >
        <h3
          style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '1rem',
          }}
        >
          Thông tin bài kiểm tra
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
          }}
        >
          <div>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Vị trí:{' '}
            </span>
            <span
              style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#1e293b',
              }}
            >
              {exam.position || 'N/A'}
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Chủ đề:{' '}
            </span>
            <span
              style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#1e293b',
              }}
            >
              {JSON.parse(exam.topics || '[]').join(', ')}
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Loại câu hỏi:{' '}
            </span>
            <span
              style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#1e293b',
              }}
            >
              {JSON.parse(exam.questionTypes || '[]').join(', ')}
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Ngôn ngữ:{' '}
            </span>
            <span
              style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#1e293b',
              }}
            >
              {exam.language}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamSummary;
