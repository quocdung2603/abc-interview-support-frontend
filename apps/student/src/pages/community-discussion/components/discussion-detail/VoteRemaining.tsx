import React from 'react';
import { StarOutlined, InfoCircleOutlined } from '@ant-design/icons';

interface VoteRemainingProps {
  remainingVotes: number;
  maxVotes: number;
  postType?: string;
}

const VoteRemaining: React.FC<VoteRemainingProps> = ({
  remainingVotes,
  maxVotes,
  postType,
}) => {
  const usedVotes = maxVotes === Infinity ? 0 : maxVotes - remainingVotes;
  const percentage = maxVotes === Infinity ? 0 : (usedVotes / maxVotes) * 100;

  const getTitle = () => {
    if (postType === 'DISCUSSION') {
      return 'Thảo luận tự do';
    }
    return 'Lượt bình luận còn lại';
  };

  const getDescription = () => {
    if (postType === 'DISCUSSION') {
      return 'Bạn có thể bình luận thoải mái trong cuộc thảo luận này.';
    }
    return remainingVotes > 0
      ? `Bạn còn ${remainingVotes} lượt bình luận cho câu hỏi này.`
      : 'Bạn đã đạt giới hạn số bình luận cho câu hỏi này.';
  };

  const getStatusColor = () => {
    if (remainingVotes === 0) return 'text-red-600 bg-red-50 border-red-200';
    if (remainingVotes <= 1)
      return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  const getProgressColor = () => {
    if (remainingVotes === 0) return 'bg-red-500';
    if (remainingVotes <= 1) return 'bg-orange-500';
    return 'bg-blue-500';
  };

  return (
    <div className={`card-elevated p-3 border ${getStatusColor()}`}>
      <div className="flex items-start gap-2">
        <StarOutlined className="text-lg mt-0.5" />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">{getTitle()}</h3>
            <span className="text-lg font-bold">
              {remainingVotes}/{maxVotes}
            </span>
          </div>

          {/* Progress bar - only show for QUESTION type */}
          {postType === 'QUESTION' && (
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          )}

          <div className="flex items-start gap-1">
            <InfoCircleOutlined className="text-sm mt-0.5 opacity-70" />
            <p className="text-sm opacity-80">
              {getDescription()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoteRemaining;
