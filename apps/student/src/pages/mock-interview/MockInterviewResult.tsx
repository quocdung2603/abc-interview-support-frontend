import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examService } from '@abc-interview-support-frontend/services';
import { useAuth } from '@abc-interview-support-frontend/sso-utils';
import { message } from 'antd';
import AIReviewModal from './components/mock-interview-result/AIReviewModal';
import AIReviewButton from './components/mock-interview-result/AIReviewButton';

interface AnswerDetail {
  questionId: number;
  orderNumber: number;
  questionContent: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  metadata: {
    fieldId: number;
    fieldName: string | null;
    topicIds: number[];
    topicNames: string[] | null;
    levelId: number;
    levelName: string | null;
    questionTypeId: number;
    questionTypeName: string | null;
  };
}

interface ExamResult {
  examId: number;
  userId: number;
  examTitle: string;
  score: number;
  passStatus: boolean;
  completedAt: string;
  answers: AnswerDetail[];
}

const MockInterviewResult = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiReviewModalVisible, setAiReviewModalVisible] = useState(false);

  useEffect(() => {
    const fetchExamResult = async () => {
      if (!id || !user?.userId) {
        setError('Missing exam ID or user ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await examService.getDetailExamResult(id, user.userId.toString());
        console.log('Exam result:', result);

        // Check for duplicate questionIds
        const questionIds = result.answers.map((a: AnswerDetail) => a.questionId);
        const uniqueQuestionIds = new Set(questionIds);
        console.log('Total answers:', result.answers.length);
        console.log('Unique question IDs:', uniqueQuestionIds.size);

        if (questionIds.length !== uniqueQuestionIds.size) {
          console.warn('DUPLICATE QUESTION IDs DETECTED!');
          console.log('Question IDs:', questionIds);
          const duplicates = questionIds.filter((id: any, index: any) => questionIds.indexOf(id) !== index);
          console.log('Duplicate IDs:', [...new Set(duplicates)]);
        }

        setExamResult(result);
        setError(null);
      } catch (error: any) {
        console.error('Failed to load exam result:', error);
        setError('Không thể tải kết quả bài kiểm tra. Vui lòng thử lại.');
        message.error('Không thể tải kết quả bài kiểm tra');
      } finally {
        setLoading(false);
      }
    };

    fetchExamResult();
  }, [id, user?.userId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getPassStatusColor = (passed: boolean) => {
    return passed ? '#059669' : '#dc2626';
  };

  const getPassStatusText = (passed: boolean) => {
    return passed ? 'ĐẠT' : 'KHÔNG ĐẠT';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải kết quả bài kiểm tra...</p>
        </div>
      </div>
    );
  }

  if (error || !examResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {error || 'Không tìm thấy kết quả bài kiểm tra'}
          </p>
          <button
            onClick={() => navigate('/mock-interview')}
            className="btn-primary"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate('/mock-interview')}
                className="btn-outline btn-sm"
                style={{ marginRight: '1rem' }}
              >
                ← Quay lại
              </button>
            </div>
            <div className="text-sm text-gray-600">
              Hoàn thành lúc: {formatDate(examResult.completedAt)}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Exam Result Summary */}
        <div className="card-elevated" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 className="text-heading-2" style={{ marginBottom: '1rem', color: '#1e293b' }}>
              {examResult.examTitle}
            </h2>
            <h1
              className="text-heading-1"
              style={{
                marginBottom: '1rem',
                color: getPassStatusColor(examResult.passStatus)
              }}
            >
              {getPassStatusText(examResult.passStatus)}
            </h1>
            <div
              style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: getPassStatusColor(examResult.passStatus),
                marginBottom: '0.5rem'
              }}
            >
              {(examResult.score).toFixed(1)}%
            </div>
            <p className="text-body" style={{ color: '#64748b' }}>
              Điểm số của bạn
            </p>
          </div>

          {/* Result Details */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              padding: '1.5rem',
              background: '#f8fafc',
              borderRadius: '0.5rem'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
                Tổng số câu hỏi
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>
                {examResult.answers.length}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
                Trả lời đúng
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#059669' }}>
                {examResult.answers.filter(a => a.isCorrect).length}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
                Trả lời sai
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#dc2626' }}>
                {examResult.answers.filter(a => !a.isCorrect).length}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
                Hoàn thành lúc
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>
                {formatDate(examResult.completedAt)}
              </div>
            </div>
          </div>
        </div>

        {/* Questions and Answers */}
        <div className="card-elevated" style={{ padding: '2rem' }}>
          <h3 className="text-heading-3" style={{ marginBottom: '1.5rem' }}>
            Chi tiết từng câu hỏi
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {examResult.answers.map((answer, index) => (
              <div
                key={`${answer.questionId}-${answer.orderNumber}-${index}`}
                style={{
                  padding: '1.5rem',
                  background: answer.isCorrect ? '#f0fdf4' : '#fef2f2',
                  border: `2px solid ${answer.isCorrect ? '#059669' : '#dc2626'}`,
                  borderRadius: '0.5rem'
                }}
              >
                {/* Question Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '2rem',
                      height: '2rem',
                      borderRadius: '50%',
                      background: answer.isCorrect ? '#059669' : '#dc2626',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '600',
                      fontSize: '0.875rem'
                    }}
                  >
                    {index + 1}
                  </div>
                  <div
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      background: answer.isCorrect ? '#059669' : '#dc2626',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}
                  >
                    {answer.isCorrect ? '✓ Đúng' : '✗ Sai'}
                  </div>
                </div>

                {/* Question Content */}
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                    {answer.questionContent}
                  </p>
                </div>

                {/* Answers */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {/* User Answer */}
                  <div
                    style={{
                      padding: '0.75rem',
                      background: 'white',
                      borderRadius: '0.375rem',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: '600' }}>
                      Câu trả lời của bạn:
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#1e293b' }}>
                      {answer.userAnswer || '(Chưa trả lời)'}
                    </div>
                  </div>

                  {/* Correct Answer (only show if user answer is wrong) */}
                  {!answer.isCorrect && (
                    <div
                      style={{
                        padding: '0.75rem',
                        background: 'white',
                        borderRadius: '0.375rem',
                        border: '1px solid #059669'
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', color: '#059669', marginBottom: '0.25rem', fontWeight: '600' }}>
                        Đáp án đúng:
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#1e293b' }}>
                        {answer.correctAnswer}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '2rem',
          }}
        >
          <button
            onClick={() => navigate('/mock-interview')}
            className="btn-primary"
          >
            Làm bài kiểm tra khác
          </button>
        </div>
      </div>

      {/* AI Review Button - Floating */}
      <AIReviewButton onClick={() => setAiReviewModalVisible(true)} />

      {/* AI Review Modal */}
      {examResult && (
        <AIReviewModal
          visible={aiReviewModalVisible}
          onClose={() => setAiReviewModalVisible(false)}
          questions={examResult.answers.map(a => ({
            id: a.questionId,
            userId: examResult.userId,
            topicId: a.metadata.topicIds[0] || 0,
            fieldId: a.metadata.fieldId,
            levelId: a.metadata.levelId,
            questionTypeId: a.metadata.questionTypeId,
            status: 'APPROVED' as const,
            questionContent: a.questionContent,
            questionAnswer: a.correctAnswer,
            language: 'Vietnamese',
            similarityScore: 0,
            usefulVote: 0,
            unusefulVote: 0,
            createdAt: examResult.completedAt,
            fieldName: a.metadata.fieldName || '',
            levelName: a.metadata.levelName || '',
            topicName: a.metadata.topicNames?.[0] || '',
            questionTypeName: a.metadata.questionTypeName || '',
          }))}
          answers={{}}
          userAnswers={examResult.answers.reduce((acc, a) => ({
            ...acc,
            [a.questionId]: a.userAnswer
          }), {})}
          correctAnswers={examResult.answers.filter(a => a.isCorrect).length}
          totalQuestions={examResult.answers.length}
          timeSpent={0}
        />
      )}
    </div>
  );
};

export default MockInterviewResult;
