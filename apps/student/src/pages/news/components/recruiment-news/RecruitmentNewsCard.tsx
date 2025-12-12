import { RecruitmentNews as RNews } from '@abc-interview-support-frontend/types';
import dayjs from 'dayjs';

interface RecruitmentNewsCardProps {
  news: RNews; // CHỈ NHẬN TIN TỨC CÓ NEWSTYPE = 'RECRUITMENT'
  onClick?: (news: RNews) => void;
}

// Extended news data for recruitment with additional fields
interface RecruitmentNewsData extends RNews {
  companyName?: string;
  location?: string;
  salary?: string;
  jobType?: string;
  urgency?: 'high' | 'medium' | 'low';
}

export const RecruitmentNewsCard = ({
  news,
  onClick,
}: RecruitmentNewsCardProps) => {
  // Kiểm tra để đảm bảo chỉ hiển thị tin tức tuyển dụng
  if (news.newsType !== 'RECRUITMENT') {
    return null;
  }

  // Mock additional recruitment data - trong thực tế sẽ từ API
  const recruitmentData: RecruitmentNewsData = {
    ...news,
    companyName: 'TechViet Solutions',
    location: 'Hà Nội',
    salary: '20-30 triệu',
    jobType: 'Full-time',
    urgency: 'high',
  };

  const formatDate = (date: string | Date) => {
    return dayjs(date).format('DD/MM/YYYY HH:mm:ss');
  };

  const handleClick = () => {
    if (onClick) {
      onClick(news);
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return <span className="badge-warning">Tuyển gấp</span>;
      case 'medium':
        return <span className="badge-accent">Ưu tiên</span>;
      default:
        return <span className="badge-secondary">Thông thường</span>;
    }
  };

  return (
    <button
      className="card-interactive animate-fade-in-up w-full text-left"
      onClick={handleClick}
      aria-label={`Xem tin tuyển dụng: ${news.title}`}
    >
      {/* Card Header */}
      <div className="p-3 pb-2">
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center gap-2">
            {getUrgencyBadge(recruitmentData.urgency || 'low')}
            <span className="badge-primary">Tuyển dụng</span>
          </div>
          <time className="text-body-small text-neutral-500">
            {formatDate(news.createdAt)}
          </time>
        </div>

        {/* Job Title */}
        <h3 className="text-body-large font-semibold text-neutral-800 line-clamp-2 mb-1 transition-colors duration-200 hover:text-accent">
          {news.title}
        </h3>

        {/* Company Info */}
        <div className="flex items-center space-x-3 mb-1">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-primary rounded-lg flex items-center justify-center">
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-body font-medium text-neutral-700">
              {recruitmentData.companyName}
            </span>
          </div>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="flex items-center space-x-2">
            <svg
              className="w-3 h-3 text-neutral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-caption text-neutral-600">
              {recruitmentData.location}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <svg
              className="w-3 h-3 text-neutral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
            <span className="text-caption text-neutral-600">
              {recruitmentData.salary}
            </span>
          </div>
        </div>

        {/* Job Description Preview */}
        <p className="text-body text-neutral-600 line-clamp-2 leading-relaxed">
          {news.content}
        </p>
      </div>

      {/* Card Footer */}
      <div className="px-3 pb-3">
        <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-gradient-accent rounded-full flex items-center justify-center">
              <span className="text-caption text-white font-semibold">HR</span>
            </div>
            <span className="text-caption text-neutral-600">
              Nhà tuyển dụng
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 text-neutral-500">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span className="text-caption">156</span>
            </div>

            <span className="text-caption font-medium text-accent transition-colors duration-200 hover:text-accent-dark">
              Xem chi tiết →
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};
