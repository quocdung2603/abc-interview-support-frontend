import React from 'react';
import {
  QuestionCircleOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

interface CommunityStatsProps {
  totalQuestions: number;
  activeParticipants: number;
  questionsToday: number;
}

const CommunityStats: React.FC<CommunityStatsProps> = ({
  totalQuestions,
  activeParticipants,
  questionsToday,
}) => {
  return (
    <div className="card-elevated p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <QuestionCircleOutlined className="text-blue-600" />
        Thống kê câu hỏi
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Tổng câu hỏi</span>
          <span className="font-semibold text-gray-900">
            {totalQuestions.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 flex items-center gap-1">
            <UserOutlined className="text-xs" />
            Người tham gia
          </span>
          <span className="font-semibold text-gray-900">
            {activeParticipants.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 flex items-center gap-1">
            <ClockCircleOutlined className="text-xs" />
            Câu hỏi hôm nay
          </span>
          <span className="font-semibold text-sky-600">{questionsToday}</span>
        </div>
      </div>

      {/* Additional info */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 leading-relaxed">
          💡 Mỗi người dùng có 3 lượt đánh giá cho mỗi câu hỏi
        </p>
      </div>
    </div>
  );
};

export default CommunityStats;
