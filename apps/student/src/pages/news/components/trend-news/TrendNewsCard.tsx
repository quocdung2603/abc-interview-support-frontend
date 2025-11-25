import { News } from '@abc-interview-support-frontend/types';

interface TrendNewsCardProps {
  news: News;
  onClick?: (news: News) => void;
}

export const TrendNewsCard = ({ news, onClick }: TrendNewsCardProps) => {
  const formatDate = (date: string | Date) => {
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
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="badge-accent">Xu hướng</span>
          <time className="text-body-small text-neutral-500">
            {formatDate(news.createdAt)}
          </time>
        </div>

        {/* Title */}
        <h3 className="news-card-title text-neutral-800 line-clamp-2 mb-2 transition-colors duration-200 hover:text-accent">
          {news.title}
        </h3>

        {/* Content Preview */}
        <p className="text-body text-neutral-600 line-clamp-3 leading-relaxed">
          {news.content}
        </p>
      </div>

      {/* Card Footer */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 flex items-center justify-center bg-gradient-accent rounded-full text-white">
              <span className="text-caption font-semibold">
                {(news.userId?.toString() || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-caption text-neutral-600">
              User {(news.userId?.toString() || 'Unknown').slice(0, 8)}...
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
