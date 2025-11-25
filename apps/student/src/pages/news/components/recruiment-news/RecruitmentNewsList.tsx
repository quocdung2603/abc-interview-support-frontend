import { RecruitmentNews as RNews } from '@abc-interview-support-frontend/types';
import { RecruitmentNewsCard } from './RecruitmentNewsCard';

interface RecruitmentNewsListProps {
  news: RNews[]; // CHỈ NHẬN DANH SÁCH TIN TỨC CÓ NEWSTYPE = 'RECRUITMENT'
  onNewsClick?: (news: RNews) => void;
}

export const RecruitmentNewsList = ({
  news,
  onNewsClick,
}: RecruitmentNewsListProps) => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {news.map((newsItem) => (
          <RecruitmentNewsCard
            key={newsItem.id}
            news={newsItem}
            onClick={onNewsClick}
          />
        ))}
      </div>

      {/* Load More Button - Placeholder for future pagination */}
      {news.length > 0 && (
        <div className="text-center mt-8">
          <button className="btn-outline">Xem thêm cơ hội việc làm</button>
        </div>
      )}

      {/* Quick Stats */}
      {news.length > 0 && (
        <div className="mt-8 p-4 bg-gradient-neutral rounded-xl">
          <div className="text-center">
            <h4 className="text-heading-3 text-neutral-800 mb-4">
              Thống kê tuyển dụng
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="stats-card">
                <div className="text-center">
                  <div className="text-heading-2 text-primary font-bold mb-2">
                    {news.length}
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
