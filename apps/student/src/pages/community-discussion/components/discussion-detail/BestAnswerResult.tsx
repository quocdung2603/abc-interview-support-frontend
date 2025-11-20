import React from 'react';
import { TrophyOutlined } from '@ant-design/icons';

interface BestAnswerResultProps {
  answer: {
    id: string;
    content: string;
    author: string;
    authorAvatar: string;
    createdAt: string;
    upvotes: number;
    downvotes: number;
    score: number; // Net score (upvotes - downvotes)
  };
  questionTitle: string;
}

const BestAnswerResult: React.FC<BestAnswerResultProps> = ({
  answer,
  questionTitle,
}) => {
  const {
    content,
    author,
    authorAvatar,
    createdAt,
    upvotes,
    downvotes,
    score,
  } = answer;

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-xl p-4 shadow-lg">
      {/* Header with Best Answer Badge */}
      <div className="flex justify-center items-center gap-3 mb-3">
        <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-4 py-2 rounded-full shadow-md">
          <TrophyOutlined className="text-lg" />
          <span className="font-bold text-sm">
            CÂU TRẢ LỜI ĐƯỢC ĐÁNH GIÁ CAO NHẤT
          </span>
        </div>
      </div>
      {/* Best Answer Content */}
      <div className="bg-white rounded-lg p-3 mb-3 border border-yellow-200">
        <div className="prose prose-sm max-w-none">
          <div className="text-sm whitespace-pre-wrap text-gray-800 leading-relaxed">
            {content}
          </div>
        </div>
      </div>

      {/* Author and Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={authorAvatar}
            alt={author}
            className="w-10 h-10 rounded-full border-2 border-yellow-300"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800">{author}</span>
            </div>
            <span className="text-sm text-gray-600">{createdAt}</span>
          </div>
        </div>

        {/* Score Display */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {upvotes} Hữu ích
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              {downvotes} Không hữu ích
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestAnswerResult;
