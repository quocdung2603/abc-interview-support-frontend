import { News } from '@abc-interview-support-frontend/types';
import { TrendNewsCard } from './TrendNewsCard';

interface TrendNewsListProps {
  news: News[]; // CHỈ NHẬN DANH SÁCH TIN TỨC CÓ NEWSTYPE = 'trend'
  loading?: boolean;
  onNewsClick?: (news: News) => void;
}

export const TrendNewsList = ({
  news,
  loading,
  onNewsClick,
}: TrendNewsListProps) => {
  // Lọc để đảm bảo chỉ hiển thị tin tức xu hướng
  const trendNewsOnly = news.filter(
    (newsItem) => newsItem.newsType === 'trend'
  );

  // Generate unique keys for skeleton loading
  const skeletonItems = Array.from(
    { length: 6 },
    (_, i) => `skeleton-item-${Date.now()}-${i}`
  );

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skeletonItems.map((skeletonId) => (
            <div key={skeletonId} className="card-elevated animate-pulse">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-6 w-16 bg-neutral-200 rounded-full"></div>
                  <div className="h-4 w-20 bg-neutral-200 rounded-md"></div>
                </div>
                <div className="h-6 mb-2 bg-neutral-200 rounded-md"></div>
                <div className="h-6 mb-3 w-3/4 bg-neutral-200 rounded-md"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-neutral-200 rounded-md"></div>
                  <div className="h-4 bg-neutral-200 rounded-md"></div>
                  <div className="h-4 w-2/3 bg-neutral-200 rounded-md"></div>
                </div>
              </div>
              <div className="px-6 pb-6">
                <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-neutral-200 rounded-full"></div>
                    <div className="h-4 w-24 bg-neutral-200 rounded-md"></div>
                  </div>
                  <div className="h-4 w-16 bg-neutral-200 rounded-md"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
        {trendNewsOnly.map((newsItem) => (
          <TrendNewsCard
            key={newsItem.newsId}
            news={newsItem}
            onClick={onNewsClick}
          />
        ))}
      </div>

      {/* Load More Button - Placeholder for future pagination */}
      {trendNewsOnly.length > 0 && (
        <div className="text-center mt-8">
          <button className="btn-outline">Xem thêm tin tức</button>
        </div>
      )}
    </div>
  );
};
