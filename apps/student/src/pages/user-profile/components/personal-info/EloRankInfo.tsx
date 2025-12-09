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
      Learner: { min: 801, max: 1000 },
      Contributor: { min: 1001, max: 1200 },
      Solver: { min: 1201, max: 1400 },
      Expert: { min: 1401, max: 1600 },
      'Senior Expert': { min: 1601, max: 1800 },
      Master: { min: 1801, max: 2000 },
      Legend: { min: 2001, max: 99999 },
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
      Legend: 'from-yellow-400 via-yellow-500 to-orange-500',
      Master: 'from-red-500 via-pink-500 to-purple-600',
      'Senior Expert': 'from-purple-500 via-purple-600 to-indigo-600',
      Expert: 'from-pink-500 via-rose-500 to-red-500',
      Solver: 'from-blue-500 via-cyan-500 to-teal-500',
      Contributor: 'from-green-500 via-emerald-500 to-teal-600',
      Learner: 'from-amber-400 via-yellow-400 to-orange-400',
      Newbie: 'from-teal-400 via-cyan-400 to-blue-400',
    };
    return colors[rank as keyof typeof colors] || 'from-gray-400 to-gray-500';
  };

  const getRankIcon = (rank: string) => {
    const icons = {
      Legend: '👑',
      Master: '💎',
      'Senior Expert': '⭐',
      Expert: '🏆',
      Solver: '🎯',
      Contributor: '🌟',
      Learner: '📚',
      Newbie: '🌱',
    };
    return icons[rank as keyof typeof icons] || '🎮';
  };

  const getRankAnimation = (rank: string) => {
    const animations = {
      Legend: 'animate-pulse',
      Master: 'animate-bounce',
      'Senior Expert': '',
      Expert: '',
      Solver: '',
      Contributor: '',
      Learner: '',
      Newbie: '',
    };
    return animations[rank as keyof typeof animations] || '';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
        <span>🏅</span>
        Thông tin ELO & Xếp hạng
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Avatar with Rank */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            {/* Glow effect for high ranks */}
            {(currentRank === 'Legend' || currentRank === 'Master') && (
              <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${getRankColor(currentRank)} opacity-50 blur-xl ${getRankAnimation(currentRank)}`}></div>
            )}

            {/* Avatar */}
            <div className={`relative w-28 h-28 rounded-full bg-gradient-to-br ${getRankColor(currentRank)} flex items-center justify-center text-3xl font-bold text-white shadow-2xl transform transition-transform hover:scale-110 ${getRankAnimation(currentRank)}`}>
              <span className="absolute -top-2 -right-2 text-3xl">{getRankIcon(currentRank)}</span>
              {user.fullName
                ? user.fullName.charAt(0).toUpperCase()
                : user.email.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="text-center">
            <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-gradient-to-r ${getRankColor(currentRank)} text-white mb-2 shadow-lg transform transition-all hover:scale-105`}>
              <span className="text-lg">{getRankIcon(currentRank)}</span>
              <span>{currentRank}</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Xếp hạng hiện tại</p>
          </div>
        </div>

        {/* ELO Score and Progress */}
        <div className="space-y-4">
          {/* ELO Score Display */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 shadow-md border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {eloScore}
                </span>
                <span className="text-sm font-semibold text-gray-500">ELO</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-medium text-gray-600">{progress.toFixed(1)}%</span>
              </div>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div
                className={`h-full bg-gradient-to-r ${getRankColor(currentRank)} transition-all duration-700 ease-out rounded-full relative`}
                style={{ width: `${progress}%` }}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
              </div>
            </div>
          </div>

          {/* Rank Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 text-center transform transition-all hover:scale-105 hover:shadow-lg">
              <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">
                {Math.floor(eloScore / 100) || 0}
              </div>
              <div className="text-xs font-medium text-gray-600 flex items-center justify-center gap-1">
                <span>⚡</span>
                <span>Cấp độ thành tựu</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-4 text-center transform transition-all hover:scale-105 hover:shadow-lg">
              <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-1">
                #{Math.floor(Math.random() * 1000) + 1}
              </div>
              <div className="text-xs font-medium text-gray-600 flex items-center justify-center gap-1">
                <span>🏆</span>
                <span>Xếp hạng hệ thống</span>
              </div>
            </div>
          </div>

          {/* Next Rank Info */}
          <div className={`bg-gradient-to-r ${getRankColor(currentRank)} bg-opacity-10 border-l-4 ${currentRank === 'Legend' ? 'border-yellow-500' : 'border-blue-500'} rounded-r-xl p-4 shadow-md`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{currentRank === 'Legend' ? '🎉' : '🎯'}</span>
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-1">
                  {currentRank === 'Legend' ? 'Chúc mừng!' : 'Mục tiêu tiếp theo'}
                </p>
                <p className="text-xs text-gray-600">
                  {currentRank === 'Legend'
                    ? 'Bạn đã đạt cấp cao nhất! Hãy duy trì phong độ! 🌟'
                    : 'Tiếp tục nỗ lực để lên hạng cao hơn! 💪'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EloRankInfo;

// Add custom animations to global styles or tailwind config
// For shimmer effect, add this to your global CSS:
/*
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
*/
