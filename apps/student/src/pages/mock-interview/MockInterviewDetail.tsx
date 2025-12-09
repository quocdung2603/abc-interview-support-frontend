import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Progress, Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { QuestionInExam, Answer, Exam } from '@abc-interview-support-frontend/types';
import { examService } from '@abc-interview-support-frontend/services';
import { ExamDetailHeader, ExamTimer, FillInTheBlankQuestion, MultipleChoiceQuestion, OpenEndedQuestion, QuestionControls, QuestionNavigator, SingleChoiceQuestion } from './components/mock-interview-detail';
import { useAuth } from '@abc-interview-support-frontend/sso-utils';

interface UserAnswer {
  questionId: number;
  answerContent: string;
}

type UserAnswers = UserAnswer[];

type MockInterviewDetailProps = {
  examId?: string;
  onBack?: () => void;
};

const MockInterviewDetail: React.FC<MockInterviewDetailProps> = ({ examId: propExamId, onBack }) => {
  const { id: urlExamId } = useParams<{ id: string }>();
  const examId = urlExamId || propExamId;
  const navigate = useNavigate();
  const { user } = useAuth();

  // State management
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<QuestionInExam[]>([]);
  const [answers, setAnswers] = useState<Record<string, Answer[]>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>([]);
  const [markedQuestions, setMarkedQuestions] = useState<Set<string>>(
    new Set()
  );
  const [isExamActive, setIsExamActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isOpenBackModal, setIsOpenBackModal] = useState(false);
  const [isSubmitModal, setIsSubmitModal] = useState(false);

  const getExamById = async (examId: string) => {
    try {
      const res = await examService.getExamById(examId);
      const exam = res || null;
      setExam(exam);
      setQuestions(exam.questions || []);
      return exam;
    } catch (error) {
      console.error('Error fetching exam:', error);
      setExam(null);
      setQuestions([]);
      return null;
    }
  }

  const fetchAnswersForQuestions = async (questions: QuestionInExam[]) => {
    try {
      const answersMap: Record<string, Answer[]> = {};

      // Only fetch answers for questions that are not OpenEnded (questionTypeId !== 3)
      const questionsWithAnswers = questions.filter(q => q.questionTypeId !== 3);

      const answerPromises = questionsWithAnswers.map(async (question) => {
        try {
          const res = await examService.getAnswerByQuestion(question.id);
          const answersArray: Answer[] = res.content || [];
          return { questionId: question.id, answers: answersArray };
        } catch (error) {
          console.error(`Error fetching answers for question ${question.id}:`, error);
          return { questionId: question.id, answers: [] };
        }
      });

      const results = await Promise.all(answerPromises);

      results.forEach(({ questionId, answers }) => {
        answersMap[questionId.toString()] = answers;
      });

      setAnswers(answersMap);
    } catch (error) {
      console.error('Error fetching answers:', error);
      setAnswers({});
    }
  }

  // Initialize mock data
  useEffect(() => {
    const initializeExam = async () => {
      const exam = await getExamById(examId || '');
      if (exam && exam.questions) {
        await fetchAnswersForQuestions(exam.questions);
      }
      setLoading(false);
    };

    initializeExam();
  }, [examId]);

  // Handle answer changes
  const handleAnswerChange = useCallback(
    (questionId: string, answer: string) => {
      setUserAnswers((prev) => {
        const existingIndex = prev.findIndex((ua) => ua.questionId === parseInt(questionId));
        if (existingIndex >= 0) {
          // Update existing
          const newAnswers = [...prev];
          newAnswers[existingIndex] = { questionId: parseInt(questionId), answerContent: answer };
          return newAnswers;
        } else {
          // Add new
          return [...prev, { questionId: parseInt(questionId), answerContent: answer }];
        }
      });
    },
    []
  );

  // Navigation functions
  const goToQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index < questions.length) {
        setCurrentQuestionIndex(index);
      }
    },
    [questions.length]
  );

  const goToPrevious = useCallback(() => {
    goToQuestion(currentQuestionIndex - 1);
  }, [currentQuestionIndex, goToQuestion]);

  const goToNext = useCallback(() => {
    goToQuestion(currentQuestionIndex + 1);
  }, [currentQuestionIndex, goToQuestion]);

  // Mark/unmark questions
  const toggleMarkQuestion = useCallback((questionId: string) => {
    setMarkedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  }, []);

  // Clear answer for current question
  const clearCurrentAnswer = useCallback(() => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      setUserAnswers((prev) => prev.filter((ua) => ua.questionId !== currentQuestion.id));
    }
  }, [questions, currentQuestionIndex]);

  // Submit exam
  const handleSubmitExam = useCallback(() => {
    setIsSubmitModal(true);
  }, []);

  const confirmSubmitExam = useCallback(async () => {
    setIsExamActive(false);

    const userId = parseInt(user?.userId || '1');
    const examIdNum = parseInt(examId || '0');

    try {
      await examService.submitExamAnswers(userId, examIdNum, userAnswers);
      message.success('Bài kiểm tra đã được nộp thành công!');
    } catch (error) {
      console.error('Error submitting exam:', error);
      message.error('Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.');
      setIsExamActive(true); // Re-enable exam if submission failed
      return;
    }

    // Store results in localStorage for the result page
    const examResult = {
      exam: exam,
      questions: questions,
      answers: answers,
      userAnswers: userAnswers,
      timeSpent: (exam?.duration ?? 0) * 60 - 120, // Simulate time spent
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem(`examResult_${examId}`, JSON.stringify(examResult));

    // Navigate to results page
    navigate(`/mock-interview-result/${examId}`);
  }, [user, examId, userAnswers, exam, questions, answers, navigate]);

  // Auto-submit when time is up
  const handleTimeUp = useCallback(() => {
    message.warning('Thời gian làm bài đã kết thúc. Bài kiểm tra sẽ được nộp tự động.');
    setIsExamActive(false);
    confirmSubmitExam();
  }, [confirmSubmitExam]);

  const handleOnBack = async () => {
    setIsExamActive(false);

    const userId = parseInt(user?.userId || '1');
    const examIdNum = parseInt(examId || '0');

    try {
      await examService.submitExamAnswers(userId, examIdNum, userAnswers);
      message.success('Bài kiểm tra đã được nộp thành công!');
    } catch (error) {
      console.error('Error submitting exam:', error);
      message.error('Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.');
      setIsExamActive(true); // Re-enable exam if submission failed
      setIsOpenBackModal(false);
      return;
    }

    // Store results in localStorage for the result page
    const examResult = {
      exam: exam,
      questions: questions,
      answers: answers,
      userAnswers: userAnswers,
      timeSpent: (exam?.duration ?? 0) * 60 - 120, // Simulate time spent
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem(`examResult_${examId}`, JSON.stringify(examResult));

    // Close modal and navigate back to mock interview list
    setIsOpenBackModal(false);
    navigate('/mock-interview');
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isExamActive) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      }
    };

    globalThis.window.addEventListener('keydown', handleKeyPress);
    return () => globalThis.window.removeEventListener('keydown', handleKeyPress);
  }, [isExamActive, goToPrevious, goToNext]);

  // Prevent page refresh/close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isExamActive) {
        e.preventDefault();
        const message =
          'Bạn có chắc chắn muốn rời khỏi trang? Tiến trình làm bài sẽ bị mất.';
        e.returnValue = message;
        return message;
      }
      return undefined;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isExamActive]);

  // Render question component based on type
  const renderQuestionComponent = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return null;

    const currentAnswers = answers[currentQuestion.id.toString()] || [];
    const userAnswer = userAnswers.find((ua) => ua.questionId === currentQuestion.id)?.answerContent || '';

    console.log('Current question:', currentQuestion);
    // console.log('Current answers:', currentAnswers);
    if (currentAnswers.length === 0 && currentQuestion.questionAnswer) {
      console.warn(`Question ${currentQuestion.id} has type ${currentQuestion.questionTypeId} but no answers. Showing explanation.`);
      return (
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-6 shadow-md border border-neutral-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {currentQuestion.questionText}
            </h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800">
                <span className="font-medium">Lưu ý:</span> Câu hỏi này chưa có đáp án lựa chọn. Vui lòng trả lời dựa trên kiến thức của bạn.
              </p>
            </div>
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-2 block">
                  Câu trả lời của bạn:
                </span>
                <textarea
                  value={typeof userAnswer === 'string' ? userAnswer : ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id.toString(), e.target.value)}
                  placeholder="Nhập câu trả lời của bạn..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical min-h-[120px]"
                  rows={5}
                />
              </label>
            </div>
          </div>
        </div>
      );
    }

    switch (currentQuestion.questionTypeId) {
      case 1: // SingleChoice
        return (
          <SingleChoiceQuestion
            question={currentQuestion}
            answers={currentAnswers}
            selectedAnswer={typeof userAnswer === 'string' ? userAnswer : null}
            onAnswerChange={(answerId) =>
              handleAnswerChange(currentQuestion.id.toString(), answerId || '')
            }
          />
        );

      case 2: // MultipleChoice
        return (
          <MultipleChoiceQuestion
            question={currentQuestion}
            answers={currentAnswers}
            selectedAnswers={
              typeof userAnswer === 'string' && userAnswer
                ? userAnswer.split('|')
                : []
            }
            onAnswerChange={(answerIds) =>
              handleAnswerChange(
                currentQuestion.id.toString(),
                answerIds.join('|')
              )
            }
          />
        );

      case 3: // OpenEnded
        return (
          <OpenEndedQuestion
            question={currentQuestion}
            userAnswer={typeof userAnswer === 'string' ? userAnswer : ''}
            onAnswerChange={(answer) =>
              handleAnswerChange(currentQuestion.id.toString(), answer)
            }
          />
        );

      case 4: // FillInTheBlank
        return (
          <FillInTheBlankQuestion
            question={currentQuestion}
            answers={currentAnswers}
            userAnswer={typeof userAnswer === 'string' ? userAnswer : ''}
            onAnswerChange={(answer) =>
              handleAnswerChange(currentQuestion.id.toString(), answer)
            }
          />
        );

      default:
        return <div>Unsupported question type</div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải bài kiểm tra...</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Không tìm thấy bài kiểm tra</p>
          <button
            onClick={() => navigate('/mock-interview')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const hasCurrentAnswer =
    currentQuestion &&
    userAnswers.some((ua) => ua.questionId === currentQuestion.id && ua.answerContent.trim() !== '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <ExamDetailHeader
              onBack={() => setIsOpenBackModal(true)}
              exam={exam}
              questions={questions}
            />
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">
                  Tiến độ làm bài
                </div>
                <Progress
                  type="circle"
                  percent={Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}
                  size={50}
                  strokeColor="#1890ff"
                  format={() => `${currentQuestionIndex + 1}/${questions.length}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left side - Question content (3 columns) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Current question */}
            <div>{renderQuestionComponent()}</div>

            {/* Question controls */}
            <QuestionControls
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={questions.length}
              currentQuestionId={currentQuestion?.id.toString() || ''}
              isMarked={
                currentQuestion
                  ? markedQuestions.has(currentQuestion.id.toString())
                  : false
              }
              hasAnswer={hasCurrentAnswer}
              onPrevious={goToPrevious}
              onNext={goToNext}
              onToggleMark={() =>
                currentQuestion &&
                toggleMarkQuestion(currentQuestion.id.toString())
              }
              onClearAnswer={clearCurrentAnswer}
              onSubmitExam={handleSubmitExam}
            />
          </div>

          {/* Right side - Timer and Navigator (1 column) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Timer */}
            <ExamTimer
              duration={exam.duration}
              onTimeUp={handleTimeUp}
              isActive={isExamActive}
            />

            {/* Question Navigator */}
            <QuestionNavigator
              questions={questions}
              currentQuestionIndex={currentQuestionIndex}
              userAnswers={userAnswers}
              markedQuestions={markedQuestions}
              onQuestionSelect={goToQuestion}
              onToggleMark={toggleMarkQuestion}
            />
          </div>
        </div>
      </div>

      {/* Back Confirmation Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <ExclamationCircleOutlined className="text-orange-500 mr-2" />
            <span>Xác nhận quay lại</span>
          </div>
        }
        open={isOpenBackModal}
        onOk={handleOnBack}
        onCancel={() => setIsOpenBackModal(false)}
        okText="Nộp bài và quay lại"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
        centered
      >
        <p>Bạn có chắc chắn muốn nộp bài và quay lại danh sách bài kiểm tra?</p>
        <p className="text-sm text-gray-600 mt-2">
          Sau khi nộp bài, bạn không thể thay đổi đáp án và sẽ được chuyển về trang danh sách bài kiểm tra.
        </p>
      </Modal>

      {/* Submit Confirmation Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <ExclamationCircleOutlined className="text-red-500 mr-2" />
            <span>Xác nhận nộp bài</span>
          </div>
        }
        open={isSubmitModal}
        onOk={confirmSubmitExam}
        onCancel={() => setIsSubmitModal(false)}
        okText="Nộp bài"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
        centered
      >
        <p>Bạn có chắc chắn muốn nộp bài kiểm tra?</p>
        <p className="text-sm text-gray-600 mt-2">
          Sau khi nộp bài, bạn không thể thay đổi đáp án và sẽ được chuyển đến trang kết quả.
        </p>
      </Modal>
    </div>
  );
};

export default MockInterviewDetail;
