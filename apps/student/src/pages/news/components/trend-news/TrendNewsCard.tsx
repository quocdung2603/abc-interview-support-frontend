import { News } from '@abc-interview-support-frontend/types';

interface TrendNewsCardProps {
  news: News; // CHỈ NHẬN TIN TỨC CÓ NEWSTYPE = 'trend'
  onClick?: (news: News) => void;
}

export const TrendNewsCard = ({ news, onClick }: TrendNewsCardProps) => {
  // Kiểm tra để đảm bảo chỉ hiển thị tin tức xu hướng
  if (news.newsType !== 'trend') {
    return null;
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const handleClick = () => {
    if (onClick) {
      onClick(news);
    }
  };

  return (
    <button
      className="card-interactive animate-fade-in-up w-full text-left"
      onClick={handleClick}
      aria-label={`Đọc tin tức: ${news.title}`}
    >
      {/* Card Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="badge-accent">Xu hướng</span>
          <time className="text-body-small text-neutral-500">
            {formatDate(news.createdAt)}
          </time>
        </div>

        {/* Title */}
        <h3 className="news-card-title text-neutral-800 line-clamp-2 mb-3 transition-colors duration-200 hover:text-accent">
          {news.title}
        </h3>

        {/* Content Preview */}
        <p className="text-body text-neutral-600 line-clamp-3 leading-relaxed">
          {news.content}
        </p>
      </div>

      {/* Card Footer */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 flex items-center justify-center bg-gradient-accent rounded-full text-white">
              <span className="text-caption font-semibold">
                {news.userId.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-caption text-neutral-600">
              User {news.userId.slice(0, 8)}...
            </span>
          </div>

          <span className="text-caption font-medium text-accent transition-colors duration-200 hover:text-accent-dark">
            Đọc thêm →
          </span>
        </div>
      </div>
    </button>
  );
};
