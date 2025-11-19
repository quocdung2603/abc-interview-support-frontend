import React from 'react';

interface QuestionNavigationProps {
  currentQuestionId: number;
  allQuestions: Array<{ id: number; questionContent: string }>;
  onQuestionClick: (questionId: number) => void;
}

export const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  currentQuestionId,
  allQuestions,
  onQuestionClick,
}) => {
  // Tìm index của câu hỏi hiện tại
  const currentIndex = allQuestions.findIndex(
    (q) => q.id === currentQuestionId
  );

  // Tìm câu hỏi trước và sau
  const previousQuestion =
    currentIndex > 0 ? allQuestions[currentIndex - 1] : null;
  const nextQuestion =
    currentIndex < allQuestions.length - 1
      ? allQuestions[currentIndex + 1]
      : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
      <div className="flex items-center justify-between gap-4">
        {/* Nút câu hỏi trước */}
        <div className="flex-1">
          {previousQuestion ? (
            <button
              onClick={() => onQuestionClick(previousQuestion.id)}
              className="w-full text-left p-4 rounded-lg border border-neutral-200 hover:border-primary hover:bg-primary-light transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-neutral-400 group-hover:text-primary transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-500 mb-1">Câu hỏi trước</p>
                  <p className="text-neutral-900 group-hover:text-primary transition-colors line-clamp-2">
                    {previousQuestion.questionContent}
                  </p>
                </div>
              </div>
            </button>
          ) : (
            <div className="w-full p-4 rounded-lg border border-neutral-100 bg-neutral-50">
              <div className="flex items-center gap-3 opacity-50">
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-neutral-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-neutral-400">
                    Đây là câu hỏi đầu tiên
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Vị trí hiện tại */}
        <div className="flex-shrink-0 px-4">
          <div className="text-center">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium mb-2">
              {currentIndex + 1}
            </div>
            <p className="text-xs text-neutral-500">
              {currentIndex + 1} / {allQuestions.length}
            </p>
          </div>
        </div>

        {/* Nút câu hỏi sau */}
        <div className="flex-1">
          {nextQuestion ? (
            <button
              onClick={() => onQuestionClick(nextQuestion.id)}
              className="w-full text-right p-4 rounded-lg border border-neutral-200 hover:border-primary hover:bg-primary-light transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-500 mb-1 text-right">
                    Câu hỏi tiếp theo
                  </p>
                  <p className="text-neutral-900 group-hover:text-primary transition-colors line-clamp-2 text-right">
                    {nextQuestion.questionContent}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-neutral-400 group-hover:text-primary transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </button>
          ) : (
            <div className="w-full p-4 rounded-lg border border-neutral-100 bg-neutral-50">
              <div className="flex items-center gap-3 opacity-50">
                <div className="flex-1">
                  <p className="text-sm text-neutral-400 text-right">
                    Đây là câu hỏi cuối cùng
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-neutral-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Thanh tiến trình */}
      <div className="mt-6 pt-4 border-t border-neutral-200">
        <div className="w-full bg-neutral-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / allQuestions.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};
