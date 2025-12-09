import React from 'react';
import { QuestionInExam } from '@abc-interview-support-frontend/types';

interface UserAnswer {
  questionId: number;
  answerContent: string;
}

type UserAnswers = UserAnswer[];

interface QuestionNavigatorProps {
  questions: QuestionInExam[];
  currentQuestionIndex: number;
  userAnswers: UserAnswers; // Changed to array
  markedQuestions: Set<string>;
  onQuestionSelect: (index: number) => void;
  onToggleMark: (questionId: string) => void;
}

const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  questions,
  currentQuestionIndex,
  userAnswers,
  markedQuestions,
  onQuestionSelect,
  onToggleMark,
}) => {
  const getQuestionStatus = (question: Question, index: number) => {
    const hasAnswer =
      userAnswers.some((ua) => ua.questionId === question.id && ua.answerContent.trim() !== '');
    const isMarked = markedQuestions.has(question.id.toString());
    const isCurrent = index === currentQuestionIndex;

    if (isCurrent) {
      return {
        bgColor: '#1e40af',
        textColor: 'white',
        borderColor: '#1e40af',
        status: 'Đang làm',
      };
    }

    if (hasAnswer && isMarked) {
      return {
        bgColor: '#f59e0b',
        textColor: 'white',
        borderColor: '#f59e0b',
        status: 'Đã làm - Đánh dấu',
      };
    }

    if (hasAnswer) {
      return {
        bgColor: '#059669',
        textColor: 'white',
        borderColor: '#059669',
        status: 'Đã làm',
      };
    }

    if (isMarked) {
      return {
        bgColor: '#dc2626',
        textColor: 'white',
        borderColor: '#dc2626',
        status: 'Chưa làm - Đánh dấu',
      };
    }

    return {
      bgColor: '#f8fafc',
      textColor: '#64748b',
      borderColor: '#cbd5e1',
      status: 'Chưa làm',
    };
  };

  const getStatusStats = () => {
    let answered = 0;
    let marked = 0;
    let unanswered = 0;

    questions.forEach((question) => {
      const hasAnswer =
        userAnswers.some((ua) => ua.questionId === question.id && ua.answerContent.trim() !== '');
      const isMarked = markedQuestions.has(question.id.toString());

      if (hasAnswer) answered++;
      if (isMarked) marked++;
      if (!hasAnswer) unanswered++;
    });

    return { answered, marked, unanswered, total: questions.length };
  };

  const stats = getStatusStats();

  return (
    <div className="bg-white rounded-lg shadow-md border border-neutral-200 p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Danh sách câu hỏi
        </h3>

        {/* Thống kê tổng quan */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          <div className="bg-green-50 border border-green-200 rounded p-2">
            <span className="text-green-700 font-medium">
              Đã làm: {stats.answered}/{stats.total}
            </span>
          </div>
          <div className="bg-red-50 border border-red-200 rounded p-2">
            <span className="text-red-700 font-medium">
              Đánh dấu: {stats.marked}
            </span>
          </div>
        </div>

        {/* Chú thích */}
        <div className="text-xs text-gray-600 space-y-1 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="font-medium text-gray-700 mb-2">Chú thích:</div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-blue-600"></div>
            <span>Đang làm</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-green-600"></div>
            <span>Đã hoàn thành</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-yellow-500"></div>
            <span>Đã làm + Đánh dấu</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-red-600"></div>
            <span>Chưa làm + Đánh dấu</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-gray-200 border border-gray-300"></div>
            <span>Chưa làm</span>
          </div>
        </div>
      </div>

      {/* Danh sách câu hỏi */}
      <div className="grid grid-cols-5 gap-2 max-h-80 overflow-y-auto">
        {questions.map((question, index) => {
          const status = getQuestionStatus(question, index);
          const isMarked = markedQuestions.has(question.id.toString());

          return (
            <div key={question.id.toString()} className="relative">
              <button
                onClick={() => onQuestionSelect(index)}
                className="w-full h-10 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
                style={{
                  backgroundColor: status.bgColor,
                  color: status.textColor,
                  border: `2px solid ${status.borderColor}`,
                }}
                title={`Câu ${index + 1}: ${status.status}`}
              >
                {index + 1}
              </button>

              {/* Biểu tượng đánh dấu */}
              {isMarked && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleMark(question.id.toString());
                  }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition-colors"
                  title="Bỏ đánh dấu"
                >
                  ★
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
          <span>Tiến độ</span>
          <span>
            {stats.answered}/{stats.total}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(stats.answered / stats.total) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default QuestionNavigator;
