import React from 'react';
import { TrophyOutlined } from '@ant-design/icons';
import { DiscussionAnswer } from '@abc-interview-support-frontend/types';

interface BestAnswerResultProps {
  answer: DiscussionAnswer & { score: number };
  questionTitle: string;
}

const BestAnswerResult: React.FC<BestAnswerResultProps> = ({
  answer,
  questionTitle,
}) => {
  // Mock author info based on userId
  const getAuthorInfo = (userId: number) => {
    const authors = {
      456: { name: 'Nguyễn Văn A', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' },
      789: { name: 'Trần Thị B', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face' },
      101: { name: 'Lê Văn C', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' },
      999: { name: 'Bạn', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face' },
    };
    return authors[userId as keyof typeof authors] || { name: `User ${userId}`, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' };
  };

  const authorInfo = getAuthorInfo(answer.userId);

  const {
    content,
    createdAt,
    upVotes,
    downVotes,
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
            src={authorInfo.avatar}
            alt={authorInfo.name}
            className="w-10 h-10 rounded-full border-2 border-yellow-300"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800">{authorInfo.name}</span>
            </div>
            <span className="text-sm text-gray-600">{createdAt}</span>
          </div>
        </div>

        {/* Score Display */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {upVotes} Hữu ích
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              {downVotes} Không hữu ích
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestAnswerResult;
