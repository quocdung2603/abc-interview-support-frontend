import React, { useState } from 'react';
import { Question, Answer } from '../../../../../../../libs/types/src/index';

interface QuestionResultItemProps {
  question: Question;
  answers: Answer[];
  userAnswer: string;
  isCorrect: boolean;
  questionNumber: number;
}

const QuestionResultItem: React.FC<QuestionResultItemProps> = ({
  question,
  answers,
  userAnswer,
  isCorrect,
  questionNumber,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getQuestionTypeLabel = (typeId: string) => {
    switch (typeId) {
      case 'SingleChoice':
        return 'Trắc nghiệm 1 đáp án';
      case 'MultipleChoice':
        return 'Trắc nghiệm nhiều đáp án';
      case 'FillInTheBlank':
        return 'Điền vào chỗ trống';
      case 'OpenEnded':
        return 'Tự luận';
      default:
        return typeId;
    }
  };

  const renderUserAnswer = () => {
    if (!userAnswer) {
      return (
        <div
          style={{
            padding: '0.75rem',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '0.5rem',
            color: '#dc2626',
            fontSize: '0.875rem',
          }}
        >
          <strong>Chưa trả lời</strong>
        </div>
      );
    }

    const baseStyle = {
      padding: '0.75rem',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      marginBottom: '1rem',
    };

    const correctStyle = {
      ...baseStyle,
      background: '#f0fdf4',
      border: '1px solid #bbf7d0',
      color: '#166534',
    };

    const incorrectStyle = {
      ...baseStyle,
      background: '#fef2f2',
      border: '1px solid #fecaca',
      color: '#dc2626',
    };

    if (
      question.questionTypeId === 'MultipleChoice' ||
      question.questionTypeId === 'FillInTheBlank'
    ) {
      const userAnswers = userAnswer.split('|');
      const answerContents = userAnswers.map((answerId) => {
        const answer = answers.find((a) => a.answerId === answerId);
        return answer?.answerContent || answerId;
      });

      return (
        <div style={isCorrect ? correctStyle : incorrectStyle}>
          <strong>Đáp án của bạn:</strong>
          <div style={{ marginTop: '0.5rem' }}>
            {answerContents.map((content, index) => (
              <span
                key={`${question.questionId}-answer-${index}-${content}`}
                style={{
                  display: 'inline-block',
                  background: 'rgba(255, 255, 255, 0.3)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  marginRight: '0.5rem',
                  marginTop: '0.25rem',
                  fontSize: '0.75rem',
                }}
              >
                {content}
              </span>
            ))}
          </div>
        </div>
      );
    }

    // Single choice or open ended
    const answer = answers.find((a) => a.answerId === userAnswer);
    const displayAnswer = answer?.answerContent || userAnswer;

    return (
      <div style={isCorrect ? correctStyle : incorrectStyle}>
        <strong>Đáp án của bạn:</strong>
        <div style={{ marginTop: '0.5rem' }}>{displayAnswer}</div>
      </div>
    );
  };

  const renderCorrectAnswers = () => {
    if (isCorrect) return null;

    const correctAnswers = answers.filter((a) => a.isCorrect);
    if (correctAnswers.length === 0) return null;

    return (
      <div
        style={{
          padding: '0.75rem',
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '0.5rem',
          marginBottom: '1rem',
        }}
      >
        <strong style={{ color: '#166534' }}>Đáp án đúng:</strong>
        <div style={{ marginTop: '0.5rem' }}>
          {correctAnswers.map((answer, index) => (
            <div
              key={answer.answerId}
              style={{
                color: '#166534',
                fontSize: '0.875rem',
                marginTop: index > 0 ? '0.25rem' : 0,
              }}
            >
              • {answer.answerContent}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderExplanation = () => {
    if (!isExpanded) return null;

    const explanation =
      question.questionAnswer ||
      'Không có giải thích chi tiết cho câu hỏi này.';

    return (
      <div
        style={{
          padding: '1rem',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '0.5rem',
          marginTop: '1rem',
        }}
      >
        <h4
          style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '0.5rem',
          }}
        >
          Giải thích:
        </h4>
        <div
          style={{
            fontSize: '0.875rem',
            color: '#64748b',
            lineHeight: '1.5',
          }}
        >
          {explanation}
        </div>
      </div>
    );
  };

  return (
    <div
      className="card-interactive"
      style={{ padding: '1.5rem', marginBottom: '1rem' }}
    >
      {/* Header */}
      <div
        style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '2rem',
            height: '2rem',
            borderRadius: '50%',
            background: isCorrect ? '#059669' : '#dc2626',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: '600',
            marginRight: '1rem',
          }}
        >
          {questionNumber}
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.25rem',
            }}
          >
            <span className="badge-secondary" style={{ fontSize: '0.75rem' }}>
              {getQuestionTypeLabel(question.questionTypeId)}
            </span>
            <div
              style={{
                padding: '0.125rem 0.5rem',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                fontWeight: '500',
                background: isCorrect ? '#059669' : '#dc2626',
                color: 'white',
              }}
            >
              {isCorrect ? '✓ Đúng' : '✗ Sai'}
            </div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div style={{ marginBottom: '1rem' }}>
        <div
          style={{
            fontSize: '1rem',
            color: '#1e293b',
            lineHeight: '1.5',
            fontWeight: '500',
          }}
        >
          {question.questionContent}
        </div>
      </div>

      {/* User Answer */}
      {renderUserAnswer()}

      {/* Correct Answers (only show if incorrect) */}
      {renderCorrectAnswers()}

      {/* Explanation Toggle */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="btn-outline btn-sm"
          style={{
            fontSize: '0.75rem',
            padding: '0.5rem 1rem',
          }}
        >
          {isExpanded ? '🔽 Thu gọn' : '🔍 Xem giải thích'}
        </button>

        {!isCorrect && (
          <div
            style={{
              fontSize: '0.75rem',
              color: '#64748b',
            }}
          >
            💡 Xem giải thích để hiểu rõ hơn
          </div>
        )}
      </div>

      {/* Explanation */}
      {renderExplanation()}
    </div>
  );
};

export default QuestionResultItem;
