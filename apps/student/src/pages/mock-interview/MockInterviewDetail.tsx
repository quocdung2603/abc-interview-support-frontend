import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Question, Answer, Exam } from '@abc-interview-support-frontend/types';
import SingleChoiceQuestion from './components/mock-interview-detail/SingleChoiceQuestion';
import MultipleChoiceQuestion from './components/mock-interview-detail/MultipleChoiceQuestion';
import FillInTheBlankQuestion from './components/mock-interview-detail/FillInTheBlankQuestion';
import OpenEndedQuestion from './components/mock-interview-detail/OpenEndedQuestion';
import QuestionNavigator from './components/mock-interview-detail/QuestionNavigator';
import ExamTimer from './components/mock-interview-detail/ExamTimer';
import QuestionControls from './components/mock-interview-detail/QuestionControls';
import { examService } from '@abc-interview-support-frontend/services';

interface UserAnswers {
  [questionId: string]: string; // Tất cả đáp án đều lưu dưới dạng string
}

interface MockInterviewDetailProps {
  examId?: string;
  onBack?: () => void;
}

const MockInterviewDetail: React.FC<MockInterviewDetailProps> = ({ examId: propExamId, onBack }) => {
  const propsExamId = propExamId;
  const navigate = useNavigate();

  // State management
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, Answer[]>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [markedQuestions, setMarkedQuestions] = useState<Set<string>>(
    new Set()
  );
  const [isExamActive, setIsExamActive] = useState(true);
  const [loading, setLoading] = useState(true);

  const getExamById = async (examId: string) => {
    try {
      const res = await examService.getExamById(examId);
      const exam = res || null;
      setExam(exam);
      setQuestions(exam.questions || []);
    } catch (error) {
      console.error('Error fetching exam:', error);
      setExam(null);
    }
  }

  const getAllAnswers = async () => {
    try {
      const res = await examService.getAllAnswer();
      const answersArray: Answer[] = res.content || [];
      const answersMap: Record<string, Answer[]> = {};
      answersArray.forEach((answer) => {
        if (!answersMap[answer.questionId]) {
          answersMap[answer.questionId] = [];
        }
        answersMap[answer.questionId].push(answer);
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
      getExamById(propsExamId || '');
      getAllAnswers().finally(() => setLoading(false));
    };

    initializeExam();
  }, [propsExamId]);

  // Handle answer changes
  const handleAnswerChange = useCallback(
    (questionId: string, answer: string) => {
      setUserAnswers((prev) => ({
        ...prev,
        [questionId]: answer,
      }));
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
      setUserAnswers((prev) => {
        const newAnswers = { ...prev };
        delete newAnswers[currentQuestion.id];
        return newAnswers;
      });
    }
  }, [questions, currentQuestionIndex]);

  // Submit exam
  const handleSubmitExam = useCallback(() => {
    const confirmSubmit = globalThis.window.confirm(
      'Bạn có chắc chắn muốn nộp bài? Sau khi nộp bài, bạn không thể thay đổi đáp án.'
    );

    if (confirmSubmit) {
      setIsExamActive(false);
      // Here you would typically submit to API
      console.log('Submitting exam with answers:', userAnswers);

      // Store results in localStorage for the result page
      const examResult = {
        exam: exam,
        questions: questions,
        answers: answers,
        userAnswers: userAnswers,
        timeSpent: (exam?.duration ?? 0) * 60 - 120, // Simulate time spent
        completedAt: new Date().toISOString(),
      };
      localStorage.setItem(`examResult_${propsExamId}`, JSON.stringify(examResult));

      // Navigate to results page
      navigate(`/mock-interview-result/${propsExamId}`);
    }
  }, [userAnswers, propsExamId, navigate, exam, questions, answers]);

  // Auto-submit when time is up
  const handleTimeUp = useCallback(() => {
    alert('Hết thời gian làm bài! Bài thi sẽ được tự động nộp.');
    setIsExamActive(false);
    handleSubmitExam();
  }, [handleSubmitExam]);

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

    console.log('Current question:', currentQuestion);
    console.log('Current answers:', currentAnswers);
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
            {currentQuestion.questionAnswer && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Gợi ý đáp án:</span><br />
                  {currentQuestion.questionAnswer}
                </p>
              </div>
            )}
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

      case 3: // FillInTheBlank
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

      case 4: // OpenEnded
        return (
          <OpenEndedQuestion
            question={currentQuestion}
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
    userAnswers[currentQuestion.id] !== undefined &&
    userAnswers[currentQuestion.id] !== '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  title="Quay lại danh sách bài kiểm tra"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Quay lại</span>
                </button>
              )}
              <div>
                <h1 className="text-lg font-bold text-gray-800">{exam.title}</h1>
                <p className="text-sm text-gray-600">
                  {exam.position} • {questions.length} câu hỏi • {exam.duration}{' '}
                  phút
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Câu {currentQuestionIndex + 1}/{questions.length}
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
    </div>
  );
};

export default MockInterviewDetail;
