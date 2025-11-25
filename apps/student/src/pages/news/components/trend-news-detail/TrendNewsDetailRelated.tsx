import React from 'react';
import { News } from '@abc-interview-support-frontend/types';

interface TrendNewsDetailRelatedProps {
  currentNewsId: string;
  currentNews: News;
  allNews: News[];
}

export const TrendNewsDetailRelated: React.FC<TrendNewsDetailRelatedProps> = ({
  currentNewsId,
  currentNews,
  allNews,
}) => {
  // Filter related news: same newsType, published, exclude current news, limit to 3
  const relatedNews = allNews
    .filter(newsItem =>
      newsItem.id.toString() !== currentNewsId && // Exclude current news
      newsItem.status === 'PUBLISHED' && // Only published news
      newsItem.newsType === currentNews.newsType // Same news type
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // Sort by newest first
    .slice(0, 3); // Limit to 3 items

  const formatDate = (date: string | Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  const getAuthorName = (userId: number) => {
    // Mock logic based on userId ranges
    if (userId <= 10) return 'Quản trị viên';
    if (userId <= 100) return 'Nhà tuyển dụng';
    return 'Người dùng';
  };

  const getAuthorInitials = (userId: number) => {
    // Mock logic based on userId ranges
    if (userId <= 10) return 'QT';
    if (userId <= 100) return 'NTD';
    return 'ND';
  };

  const handleNewsClick = (newsItem: News) => {
    // Navigate to news detail - sẽ được implement sau
    console.log('Navigate to news:', newsItem.id);
  };

  return (
    <div className="bg-white py-10">
      <div className="container-center">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 className="text-heading-2 text-neutral-800 mb-4 flex items-center justify-center">
              <svg
                className="w-6 h-6 mr-3 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              Bài viết liên quan
            </h2>
            <p className="text-body text-neutral-600 max-w-2xl mx-auto">
              Khám phá thêm những bài viết xu hướng khác có thể bạn quan tâm
            </p>
          </div>

          {/* Related News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedNews.map((newsItem, index) => (
              <button
                key={newsItem.id}
                className="card-interactive overflow-hidden cursor-pointer animate-fade-in-up text-left w-full"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleNewsClick(newsItem)}
                type="button"
              >
                {/* Card Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="badge-accent">Xu hướng</span>
                    <time className="text-caption text-neutral-500">
                      {formatDate(newsItem.createdAt)}
                    </time>
                  </div>

                  <h3 className="text-body-large font-bold text-neutral-800 line-clamp-2 mb-3 hover:text-accent transition-colors">
                    {newsItem.title}
                  </h3>

                  <p className="text-body text-neutral-600 line-clamp-3 leading-relaxed mb-4">
                    {newsItem.content}
                  </p>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-accent rounded-full flex items-center justify-center text-white">
                        <span className="text-caption font-semibold">
                          {getAuthorInitials(newsItem.userId)}
                        </span>
                      </div>
                      <span className="text-caption text-neutral-600">
                        {getAuthorName(newsItem.userId)}
                      </span>
                    </div>

                    <div className="flex items-center text-accent hover:text-accent-dark transition-colors">
                      <span className="text-caption font-medium mr-1">
                        Đọc thêm
                      </span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* View More Section */}
          <div className="text-center mt-8">
            <div className="mb-6">
              <div className="inline-flex items-center space-x-2 text-neutral-600">
                <div className="h-px bg-neutral-300 w-16"></div>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L9 11.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="h-px bg-neutral-300 w-16"></div>
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={() => {
                // Navigate to trend news page
                console.log('Navigate to trend news page');
              }}
            >
              Xem tất cả tin tức xu hướng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
