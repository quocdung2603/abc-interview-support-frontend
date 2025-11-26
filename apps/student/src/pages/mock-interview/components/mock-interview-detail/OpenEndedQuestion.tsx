import React, { useState, useEffect } from 'react';
import { Question } from '@abc-interview-support-frontend/types';

interface OpenEndedQuestionProps {
  question: Question;
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
}

const OpenEndedQuestion: React.FC<OpenEndedQuestionProps> = ({
  question,
  userAnswer,
  onAnswerChange,
}) => {
  const [textValue, setTextValue] = useState(userAnswer);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setTextValue(userAnswer);
    updateCounts(userAnswer);
  }, [userAnswer]);

  const updateCounts = (text: string) => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setCharCount(text.length);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTextValue(value);
    updateCounts(value);
    onAnswerChange(value);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-6 shadow-md border border-neutral-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Câu hỏi tự luận
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          <span className="font-medium">Hướng dẫn:</span> Trình bày câu trả lời
          của bạn một cách chi tiết và rõ ràng. Bạn có thể sử dụng nhiều đoạn
          văn để giải thích.
        </p>

        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 mb-6">
          <div className="text-gray-800 leading-relaxed text-lg">
            {question.questionContent}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor={`essay-${question.id}`}
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Câu trả lời của bạn:
            </label>
            <textarea
              id={`essay-${question.id}`}
              value={textValue}
              onChange={handleTextChange}
              placeholder="Nhập câu trả lời của bạn ở đây. Hãy trình bày một cách logic và chi tiết..."
              rows={10}
              className="w-full p-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-y min-h-[200px]"
              style={{
                fontSize: '16px',
                lineHeight: '1.6',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Thống kê từ và ký tự */}
          <div className="flex justify-between items-center text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
            <div className="flex space-x-4">
              <span>
                <span className="font-medium text-gray-700">{wordCount}</span>{' '}
                từ
              </span>
              <span>
                <span className="font-medium text-gray-700">{charCount}</span>{' '}
                ký tự
              </span>
            </div>
            <div className="text-xs text-gray-400">Không giới hạn độ dài</div>
          </div>

          {/* Gợi ý viết bài */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              Gợi ý trả lời hiệu quả:
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Bắt đầu bằng việc nêu rõ quan điểm hoặc ý chính</li>
              <li>• Sử dụng ví dụ cụ thể để minh họa</li>
              <li>• Trình bày logic, có cấu trúc rõ ràng</li>
              <li>• Kết thúc bằng tóm tắt hoặc kết luận</li>
            </ul>
          </div>

          {textValue.trim() && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700">
                <span className="font-medium">Trạng thái:</span> Đã nhập câu trả
                lời (
                {(() => {
                  if (wordCount > 50) return 'Chi tiết';
                  if (wordCount > 20) return 'Vừa phải';
                  return 'Ngắn gọn';
                })()}
                )
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpenEndedQuestion;
