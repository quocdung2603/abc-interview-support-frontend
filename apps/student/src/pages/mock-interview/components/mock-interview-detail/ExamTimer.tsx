import React, { useState, useEffect, useRef } from 'react';

interface ExamTimerProps {
  duration: number; // Thời gian làm bài tính bằng phút
  onTimeUp: () => void;
  isActive: boolean;
}

const ExamTimer: React.FC<ExamTimerProps> = ({
  duration,
  onTimeUp,
  isActive,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds
  const [isWarning, setIsWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;

          // Cảnh báo khi còn 10 phút (600 giây)
          if (newTime <= 600 && newTime > 300) {
            setIsWarning(true);
            setIsCritical(false);
          }
          // Cảnh báo nghiêm trọng khi còn 5 phút (300 giây)
          else if (newTime <= 300 && newTime > 0) {
            setIsWarning(false);
            setIsCritical(true);
          }
          // Hết thời gian
          else if (newTime <= 0) {
            setIsWarning(false);
            setIsCritical(false);
            onTimeUp();
            return 0;
          } else {
            setIsWarning(false);
            setIsCritical(false);
          }

          return newTime;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, onTimeUp]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  const getTimerStyles = () => {
    if (isCritical) {
      return {
        backgroundColor: '#fef2f2',
        borderColor: '#dc2626',
        color: '#dc2626',
        animation: 'pulse 1s infinite',
      };
    }
    if (isWarning) {
      return {
        backgroundColor: '#fffbeb',
        borderColor: '#f59e0b',
        color: '#f59e0b',
      };
    }
    return {
      backgroundColor: '#f0f9ff',
      borderColor: '#0ea5e9',
      color: '#0ea5e9',
    };
  };

  const getProgressPercentage = () => {
    const totalSeconds = duration * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  const getStatusMessage = () => {
    if (isCritical) return '⚠️ Thời gian sắp hết!';
    if (isWarning) return '⏰ Chú ý thời gian!';
    return '⏱️ Thời gian làm bài';
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-neutral-200 p-4">
      <div className="text-center">
        <div className="text-sm font-medium text-gray-600 mb-2">
          {getStatusMessage()}
        </div>

        <div
          className="text-3xl font-bold p-4 rounded-lg border-2 mb-3 transition-all duration-300"
          style={getTimerStyles()}
        >
          {formatTime(timeLeft)}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${(() => {
              if (isCritical) return 'bg-red-500';
              if (isWarning) return 'bg-yellow-500';
              return 'bg-blue-500';
            })()}`}
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <div>Tổng thời gian: {duration} phút</div>
          <div>
            Đã sử dụng: {Math.floor((duration * 60 - timeLeft) / 60)} phút{' '}
            {(duration * 60 - timeLeft) % 60} giây
          </div>
        </div>

        {/* Cảnh báo */}
        {isWarning && !isCritical && (
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              Còn ít thời gian! Hãy kiểm tra lại các câu trả lời.
            </p>
          </div>
        )}

        {isCritical && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg animate-pulse">
            <p className="text-xs text-red-800 font-medium">
              Chỉ còn ít phút! Chuẩn bị nộp bài.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamTimer;
