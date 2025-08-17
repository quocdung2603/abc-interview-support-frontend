import React, { useState, useEffect } from 'react';
import { Question, Answer } from '../../../../../../../libs/types/src/index';

interface FillInTheBlankQuestionProps {
  question: Question;
  answers: Answer[]; // Danh sách các đáp án có thể chọn
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
}

const FillInTheBlankQuestion: React.FC<FillInTheBlankQuestionProps> = ({
  question,
  answers,
  userAnswer,
  onAnswerChange,
}) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  useEffect(() => {
    if (userAnswer) {
      setSelectedValues(userAnswer.split('|'));
    } else {
      // Đếm số chỗ trống
      const blanksCount = getBlanksCount();
      setSelectedValues(new Array(blanksCount).fill(''));
    }
  }, [userAnswer]);

  const getBlanksCount = () => {
    const questionText = question.questionContent;
    const blankPattern = /(_____+|\[blank\]|\{blank\})/gi;
    const matches = questionText.match(blankPattern);
    return matches ? matches.length : 1;
  };

  const handleSelectChange = (index: number, value: string) => {
    const newValues = [...selectedValues];
    newValues[index] = value;
    setSelectedValues(newValues);
    onAnswerChange(newValues.join('|'));
  };

  const selectStyles = {
    padding: '8px 12px',
    border: '2px solid #0ea5e9',
    borderRadius: '6px',
    backgroundColor: '#f0f9ff',
    fontSize: '16px',
    fontWeight: '500',
    color: '#1e40af',
    minWidth: '150px',
    cursor: 'pointer',
  };

  // Tách câu hỏi thành các phần để hiển thị chỗ trống
  const renderQuestionWithBlanks = () => {
    const questionText = question.questionContent;
    const blankPattern = /(_____+|\[blank\]|\{blank\})/gi;
    const parts = questionText.split(blankPattern);

    let blankIndex = 0;
    return parts.map((part, index) => {
      if (blankPattern.test(part)) {
        const currentBlankIndex = blankIndex;
        blankIndex++;
        return (
          <select
            key={`${question.questionId}-blank-${currentBlankIndex}`}
            value={selectedValues[currentBlankIndex] || ''}
            onChange={(e) =>
              handleSelectChange(currentBlankIndex, e.target.value)
            }
            style={selectStyles}
            className="mx-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200"
          >
            <option value="">-- Chọn đáp án --</option>
            {answers.map((answer) => (
              <option key={answer.answerId} value={answer.answerContent}>
                {answer.answerContent}
              </option>
            ))}
          </select>
        );
      }
      return <span key={`${question.questionId}-text-${index}`}>{part}</span>;
    });
  };

  const getTotalBlanks = () => getBlanksCount();
  const getFilledBlanks = () =>
    selectedValues.filter((val) => val !== '').length;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-6 shadow-md border border-neutral-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Câu hỏi điền khuyết
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          <span className="font-medium">Hướng dẫn:</span> Chọn từ phù hợp từ
          danh sách để điền vào chỗ trống.
        </p>

        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 mb-4">
          <div className="text-gray-800 leading-relaxed text-lg">
            {renderQuestionWithBlanks()}
          </div>
        </div>

        {/* Nếu không có dấu blank trong câu hỏi, hiển thị select riêng */}
        {!question.questionContent.match(/(_____+|\[blank\]|\{blank\})/gi) && (
          <div className="mt-4">
            <div className="text-gray-800 leading-relaxed text-lg mb-4">
              {question.questionContent}
            </div>
            <div>
              <label
                htmlFor={`answer-${question.questionId}`}
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Đáp án của bạn:
              </label>
              <select
                id={`answer-${question.questionId}`}
                value={selectedValues[0] || ''}
                onChange={(e) => handleSelectChange(0, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              >
                <option value="">-- Chọn đáp án --</option>
                {answers.map((answer) => (
                  <option key={answer.answerId} value={answer.answerContent}>
                    {answer.answerContent}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Hiển thị tiến độ */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex justify-between items-center text-sm text-blue-700 mb-2">
            <span className="font-medium">Tiến độ:</span>
            <span>
              {getFilledBlanks()}/{getTotalBlanks()} chỗ trống đã điền
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(getFilledBlanks() / getTotalBlanks()) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Hiển thị đáp án đã chọn */}
        {getFilledBlanks() > 0 && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700 mb-2">
              <span className="font-medium">Đáp án đã chọn:</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedValues.map(
                (value, index) =>
                  value && (
                    <span
                      key={`${question.questionId}-selected-${index}-${value}`}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      Chỗ trống {index + 1}: {value}
                    </span>
                  )
              )}
            </div>
          </div>
        )}

        {/* Danh sách các lựa chọn có sẵn */}
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">
            💡 Các lựa chọn có sẵn:
          </p>
          <div className="flex flex-wrap gap-2">
            {answers.map((answer) => (
              <span
                key={answer.answerId}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
              >
                {answer.answerContent}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FillInTheBlankQuestion;
