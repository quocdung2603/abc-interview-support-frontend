import React, { useState, useEffect } from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import { Post } from '@abc-interview-support-frontend/types';

interface DiscussionTimerProps {
  post: Post;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

const DiscussionTimer: React.FC<DiscussionTimerProps> = ({ post }) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    if (!post.lockTime) return;

    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const end = new Date(post.lockTime!).getTime();
      const difference = end - now;

      if (difference <= 0) {
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining({
        days,
        hours,
        minutes,
        seconds,
        isExpired: false,
      });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [post.lockTime]);

  // Don't show timer if no lockTime
  if (!post.lockTime) {
    return null;
  }

  if (timeRemaining.isExpired) {
    return (
      <div className="card-elevated p-3 bg-red-50 border border-red-200">
        <div className="flex items-center gap-2">
          <ClockCircleOutlined className="text-red-600 text-lg" />
          <div>
            <h3 className="font-semibold text-red-800">
              Cuộc thảo luận đã kết thúc
            </h3>
            <p className="text-sm text-red-600">
              Bạn không thể gửi câu trả lời mới
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-elevated p-3 bg-blue-50 border border-blue-200">
      <div className="flex items-center gap-3">
        <ClockCircleOutlined className="text-blue-600 text-lg" />
        <div className="flex-1">
          <h3 className="font-semibold text-blue-800 mb-1">
            Thời gian còn lại
          </h3>
          <div className="flex gap-3">
            {timeRemaining.days > 0 && (
              <div className="text-center">
                <div className="text-lg font-bold text-blue-700">
                  {timeRemaining.days}
                </div>
                <div className="text-xs text-blue-600">Ngày</div>
              </div>
            )}
            <div className="text-center">
              <div className="text-lg font-bold text-blue-700">
                {timeRemaining.hours}
              </div>
              <div className="text-xs text-blue-600">Giờ</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-700">
                {timeRemaining.minutes}
              </div>
              <div className="text-xs text-blue-600">Phút</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-700">
                {timeRemaining.seconds}
              </div>
              <div className="text-xs text-blue-600">Giây</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionTimer;
