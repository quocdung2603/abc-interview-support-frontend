import { News } from '@abc-interview-support-frontend/types';
import { TrendNewsCard } from './TrendNewsCard';

interface TrendNewsListProps {
  news: News[];
  onNewsClick?: (news: News) => void;
}

export const TrendNewsList = ({
  news,
  onNewsClick,
}: TrendNewsListProps) => {

  if (news.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-gradient-neutral rounded-full">
            <svg
              className="w-12 h-12 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
          <h3 className="text-heading-3 text-neutral-700 mb-2">
            Không có tin tức xu hướng
          </h3>
          <p className="text-body text-neutral-500">
            Hiện tại chưa có tin tức nào về xu hướng. Hãy quay lại sau nhé!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((newsItem) => (
          <TrendNewsCard
            key={newsItem.id}
            news={newsItem}
            onClick={onNewsClick}
          />
        ))}
      </div>

      {/* Load More Button - Placeholder for future pagination */}
      {news.length > 0 && (
        <div className="text-center mt-8">
          <button className="btn-outline">Xem thêm tin tức</button>
        </div>
      )}
    </div>
  );
};
