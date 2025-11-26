import React from 'react';
import { Question, Answer } from '@abc-interview-support-frontend/types';

interface MultipleChoiceQuestionProps {
  question: Question;
  answers: Answer[];
  selectedAnswers: string[];
  onAnswerChange: (answerIds: string[]) => void;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  answers,
  selectedAnswers,
  onAnswerChange,
}) => {
  const handleAnswerToggle = (answerId: string) => {
    const updatedAnswers = selectedAnswers.includes(answerId)
      ? selectedAnswers.filter((id) => id !== answerId)
      : [...selectedAnswers, answerId];
    onAnswerChange(updatedAnswers);
  };

  const checkboxStyles = {
    accentColor: '#0ea5e9',
    transform: 'scale(1.2)',
    marginRight: '12px',
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-6 shadow-md border border-neutral-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {question.questionContent}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          <span className="font-medium">Lưu ý:</span> Câu hỏi này có thể có
          nhiều đáp án đúng. Vui lòng chọn tất cả đáp án phù hợp.
        </p>

        <div className="space-y-3">
          {answers.map((answer) => (
            <label
              key={answer.answerId.toString()}
              className="flex items-start cursor-pointer p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              style={{
                borderColor: selectedAnswers.includes(answer.answerId.toString())
                  ? '#0ea5e9'
                  : '#e2e8f0',
                backgroundColor: selectedAnswers.includes(answer.answerId.toString())
                  ? '#f0f9ff'
                  : 'white',
              }}
            >
              <input
                type="checkbox"
                checked={selectedAnswers.includes(answer.answerId.toString())}
                onChange={() => handleAnswerToggle(answer.answerId.toString())}
                style={checkboxStyles}
                className="mt-1 mr-3"
              />
              <span className="text-gray-700 leading-relaxed flex-1">
                {answer.answerContent}
              </span>
            </label>
          ))}
        </div>

        {selectedAnswers.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <span className="font-medium">Đã chọn:</span>{' '}
              {selectedAnswers.length} đáp án
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultipleChoiceQuestion;
