import React, { useEffect, useRef, useState } from 'react';
import {
  UserOutlined,
  CalendarOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
} from '@ant-design/icons';
import { DiscussionAnswer } from '@abc-interview-support-frontend/types';
import dayjs from 'dayjs';

interface AuthorInfo {
  name: string;
  avatar: string;
}

interface AnswerItemProps {
  answer: DiscussionAnswer;
  author: AuthorInfo;
  onVote: (answerId: number, voteType: 'up' | 'down') => void;
}

const COLLAPSED_MAX_HEIGHT = 150; // px

const AnswerItem: React.FC<AnswerItemProps> = ({ answer, author, onVote }) => {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const handleUpvote = () => onVote(answer.id, 'up');
  const handleDownvote = () => onVote(answer.id, 'down');

  // Kiểm tra nội dung có vượt quá max-height
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const checkOverflow = () => {
      const overflow = el.scrollHeight > COLLAPSED_MAX_HEIGHT + 1;
      setIsOverflowing(overflow);
    };

    checkOverflow();
    const ro = new ResizeObserver(checkOverflow);
    ro.observe(el);
    return () => ro.disconnect();
  }, [answer.content]);

  // Tự động thu gọn khi scroll qua
  useEffect(() => {
    const target = rootRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Nếu phần tử ít hơn 50% trong viewport => thu gọn
          if (entry.intersectionRatio < 0.5 && expanded) {
            setExpanded(false);
          }
        });
      },
      {
        threshold: [0.5], // 50% hiển thị
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [expanded]);

  const formatDate = (dateStr: string) => {
    return dayjs(dateStr).format('DD/MM/YYYY HH:mm:ss');
  }

  return (
    <div ref={rootRef} className="card-interactive p-4 mb-3">
      <div className="flex gap-4">
        {/* Voting section */}
        <div className="flex flex-col items-center gap-2 min-w-[48px] border-r border-r-gray-300 pr-3">
          <span className='text-xs font-medium text-green-500'>{answer.usefulVoteCount}</span>
          <button
            onClick={handleUpvote}
            className="p-1 rounded-sm transition-colors bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600"
            title="Hữu ích"
          >
            <CaretUpOutlined className="text-lg" />
          </button>

          <button
            onClick={handleDownvote}
            className="p-1 rounded-sm transition-colors bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"
            title="Không hữu ích"
          >
            <CaretDownOutlined className="text-lg" />
          </button>
          <span className='text-xs font-medium text-red-500'>{answer.notUsefulVoteCount}</span>
        </div>

        {/* Answer content */}
        <div className="flex-1">
          {/* Author info */}
          <div className="flex items-center gap-3 mb-2">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-9 h-9 rounded-full object-cover"
            />
            <div className="flex flex-col text-sm text-gray-500">
              <span className="flex items-center gap-2 font-medium text-gray-700">
                <UserOutlined />
                {author.name}
              </span>
              <span className="flex items-center gap-1">
                <CalendarOutlined />
                {formatDate(answer.createdAt)}
              </span>
            </div>
          </div>

          {/* Answer content (truncate + expand) */}
          <div className="prose max-w-none">
            <div
              ref={contentRef}
              className="relative overflow-hidden transition-[max-height] duration-500"
              style={{
                maxHeight: expanded ? 'none' : `${COLLAPSED_MAX_HEIGHT}px`,
              }}
            >
              {!expanded && isOverflowing && (
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
              )}

              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-0">
                {answer.content}
              </p>
            </div>

            {isOverflowing && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="mt-2 inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                {expanded ? 'Thu gọn' : 'Xem tất cả'}
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 min-w-[48px] border-l border-l-gray-300 pl-3">
          {/* Vote statistics */}
          <div className="text-center space-y-2">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Phần trăm hữu ích
              </span>
              <div className="text-sm font-medium text-green-600">
                {answer.usefulPercentage ?? 0}%
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Phần trăm không hữu ích
              </span>
              <div className="text-sm font-medium text-red-600">
                {answer.notUsefulPercentage ?? 0}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerItem;
