import React from 'react';
import { User } from '@abc-interview-support-frontend/types';

interface EloRankInfoProps {
  user: User;
}

const EloRankInfo: React.FC<EloRankInfoProps> = ({ user }) => {
  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Legend':
        return {
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          color: '#000',
        };
      case 'Master':
        return {
          background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
          color: '#fff',
        };
      case 'Senior Expert':
        return {
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: '#fff',
        };
      case 'Expert':
        return {
          background: 'linear-gradient(135deg, #f093fb, #f5576c)',
          color: '#fff',
        };
      case 'Solver':
        return {
          background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
          color: '#fff',
        };
      case 'Contributor':
        return {
          background: 'linear-gradient(135deg, #43e97b, #38f9d7)',
          color: '#000',
        };
      case 'Learner':
        return {
          background: 'linear-gradient(135deg, #fa709a, #fee140)',
          color: '#000',
        };
      case 'Newbie':
        return {
          background: 'linear-gradient(135deg, #a8edea, #fed6e3)',
          color: '#000',
        };
      default:
        return { background: 'var(--color-neutral-400)', color: '#fff' };
    }
  };

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

  const getAvatarFrame = (rank: string) => {
    const frameStyles = {
      Legend: {
        border: '4px solid',
        borderImage: 'linear-gradient(45deg, #FFD700, #FFA500, #FFD700) 1',
        boxShadow: '0 0 20px rgba(255, 215, 0, 0.6)',
        animation: 'gentle-float 3s ease-in-out infinite',
      },
      Master: {
        border: '4px solid',
        borderImage: 'linear-gradient(45deg, #FF6B6B, #FF8E53) 1',
        boxShadow: '0 0 15px rgba(255, 107, 107, 0.4)',
      },
      'Senior Expert': {
        border: '3px solid',
        borderImage: 'linear-gradient(45deg, #667eea, #764ba2) 1',
        boxShadow: '0 0 10px rgba(102, 126, 234, 0.3)',
      },
      Expert: {
        border: '3px solid',
        borderImage: 'linear-gradient(45deg, #f093fb, #f5576c) 1',
      },
      Solver: {
        border: '2px solid',
        borderImage: 'linear-gradient(45deg, #4facfe, #00f2fe) 1',
      },
      Contributor: {
        border: '2px solid var(--color-success)',
      },
      Learner: {
        border: '2px solid var(--color-warning)',
      },
      Newbie: {
        border: '2px solid var(--color-neutral-400)',
      },
    };

    return (
      frameStyles[rank as keyof typeof frameStyles] || frameStyles['Newbie']
    );
  };

  // Get ELO score and rank safely
  const eloScore = user.eloScore || 0;
  const currentRank = user.eloRank || getRankFromElo(eloScore);
  const progress = getRankProgress(eloScore);
  const rankColor = getRankColor(currentRank);
  const avatarFrame = getAvatarFrame(currentRank);

  return (
    <div
      className="card-elevated"
      style={{
        padding: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-lg)',
      }}
    >
      <h2
        className="text-heading-1"
        style={{
          color: 'var(--color-primary)',
          margin: '0 0 var(--spacing-md) 0',
        }}
      >
        Thông tin ELO & Xếp hạng
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: 'var(--spacing-lg)',
          alignItems: 'center',
        }}
      >
        {/* Avatar with Rank Frame */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
          }}
        >
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              fontWeight: 'bold',
              color: 'white',
              background: 'var(--color-accent)',
              ...avatarFrame,
            }}
            className={currentRank === 'Legend' ? 'animate-gentle-float' : ''}
          >
            {user.fullName
              ? user.fullName.charAt(0).toUpperCase()
              : user.email.charAt(0).toUpperCase()}
          </div>

          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: '700',
                fontSize: '1.1rem',
                marginBottom: 'var(--spacing-xs)',
                ...rankColor,
              }}
            >
              {currentRank}
            </div>
            <p
              style={{
                margin: 0,
                color: 'var(--color-neutral-600)',
                fontSize: '0.9rem',
              }}
            >
              Xếp hạng hiện tại
            </p>
          </div>
        </div>

        {/* ELO Score and Progress */}
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--spacing-xs)',
              }}
            >
              <span
                className="text-heading-2"
                style={{ color: 'var(--color-accent)' }}
              >
                {eloScore} ELO
              </span>
              <span style={{ color: 'var(--color-neutral-600)' }}>
                {progress.toFixed(1)}%
              </span>
            </div>

            {/* Progress Bar */}
            <div
              style={{
                width: '100%',
                height: '8px',
                backgroundColor: 'var(--color-neutral-200)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: rankColor.background,
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
          </div>

          {/* Rank Statistics */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--spacing-sm)',
            }}
          >
            <div
              className="stats-card"
              style={{ textAlign: 'center', padding: 'var(--spacing-md)' }}
            >
              <div
                className="text-heading-2"
                style={{
                  color: 'var(--color-success)',
                  margin: '0 0 0.25rem 0',
                }}
              >
                {Math.floor(eloScore / 100) || 0}
              </div>
              <div
                style={{
                  color: 'var(--color-neutral-600)',
                  fontSize: '0.875rem',
                }}
              >
                Cấp độ thành tựu
              </div>
            </div>

            <div
              className="stats-card"
              style={{ textAlign: 'center', padding: 'var(--spacing-md)' }}
            >
              <div
                className="text-heading-2"
                style={{
                  color: 'var(--color-warning)',
                  margin: '0 0 0.25rem 0',
                }}
              >
                #{Math.floor(Math.random() * 1000) + 1}
              </div>
              <div
                style={{
                  color: 'var(--color-neutral-600)',
                  fontSize: '0.875rem',
                }}
              >
                Xếp hạng toàn cầu
              </div>
            </div>
          </div>

          {/* Next Rank Info */}
          <div
            style={{
              marginTop: 'var(--spacing-md)',
              padding: 'var(--spacing-sm)',
              backgroundColor: 'var(--color-neutral-50)',
              borderRadius: 'var(--radius-md)',
              borderLeft: '4px solid var(--color-accent)',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: '0.875rem',
                color: 'var(--color-neutral-700)',
              }}
            >
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
