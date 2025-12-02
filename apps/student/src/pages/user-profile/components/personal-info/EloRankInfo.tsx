import React from 'react';
import { User } from '@abc-interview-support-frontend/types';

interface EloRankInfoProps {
  user: User;
}

const EloRankInfo: React.FC<EloRankInfoProps> = ({ user }) => {
  const getRankFromElo = (eloScore: number): string => {
    if (eloScore >= 2000) return 'Legend';
    if (eloScore >= 1800) return 'Master';
    if (eloScore >= 1600) return 'Senior Expert';
    if (eloScore >= 1400) return 'Expert';
    if (eloScore >= 1200) return 'Solver';
    if (eloScore >= 1000) return 'Contributor';
    if (eloScore >= 800) return 'Learner';
    return 'Newbie';
  };

  const getRankProgress = (eloScore: number) => {
    const ranges = {
      Newbie: { min: 0, max: 800 },
      Learner: { min: 800, max: 1000 },
      Contributor: { min: 1000, max: 1200 },
      Solver: { min: 1200, max: 1400 },
      Expert: { min: 1400, max: 1600 },
      'Senior Expert': { min: 1600, max: 1800 },
      Master: { min: 1800, max: 2000 },
      Legend: { min: 2000, max: 9999 },
    };

    const currentRank = getRankFromElo(eloScore);
    const currentRange = ranges[currentRank as keyof typeof ranges];
    if (!currentRange) return 0;

    const progress =
      ((eloScore - currentRange.min) / (currentRange.max - currentRange.min)) *
      100;
    return Math.min(Math.max(progress, 0), 100);
  };

  // Get ELO score and rank safely
  const eloScore = user.eloScore || 0;
  const currentRank = user.eloRank || getRankFromElo(eloScore);
  const progress = getRankProgress(eloScore);

  const getRankColor = (rank: string) => {
    const colors = {
      Legend: 'from-yellow-400 to-orange-500',
      Master: 'from-red-400 to-pink-500',
      'Senior Expert': 'from-purple-400 to-indigo-500',
      Expert: 'from-pink-400 to-red-500',
      Solver: 'from-blue-400 to-cyan-500',
      Contributor: 'from-green-400 to-emerald-500',
      Learner: 'from-pink-400 to-yellow-400',
      Newbie: 'from-teal-400 to-pink-400',
    };
    return colors[rank as keyof typeof colors] || 'from-gray-400 to-gray-500';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Thông tin ELO & Xếp hạng</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Avatar with Rank */}
        <div className="flex flex-col items-center space-y-4">
          <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getRankColor(currentRank)} flex items-center justify-center text-2xl font-bold text-white shadow-lg`}>
            {user.fullName
              ? user.fullName.charAt(0).toUpperCase()
              : user.email.charAt(0).toUpperCase()}
          </div>

          <div className="text-center">
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${getRankColor(currentRank)} text-white mb-2`}>
              {currentRank}
            </div>
            <p className="text-sm text-gray-600">Xếp hạng hiện tại</p>
          </div>
        </div>

        {/* ELO Score and Progress */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-2xl font-bold text-blue-600">{eloScore} ELO</span>
              <span className="text-sm text-gray-600">{progress.toFixed(1)}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${getRankColor(currentRank)} transition-all duration-500 rounded-full`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Rank Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-green-600 mb-1">
                {Math.floor(eloScore / 100) || 0}
              </div>
              <div className="text-xs text-gray-600">Cấp độ thành tựu</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-orange-600 mb-1">
                #{Math.floor(Math.random() * 1000) + 1}
              </div>
              <div className="text-xs text-gray-600">Xếp hạng toàn cầu</div>
            </div>
          </div>

          {/* Next Rank Info */}
          <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-3">
            <p className="text-sm text-gray-700">
              <strong>Mục tiêu tiếp theo:</strong>{' '}
              {currentRank === 'Legend'
                ? 'Bạn đã đạt cấp cao nhất!'
                : 'Cần thêm điểm để lên hạng'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EloRankInfo;
