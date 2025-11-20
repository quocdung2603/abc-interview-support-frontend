import { News } from '@abc-interview-support-frontend/types';
import { RecruitmentNewsCard } from './RecruitmentNewsCard';

interface RecruitmentNewsListProps {
  news: News[]; // CHỈ NHẬN DANH SÁCH TIN TỨC CÓ NEWSTYPE = 'recruitment'
  loading?: boolean;
  onNewsClick?: (news: News) => void;
}

export const RecruitmentNewsList = ({
  news,
  loading,
  onNewsClick,
}: RecruitmentNewsListProps) => {
  // Lọc để đảm bảo chỉ hiển thị tin tức tuyển dụng
  const recruitmentNewsOnly = news.filter(
    (newsItem) => newsItem.newsType === 'recruitment'
  );

  // Generate unique keys for skeleton loading
  const skeletonItems = Array.from(
    { length: 6 },
    (_, i) => `skeleton-item-${Date.now()}-${i}`
  );

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skeletonItems.map((skeletonId) => (
            <div key={skeletonId} className="card-elevated animate-pulse">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex space-x-2">
                    <div className="h-6 w-20 bg-neutral-200 rounded-full"></div>
                    <div className="h-6 w-16 bg-neutral-200 rounded-full"></div>
                  </div>
                  <div className="h-4 w-20 bg-neutral-200 rounded-md"></div>
                </div>
                <div className="h-6 mb-2 bg-neutral-200 rounded-md"></div>
                <div className="h-6 mb-3 w-3/4 bg-neutral-200 rounded-md"></div>

                {/* Company info skeleton */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-neutral-200 rounded-lg"></div>
                  <div className="h-4 w-32 bg-neutral-200 rounded-md"></div>
                </div>

                {/* Job details skeleton */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-neutral-200 rounded"></div>
                    <div className="h-4 w-16 bg-neutral-200 rounded-md"></div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-neutral-200 rounded"></div>
                    <div className="h-4 w-20 bg-neutral-200 rounded-md"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="h-4 bg-neutral-200 rounded-md"></div>
                  <div className="h-4 w-2/3 bg-neutral-200 rounded-md"></div>
                </div>
              </div>
              <div className="px-6 pb-6">
                <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-neutral-200 rounded-full"></div>
                    <div className="h-4 w-24 bg-neutral-200 rounded-md"></div>
                  </div>
                  <div className="h-4 w-20 bg-neutral-200 rounded-md"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recruitmentNewsOnly.length === 0) {
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
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
              />
            </svg>
          </div>
          <h3 className="text-heading-3 text-neutral-700 mb-2">
            Không có tin tức tuyển dụng
          </h3>
          <p className="text-body text-neutral-500">
            Hiện tại chưa có tin tức tuyển dụng nào. Hãy quay lại sau nhé!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recruitmentNewsOnly.map((newsItem) => (
          <RecruitmentNewsCard
            key={newsItem.newsId}
            news={newsItem}
            onClick={onNewsClick}
          />
        ))}
      </div>

      {/* Load More Button - Placeholder for future pagination */}
      {recruitmentNewsOnly.length > 0 && (
        <div className="text-center mt-8">
          <button className="btn-outline">Xem thêm cơ hội việc làm</button>
        </div>
      )}

      {/* Quick Stats */}
      {recruitmentNewsOnly.length > 0 && (
        <div className="mt-8 p-4 bg-gradient-neutral rounded-xl">
          <div className="text-center">
            <h4 className="text-heading-3 text-neutral-800 mb-4">
              Thống kê tuyển dụng
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="stats-card">
                <div className="text-center">
                  <div className="text-heading-2 text-primary font-bold mb-2">
                    {recruitmentNewsOnly.length}
                  </div>
                  <div className="text-caption text-neutral-600 font-medium">
                    Cơ hội việc làm
                  </div>
                </div>
              </div>

              <div className="stats-card">
                <div className="text-center">
                  <div className="text-heading-2 text-primary font-bold mb-2">
                    15+
                  </div>
                  <div className="text-caption text-neutral-600 font-medium">
                    Ngành nghề
                  </div>
                </div>
              </div>

              <div className="stats-card">
                <div className="text-center">
                  <div className="text-heading-2 text-primary font-bold mb-2">
                    98%
                  </div>
                  <div className="text-caption text-neutral-600 font-medium">
                    Tỷ lệ hài lòng
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
