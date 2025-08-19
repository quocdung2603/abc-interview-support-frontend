import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Question, Answer, Exam } from '../../../../../libs/types/src/index';
import ExamSummary from './components/mock-interview-result/ExamSummary';
import QuestionResultItem from './components/mock-interview-result/QuestionResultItem';
import AIReviewModal from './components/mock-interview-result/AIReviewModal';
import AIReviewButton from './components/mock-interview-result/AIReviewButton';

const MockInterviewResult = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, Answer[]>>({});
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [aiModalVisible, setAiModalVisible] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  // Mock data - In real app, this would come from API/props/localStorage
  const mockExam: Exam = {
    examId: id || 'mock-exam-1',
    examType: 'Virtual',
    title: 'Bài kiểm tra React Developer - Level Junior',
    position: 'React Developer',
    topics: JSON.stringify(['React', 'JavaScript', 'HTML/CSS']),
    questionTypes: JSON.stringify([
      'SingleChoice',
      'MultipleChoice',
      'FillInTheBlank',
      'OpenEnded',
    ]),
    questionCount: 10,
    duration: 60,
    status: 'Completed',
    language: 'Vietnamese',
    createdAt: new Date(),
    createdBy: 'system',
  };

  const mockQuestions: Question[] = [
    {
      questionId: '1',
      userId: 'system',
      topicId: 'React',
      fieldId: 'frontend',
      levelId: 'junior',
      questionTypeId: 'SingleChoice',
      questionContent: 'React là gì?',
      questionAnswer:
        'React là một thư viện JavaScript được phát triển bởi Facebook để xây dựng giao diện người dùng, đặc biệt là cho các ứng dụng web đơn trang (SPA). React sử dụng khái niệm component-based architecture và virtual DOM để tối ưu hiệu suất.',
      status: 'Approved',
      language: 'Vietnamese',
      createdAt: new Date(),
      usefulVote: 0,
      unusefulVote: 0,
    },
    {
      questionId: '2',
      userId: 'system',
      topicId: 'React',
      fieldId: 'frontend',
      levelId: 'junior',
      questionTypeId: 'MultipleChoice',
      questionContent:
        'Những Hook nào được built-in trong React? (Chọn tất cả đáp án đúng)',
      questionAnswer:
        'React cung cấp nhiều built-in hooks như useState để quản lý state, useEffect để xử lý side effects, useContext để consume context, useReducer cho state phức tạp, useMemo và useCallback để tối ưu hiệu suất.',
      status: 'Approved',
      language: 'Vietnamese',
      createdAt: new Date(),
      usefulVote: 0,
      unusefulVote: 0,
    },
    {
      questionId: '3',
      userId: 'system',
      topicId: 'JavaScript',
      fieldId: 'frontend',
      levelId: 'junior',
      questionTypeId: 'FillInTheBlank',
      questionContent:
        'Để khai báo một biến const trong JavaScript, ta sử dụng từ khóa _____ và để khai báo function, ta sử dụng từ khóa _____.',
      questionAnswer:
        'Từ khóa "const" được sử dụng để khai báo biến không thể thay đổi giá trị sau khi được gán. Từ khóa "function" được sử dụng để khai báo function trong JavaScript. Ngoài ra còn có arrow function syntax (=>) là cách khai báo function ngắn gọn hơn.',
      status: 'Approved',
      language: 'Vietnamese',
      createdAt: new Date(),
      usefulVote: 0,
      unusefulVote: 0,
    },
    {
      questionId: '4',
      userId: 'system',
      topicId: 'React',
      fieldId: 'frontend',
      levelId: 'junior',
      questionTypeId: 'OpenEnded',
      questionContent:
        'Hãy giải thích sự khác biệt giữa state và props trong React. Đưa ra ví dụ cụ thể.',
      questionAnswer:
        'State và props là hai khái niệm quan trọng trong React: Props (properties) là dữ liệu được truyền từ component cha xuống component con, không thể thay đổi trong component con (read-only). State là dữ liệu nội bộ của component, có thể thay đổi và khi thay đổi sẽ trigger re-render.',
      status: 'Approved',
      language: 'Vietnamese',
      createdAt: new Date(),
      usefulVote: 0,
      unusefulVote: 0,
    },
    {
      questionId: '5',
      userId: 'system',
      topicId: 'JavaScript',
      fieldId: 'frontend',
      levelId: 'junior',
      questionTypeId: 'FillInTheBlank',
      questionContent:
        'Trong JavaScript, để lặp qua một mảng, ta có thể sử dụng vòng lặp _____ hoặc phương thức _____ hoặc _____.',
      questionAnswer:
        'Có nhiều cách để lặp qua mảng trong JavaScript: vòng lặp "for" truyền thống, phương thức "forEach" để thực hiện một hành động với mỗi phần tử, và phương thức "map" để tạo mảng mới từ việc transform mỗi phần tử.',
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
    ],
  };

  // Mock user answers - In real app, this would come from the completed exam
  const mockUserAnswers: Record<string, string> = {
    '1': 'a1-1', // Correct
    '2': 'a2-1|a2-2', // Partially correct (missing a2-3)
    '3': 'let|arrow', // Incorrect
    '4': 'State là dữ liệu nội bộ của component, props là dữ liệu từ component cha truyền xuống.', // Correct but brief
    '5': 'for|forEach|map', // Correct
  };

  useEffect(() => {
    const initializeResult = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Try to get result from localStorage first
        const storedResult = localStorage.getItem(`examResult_${id}`);
        if (storedResult) {
          const result = JSON.parse(storedResult);
          setExam(result.exam);
          setQuestions(result.questions);
          setAnswers(result.answers);
          setUserAnswers(result.userAnswers);
          setTimeSpent(result.timeSpent);
        } else {
          // Fallback to mock data
          setExam(mockExam);
          setQuestions(mockQuestions);
          setAnswers(mockAnswers);
          setUserAnswers(mockUserAnswers);
          setTimeSpent(2340); // 39 minutes in seconds
        }

        setLoading(false);
      } catch (error) {
        console.error('Failed to load exam result:', error);
        setLoading(false);
      }
    };

    initializeResult();
  }, [id]);

  // Calculate results
  const calculateResults = () => {
    let correctAnswers = 0;
    let totalQuestions = questions.length;

    questions.forEach((question) => {
      const userAnswer = userAnswers[question.questionId];
      const questionAnswers = answers[question.questionId] || [];

      if (!userAnswer) return;

      let isCorrect = false;

      switch (question.questionTypeId) {
        case 'SingleChoice': {
          const correctAnswer = questionAnswers.find((a) => a.isCorrect);
          isCorrect = userAnswer === correctAnswer?.answerId;
          break;
        }

        case 'MultipleChoice': {
          const correctAnswerIds = questionAnswers
            .filter((a) => a.isCorrect)
            .map((a) => a.answerId);
          const userAnswerIds = userAnswer.split('|');
          isCorrect =
            correctAnswerIds.length === userAnswerIds.length &&
            correctAnswerIds.every((id) => userAnswerIds.includes(id));
          break;
        }

        case 'FillInTheBlank': {
          const correctAnswers = questionAnswers
            .filter((a) => a.isCorrect)
            .map((a) => a.answerContent);
          const userAnswersArray = userAnswer.split('|');
          isCorrect =
            correctAnswers.length === userAnswersArray.length &&
            correctAnswers.every(
              (correct, index) =>
                userAnswersArray[index]?.toLowerCase() === correct.toLowerCase()
            );
          break;
        }

        case 'OpenEnded': {
          // For mock purposes, consider it correct if user provided an answer
          // In real app, this would need AI evaluation or manual grading
          isCorrect = userAnswer.length > 20; // Simple length check
          break;
        }
      }

      if (isCorrect) correctAnswers++;
    });

    const score =
      totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    return { correctAnswers, totalQuestions, score };
  };

  const checkQuestionCorrect = (question: Question): boolean => {
    const userAnswer = userAnswers[question.questionId];
    const questionAnswers = answers[question.questionId] || [];

    if (!userAnswer) return false;

    switch (question.questionTypeId) {
      case 'SingleChoice': {
        const correctAnswer = questionAnswers.find((a) => a.isCorrect);
        return userAnswer === correctAnswer?.answerId;
      }

      case 'MultipleChoice': {
        const correctAnswerIds = questionAnswers
          .filter((a) => a.isCorrect)
          .map((a) => a.answerId);
        const userAnswerIds = userAnswer.split('|');
        return (
          correctAnswerIds.length === userAnswerIds.length &&
          correctAnswerIds.every((id) => userAnswerIds.includes(id))
        );
      }

      case 'FillInTheBlank': {
        const correctAnswers = questionAnswers
          .filter((a) => a.isCorrect)
          .map((a) => a.answerContent);
        const userAnswersArray = userAnswer.split('|');
        return (
          correctAnswers.length === userAnswersArray.length &&
          correctAnswers.every(
            (correct, index) =>
              userAnswersArray[index]?.toLowerCase() === correct.toLowerCase()
          )
        );
      }

      case 'OpenEnded':
        return userAnswer.length > 20;
    }

    return false;
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

  if (!exam || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            Không tìm thấy kết quả bài kiểm tra
          </p>
          <button
            onClick={() => navigate('/student/mock-interview')}
            className="btn-primary"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const results = calculateResults();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate('/student/mock-interview')}
                className="btn-outline btn-sm"
                style={{ marginRight: '1rem' }}
              >
                ← Quay lại
              </button>
            </div>
            <div className="text-sm text-gray-600">
              Hoàn thành lúc: {new Date().toLocaleString('vi-VN')}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Exam Summary */}
        <ExamSummary
          exam={exam}
          totalQuestions={results.totalQuestions}
          correctAnswers={results.correctAnswers}
          timeSpent={timeSpent}
          score={results.score}
        />

        {/* Questions and Results */}
        <div className="card-elevated" style={{ padding: '2rem' }}>
          <h3 className="text-heading-3" style={{ marginBottom: '1.5rem' }}>
            Chi tiết kết quả từng câu hỏi
          </h3>

          <div style={{ marginBottom: '1rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                fontSize: '0.875rem',
                color: '#64748b',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <div
                  style={{
                    width: '1rem',
                    height: '1rem',
                    borderRadius: '50%',
                    background: '#059669',
                  }}
                />
                <span>Câu trả lời đúng</span>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <div
                  style={{
                    width: '1rem',
                    height: '1rem',
                    borderRadius: '50%',
                    background: '#dc2626',
                  }}
                />
                <span>Câu trả lời sai</span>
              </div>
            </div>
          </div>

          {questions.map((question, index) => (
            <QuestionResultItem
              key={question.questionId}
              question={question}
              answers={answers[question.questionId] || []}
              userAnswer={userAnswers[question.questionId] || ''}
              isCorrect={checkQuestionCorrect(question)}
              questionNumber={index + 1}
            />
          ))}
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
            className="btn-secondary"
          >
            Làm bài khác
          </button>
          <button onClick={() => window.print()} className="btn-outline">
            📄 In kết quả
          </button>
        </div>
      </div>

      {/* AI Review Button */}
      <AIReviewButton onClick={() => setAiModalVisible(true)} />

      {/* AI Review Modal */}
      <AIReviewModal
        visible={aiModalVisible}
        onClose={() => setAiModalVisible(false)}
        questions={questions}
        answers={answers}
        userAnswers={userAnswers}
        correctAnswers={results.correctAnswers}
        totalQuestions={results.totalQuestions}
        timeSpent={timeSpent}
      />
    </div>
  );
};

export default MockInterviewResult;
