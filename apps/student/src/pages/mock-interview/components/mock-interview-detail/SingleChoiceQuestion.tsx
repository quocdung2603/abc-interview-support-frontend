import React from 'react';
import { Question, Answer } from '@abc-interview-support-frontend/types';

interface SingleChoiceQuestionProps {
  question: Question;
  answers: Answer[];
  selectedAnswer: string | null;
  onAnswerChange: (answerId: string | null) => void;
}

const SingleChoiceQuestion: React.FC<SingleChoiceQuestionProps> = ({
  question,
  answers,
  selectedAnswer,
  onAnswerChange,
}) => {
  const radioStyles = {
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

        <div className="space-y-3">
          {answers.map((answer) => (
            <label
              key={answer.answerId.toString()}
              className="flex items-start cursor-pointer p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              style={{
                borderColor:
                  selectedAnswer === answer.answerId.toString() ? '#0ea5e9' : '#e2e8f0',
                backgroundColor:
                  selectedAnswer === answer.answerId.toString() ? '#f0f9ff' : 'white',
              }}
            >
              <input
                type="radio"
                name={`question-${question.id.toString()}`}
                value={answer.answerId.toString()}
                checked={selectedAnswer === answer.answerId.toString()}
                onChange={() => onAnswerChange(answer.answerId.toString())}
                style={radioStyles}
                className="mt-1 mr-3"
              />
              <span className="text-gray-700 leading-relaxed flex-1">
                {answer.answerContent}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleChoiceQuestion;
