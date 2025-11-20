import React from 'react';

interface QuestionControlsProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  currentQuestionId: string;
  isMarked: boolean;
  hasAnswer: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onToggleMark: () => void;
  onClearAnswer: () => void;
  onSubmitExam: () => void;
}

const QuestionControls: React.FC<QuestionControlsProps> = ({
  currentQuestionIndex,
  totalQuestions,
  currentQuestionId,
  isMarked,
  hasAnswer,
  onPrevious,
  onNext,
  onToggleMark,
  onClearAnswer,
  onSubmitExam,
}) => {
  const isFirst = currentQuestionIndex === 0;
  const isLast = currentQuestionIndex === totalQuestions - 1;

  const buttonStyles = {
    primary:
      'bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5',
    secondary:
      'bg-white hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-lg border border-gray-300 transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5',
    danger:
      'bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5',
    warning:
      'bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5',
    success:
      'bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 font-bold text-base',
    disabled:
      'bg-gray-300 text-gray-500 font-medium px-4 py-2 rounded-lg cursor-not-allowed',
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-neutral-200 p-6">
      {/* Question info */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-base font-semibold text-gray-800">
            Câu hỏi {currentQuestionIndex + 1} / {totalQuestions}
          </h3>
          <div className="flex items-center space-x-2">
            {hasAnswer && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Đã trả lời
              </span>
            )}
            {isMarked && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Đã đánh dấu
              </span>
            )}
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Question actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={onToggleMark}
          className={isMarked ? buttonStyles.warning : buttonStyles.secondary}
          title={
            isMarked
              ? 'Bỏ đánh dấu câu hỏi này'
              : 'Đánh dấu câu hỏi để xem lại sau'
          }
        >
          <svg
            className="w-4 h-4 inline mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {isMarked ? 'Bỏ đánh dấu' : 'Đánh dấu'}
        </button>

        <button
          onClick={onClearAnswer}
          disabled={!hasAnswer}
          className={hasAnswer ? buttonStyles.secondary : buttonStyles.disabled}
          title="Xóa tất cả đáp án đã chọn cho câu hỏi này"
        >
          <svg
            className="w-4 h-4 inline mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Xóa đáp án
        </button>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={onPrevious}
          disabled={isFirst}
          className={isFirst ? buttonStyles.disabled : buttonStyles.primary}
          title="Về câu hỏi trước"
        >
          <svg
            className="w-4 h-4 inline mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Câu trước
        </button>

        <button
          onClick={onSubmitExam}
          className={buttonStyles.success}
          title="Nộp bài và kết thúc bài thi"
        >
          <svg
            className="w-5 h-5 inline mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Nộp bài
        </button>

        <button
          onClick={onNext}
          disabled={isLast}
          className={isLast ? buttonStyles.disabled : buttonStyles.primary}
          title="Đến câu hỏi tiếp theo"
        >
          Câu tiếp
          <svg
            className="w-4 h-4 inline ml-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
          <div className="font-medium text-gray-700 mb-2">💡 Mẹo làm bài:</div>
          <ul className="space-y-1">
            <li>
              • Sử dụng <strong>"Đánh dấu"</strong> để đánh dấu câu hỏi cần xem
              lại
            </li>
            <li>
              • Bấm <strong>"Xóa đáp án"</strong> để xóa lựa chọn hiện tại
            </li>
            <li>• Kiểm tra danh sách câu hỏi bên phải để theo dõi tiến độ</li>
            <li>
              • Bấm <strong>"Nộp bài"</strong> khi đã hoàn thành
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QuestionControls;
