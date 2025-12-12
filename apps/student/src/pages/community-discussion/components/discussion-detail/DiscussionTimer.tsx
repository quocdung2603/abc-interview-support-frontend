import React, { useState, useEffect } from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import { Post } from '@abc-interview-support-frontend/types';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

// Initialize dayjs plugins
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.locale('vi');

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
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!post.lockTime) return;

    const calculateTimeRemaining = () => {
      // Get current time using dayjs
      const now = dayjs();

      // Parse lockTime as local time (format: YYYY-MM-DDTHH:mm:ss)
      const lockTimeDayjs = dayjs(post.lockTime, 'YYYY-MM-DDTHH:mm:ss');

      console.log('Timer calculation:', {
        lockTime: post.lockTime,
        lockTimeParsed: lockTimeDayjs.format('YYYY-MM-DD HH:mm:ss'),
        now: now.format('YYYY-MM-DD HH:mm:ss'),
        isValid: lockTimeDayjs.isValid(),
        diff: lockTimeDayjs.diff(now, 'second') + ' seconds'
      });

      // Store endDate for UI display
      setEndDate(lockTimeDayjs.toDate());

      // Check if lockTime is valid
      if (!lockTimeDayjs.isValid()) {
        console.warn('Invalid lockTime:', post.lockTime);
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: false,
        });
        return;
      }

      // Calculate time difference
      const diffInMs = lockTimeDayjs.diff(now);

      if (diffInMs <= 0) {
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        return;
      }

      // Use dayjs duration to calculate time components
      const durationObj = dayjs.duration(diffInMs);

      const days = Math.floor(durationObj.asDays());
      const hours = durationObj.hours();
      const minutes = durationObj.minutes();
      const seconds = durationObj.seconds();

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

  // Show different UI based on lockTime status
  if (!post.lockTime) {
    return (
      <div className="card-elevated p-3 bg-green-50 border border-green-200">
        <div className="flex items-center gap-2">
          <ClockCircleOutlined className="text-green-600 text-lg" />
          <div>
            <h3 className="font-semibold text-green-800">
              Bài viết chưa giới hạn thời gian
            </h3>
            <p className="text-sm text-green-600">
              Bạn có thể thảo luận vô thời hạn
            </p>
          </div>
        </div>
      </div>
    );
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
