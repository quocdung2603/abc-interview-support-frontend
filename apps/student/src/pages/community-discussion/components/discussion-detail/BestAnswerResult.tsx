import React, { useState, useEffect } from 'react';
import { TrophyOutlined } from '@ant-design/icons';
import { DiscussionAnswer, User } from '@abc-interview-support-frontend/types';
import { userService } from '@abc-interview-support-frontend/services';
import dayjs from 'dayjs';

interface BestAnswerResultProps {
  answer: DiscussionAnswer & { score: number };
  questionTitle: string;
}

const BestAnswerResult: React.FC<BestAnswerResultProps> = ({
  answer,
  questionTitle,
}) => {
  const [author, setAuthor] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getUserById = async (userId: number) => {
    try {
      setLoading(true);
      const res = await userService.getUserById(userId.toString());
      setAuthor(res);
    } catch (error) {
      console.error('Error fetching user:', error);
      setAuthor(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserById(answer.userId);
  }, [answer.userId]);

  const formatDate = (dateStr: string) => {
    return dayjs(dateStr).format('DD/MM/YYYY HH:mm:ss');
  };

  const getAuthorName = () => {
    if (author?.fullName) {
      return author.fullName;
    }
    return 'Unknown Author';
  };

  const getAuthorAvatar = () => {
    // You can add logic here to get avatar from user data or use a default
    return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face';
  };

  const {
    content,
    createdAt,
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
            src={getAuthorAvatar()}
            alt={getAuthorName()}
            className="w-10 h-10 rounded-full border-2 border-yellow-300"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800">
                {loading ? 'Đang tải...' : getAuthorName()}
              </span>
            </div>
            <span className="text-sm text-gray-600">{formatDate(createdAt)}</span>
          </div>
        </div>

        {/* Score Display */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {answer.voteCount || 0} Hữu ích
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              {answer.usefulPercentage || 0}% Hữu ích
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestAnswerResult;
