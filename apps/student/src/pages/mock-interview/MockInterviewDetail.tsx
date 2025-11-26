import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Question, Answer, Exam } from '@abc-interview-support-frontend/types';
import SingleChoiceQuestion from './components/mock-interview-detail/SingleChoiceQuestion';
import MultipleChoiceQuestion from './components/mock-interview-detail/MultipleChoiceQuestion';
import FillInTheBlankQuestion from './components/mock-interview-detail/FillInTheBlankQuestion';
import OpenEndedQuestion from './components/mock-interview-detail/OpenEndedQuestion';
import QuestionNavigator from './components/mock-interview-detail/QuestionNavigator';
import ExamTimer from './components/mock-interview-detail/ExamTimer';
import QuestionControls from './components/mock-interview-detail/QuestionControls';

interface UserAnswers {
  [questionId: string]: string; // Tất cả đáp án đều lưu dưới dạng string
}

const MockInterviewDetail = () => {
  const { examId } = useParams<{ examId: string }>();
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

  // Mock data for development
  const mockExam: Exam = {
    id: 1,
    userId: 1,
    examType: 'RECRUITER',
    title: 'Bài kiểm tra React Developer - Level Junior',
    position: 'React Developer',
    fieldId: 1,
    levelId: 1,
    topicIds: [1, 2, 3], // React, JavaScript, HTML/CSS
    questionTypeIds: [1, 2, 3, 4], // SingleChoice, MultipleChoice, FillInTheBlank, OpenEnded
    questionCount: 10,
    duration: 60, // 60 minutes
    status: 'ACTIVE',
    language: 'Vietnamese',
    createdAt: new Date().toISOString(),
    createdBy: '1',
  };

  const mockQuestions: Question[] = [
    {
      questionId: '1',
      userId: 'system',
      topicId: 'react',
      fieldId: 'frontend',
      levelId: 'junior',
      questionTypeId: 'SingleChoice',
      questionContent: 'React là gì?',
      status: 'Approved',
      language: 'Vietnamese',
      createdAt: new Date(),
      usefulVote: 0,
      unusefulVote: 0,
    },
    {
      questionId: '2',
      userId: 'system',
      topicId: 'react',
      fieldId: 'frontend',
      levelId: 'junior',
      questionTypeId: 'MultipleChoice',
      questionContent:
        'Những Hook nào được built-in trong React? (Chọn tất cả đáp án đúng)',
      status: 'Approved',
      language: 'Vietnamese',
      createdAt: new Date(),
      usefulVote: 0,
      unusefulVote: 0,
    },
    {
      questionId: '3',
      userId: 'system',
      topicId: 'javascript',
      fieldId: 'frontend',
      levelId: 'junior',
      questionTypeId: 'FillInTheBlank',
      questionContent:
        'Để khai báo một biến const trong JavaScript, ta sử dụng từ khóa _____ và để khai báo function, ta sử dụng từ khóa _____.',
      status: 'Approved',
      language: 'Vietnamese',
      createdAt: new Date(),
      usefulVote: 0,
      unusefulVote: 0,
    },
    {
      questionId: '4',
      userId: 'system',
      topicId: 'react',
      fieldId: 'frontend',
      levelId: 'junior',
      questionTypeId: 'OpenEnded',
      questionContent:
        'Hãy giải thích sự khác biệt giữa state và props trong React. Đưa ra ví dụ cụ thể.',
      status: 'Approved',
      language: 'Vietnamese',
      createdAt: new Date(),
      usefulVote: 0,
      unusefulVote: 0,
    },
    {
      questionId: '5',
      userId: 'system',
      topicId: 'javascript',
      fieldId: 'frontend',
      levelId: 'junior',
      questionTypeId: 'FillInTheBlank',
      questionContent:
        'Trong JavaScript, để lặp qua một mảng, ta có thể sử dụng vòng lặp _____ hoặc phương thức _____ hoặc _____.',
      status: 'Approved',
      language: 'Vietnamese',
      createdAt: new Date(),
      usefulVote: 0,
      unusefulVote: 0,
    },
  ];

  const mockAnswers: Record<string, Answer[]> = {
    '1': [
      {
        answerId: 'a1-1',
        userId: 'system',
        questionId: '1',
        questionTypeId: 'SingleChoice',
        answerContent:
          'Một thư viện JavaScript để xây dựng giao diện người dùng',
        isCorrect: true,
        usefulVote: 0,
        unusefulVote: 0,
        createdAt: new Date(),
      },
      {
        answerId: 'a1-2',
        userId: 'system',
        questionId: '1',
        questionTypeId: 'SingleChoice',
        answerContent: 'Một framework backend cho Node.js',
        isCorrect: false,
        usefulVote: 0,
        unusefulVote: 0,
        createdAt: new Date(),
      },
      {
        answerId: 'a1-3',
        userId: 'system',
        questionId: '1',
        questionTypeId: 'SingleChoice',
        answerContent: 'Một cơ sở dữ liệu',
        isCorrect: false,
        usefulVote: 0,
        unusefulVote: 0,
        createdAt: new Date(),
      },
      {
        answerId: 'a1-4',
        userId: 'system',
        questionId: '1',
        questionTypeId: 'SingleChoice',
        answerContent: 'Một ngôn ngữ lập trình',
        isCorrect: false,
        usefulVote: 0,
        unusefulVote: 0,
        createdAt: new Date(),
      },
    ],
    '2': [
      {
        answerId: 'a2-1',
        userId: 'system',
        questionId: '2',
        questionTypeId: 'MultipleChoice',
        answerContent: 'useState',
        isCorrect: true,
        usefulVote: 0,
        unusefulVote: 0,
        createdAt: new Date(),
      },
      {
        answerId: 'a2-2',
        userId: 'system',
        questionId: '2',
        questionTypeId: 'MultipleChoice',
        answerContent: 'useEffect',
        isCorrect: true,
        usefulVote: 0,
        unusefulVote: 0,
        createdAt: new Date(),
      },
      {
        answerId: 'a2-3',
        userId: 'system',
        questionId: '2',
        questionTypeId: 'MultipleChoice',
        answerContent: 'useContext',
        isCorrect: true,
        usefulVote: 0,
        unusefulVote: 0,
        createdAt: new Date(),
      },
      {
        answerId: 'a2-4',
        userId: 'system',
        questionId: '2',
        questionTypeId: 'MultipleChoice',
        answerContent: 'useCustomHook',
        isCorrect: false,
        usefulVote: 0,
        unusefulVote: 0,
        createdAt: new Date(),
      },
    ],
    '3': [
      {
        answerId: 'a3-1',
        userId: 'system',
        questionId: '3',
        questionTypeId: 'FillInTheBlank',
        answerContent: 'const',
        isCorrect: true,
        usefulVote: 0,
        unusefulVote: 0,
        createdAt: new Date(),
      },
      {
        answerId: 'a3-2',
        userId: 'system',
        questionId: '3',
        questionTypeId: 'FillInTheBlank',
        answerContent: 'function',
        isCorrect: true,
        usefulVote: 0,
        unusefulVote: 0,
        createdAt: new Date(),
      },
      {
        answerId: 'a3-3',
        userId: 'system',
        questionId: '3',
        questionTypeId: 'FillInTheBlank',
        answerContent: 'let',
        isCorrect: false,
        usefulVote: 0,
        unusefulVote: 0,
        createdAt: new Date(),
      },
      {
        answerId: 'a3-4',
        userId: 'system',
        questionId: '3',
        questionTypeId: 'FillInTheBlank',
        answerContent: 'var',
        isCorrect: false,
        usefulVote: 0,
        unusefulVote: 0,
        createdAt: new Date(),
      },
      {
        answerId: 'a3-5',
        userId: 'system',
        questionId: '3',
        questionTypeId: 'FillInTheBlank',
        answerContent: 'arrow',
        isCorrect: false,
        usefulVote: 0,
        unusefulVote: 0,
        createdAt: new Date(),
      },
      {
        answerId: 'a3-6',
        userId: 'system',
        questionId: '3',
        questionTypeId: 'FillInTheBlank',
        answerContent: 'method',
        isCorrect: false,
        usefulVote: 0,
        unusefulVote: 0,
        createdAt: new Date(),
      },
    ],
    '5': [
      {
        answerId: 'a5-1',
        userId: 'system',
        questionId: '5',
        questionTypeId: 'FillInTheBlank',
        answerContent: 'for',
        isCorrect: true,
        usefulVote: 0,
        unusefulVote: 0,
        createdAt: new Date(),
      },
      {
        answerId: 'a5-2',
        userId: 'system',
        questionId: '5',
        questionTypeId: 'FillInTheBlank',
        answerContent: 'forEach',
        isCorrect: true,
        usefulVote: 0,
        unusefulVote: 0,
        createdAt: new Date(),
      },
      {
        answerId: 'a5-3',
        userId: 'system',
        questionId: '5',
        questionTypeId: 'FillInTheBlank',
        answerContent: 'map',
        isCorrect: true,
        usefulVote: 0,
        unusefulVote: 0,
        createdAt: new Date(),
      },
      {
        answerId: 'a5-4',
        userId: 'system',
        questionId: '5',
        questionTypeId: 'FillInTheBlank',
        answerContent: 'while',
        isCorrect: false,
        usefulVote: 0,
        unusefulVote: 0,
        createdAt: new Date(),
      },
      {
        answerId: 'a5-5',
        userId: 'system',
        questionId: '5',
        questionTypeId: 'FillInTheBlank',
        answerContent: 'filter',
        isCorrect: false,
        usefulVote: 0,
        unusefulVote: 0,
        createdAt: new Date(),
      },
      {
        answerId: 'a5-6',
        userId: 'system',
        questionId: '5',
        questionTypeId: 'FillInTheBlank',
        answerContent: 'reduce',
        isCorrect: false,
        usefulVote: 0,
        unusefulVote: 0,
        createdAt: new Date(),
      },
    ],
  };

  // Initialize mock data
  useEffect(() => {
    const initializeExam = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setExam(mockExam);
        setQuestions(mockQuestions);
        setAnswers(mockAnswers);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load exam:', error);
        setLoading(false);
      }
    };

    initializeExam();
  }, [examId]);

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
        delete newAnswers[currentQuestion.questionId];
        return newAnswers;
      });
    }
  }, [questions, currentQuestionIndex]);

  // Submit exam
  const handleSubmitExam = useCallback(() => {
    const confirmSubmit = window.confirm(
      'Bạn có chắc chắn muốn nộp bài? Sau khi nộp bài, bạn không thể thay đổi đáp án.'
    );

    if (confirmSubmit) {
      setIsExamActive(false);
      // Here you would typically submit to API
      console.log('Submitting exam with answers:', userAnswers);

      // Store results in localStorage for the result page
      const examResult = {
        exam: mockExam,
        questions: mockQuestions,
        answers: mockAnswers,
        userAnswers: userAnswers,
        timeSpent: mockExam.duration * 60 - 120, // Simulate time spent
        completedAt: new Date().toISOString(),
      };
      localStorage.setItem(`examResult_${examId}`, JSON.stringify(examResult));

      // Navigate to results page
      navigate(`/mock-interview-result/${examId}`);
    }
  }, [userAnswers, examId, navigate]);

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

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
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

    const currentAnswers = answers[currentQuestion.questionId] || [];
    const userAnswer = userAnswers[currentQuestion.questionId];

    switch (currentQuestion.questionTypeId) {
      case 'SingleChoice':
        return (
          <SingleChoiceQuestion
            question={currentQuestion}
            answers={currentAnswers}
            selectedAnswer={typeof userAnswer === 'string' ? userAnswer : null}
            onAnswerChange={(answerId) =>
              handleAnswerChange(currentQuestion.questionId, answerId || '')
            }
          />
        );

      case 'MultipleChoice':
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
                currentQuestion.questionId,
                answerIds.join('|')
              )
            }
          />
        );

      case 'FillInTheBlank':
        return (
          <FillInTheBlankQuestion
            question={currentQuestion}
            answers={currentAnswers}
            userAnswer={typeof userAnswer === 'string' ? userAnswer : ''}
            onAnswerChange={(answer) =>
              handleAnswerChange(currentQuestion.questionId, answer)
            }
          />
        );

      case 'OpenEnded':
        return (
          <OpenEndedQuestion
            question={currentQuestion}
            userAnswer={typeof userAnswer === 'string' ? userAnswer : ''}
            onAnswerChange={(answer) =>
              handleAnswerChange(currentQuestion.questionId, answer)
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
    userAnswers[currentQuestion.questionId] !== undefined &&
    userAnswers[currentQuestion.questionId] !== '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-800">{exam.title}</h1>
              <p className="text-sm text-gray-600">
                {exam.position} • {questions.length} câu hỏi • {exam.duration}{' '}
                phút
              </p>
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
              currentQuestionId={currentQuestion?.questionId || ''}
              isMarked={
                currentQuestion
                  ? markedQuestions.has(currentQuestion.questionId)
                  : false
              }
              hasAnswer={hasCurrentAnswer}
              onPrevious={goToPrevious}
              onNext={goToNext}
              onToggleMark={() =>
                currentQuestion &&
                toggleMarkQuestion(currentQuestion.questionId)
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
