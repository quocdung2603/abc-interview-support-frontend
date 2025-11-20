import React from 'react';
import { News } from '@frontend/types';

interface TrendNewsDetailRelatedProps {
  currentNewsId: string;
}

export const TrendNewsDetailRelated: React.FC<TrendNewsDetailRelatedProps> = ({
  currentNewsId,
}) => {
  // Mock related news data - Trong thực tế sẽ fetch từ API
  const relatedNews: News[] = [
    {
      newsId: 'related-1',
      userId: 'admin-002',
      newsType: 'trend',
      title: 'Kỹ năng phỏng vấn online: Bí quyết thành công trong kỷ nguyên số',
      content:
        'Với sự phát triển của công nghệ, phỏng vấn online đang trở thành xu hướng phổ biến. Tìm hiểu những kỹ năng cần thiết để gây ấn tượng với nhà tuyển dụng qua màn hình.',
      createdAt: new Date('2025-01-13T14:30:00'),
    },
    {
      newsId: 'related-2',
      userId: 'recruiter-005',
      newsType: 'trend',
      title: 'DevOps Engineer: Vị trí hot nhất trong ngành IT 2025',
      content:
        'DevOps Engineer đang trở thành một trong những vị trí được săn đón nhất. Khám phá lý do tại sao và những kỹ năng cần thiết để trở thành DevOps Engineer chuyên nghiệp.',
      createdAt: new Date('2025-01-12T09:15:00'),
    },
    {
      newsId: 'related-3',
      userId: 'admin-003',
      newsType: 'trend',
      title: 'Làm việc từ xa: Xu hướng không thể đảo ngược của tương lai',
      content:
        'Remote work không chỉ là xu hướng tạm thời mà đã trở thành một phần thiết yếu của môi trường làm việc hiện đại. Tìm hiểu cách tối ưu hóa hiệu quả làm việc từ xa.',
      createdAt: new Date('2025-01-11T16:45:00'),
    },
  ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getAuthorName = (userId: string) => {
    if (userId.startsWith('admin')) return 'Quản trị viên';
    if (userId.startsWith('recruiter')) return 'Nhà tuyển dụng';
    return 'Người dùng';
  };

  const getAuthorInitials = (userId: string) => {
    if (userId.startsWith('admin')) return 'QT';
    if (userId.startsWith('recruiter')) return 'NTD';
    return 'ND';
  };

  const handleNewsClick = (newsItem: News) => {
    // Navigate to news detail - sẽ được implement sau
    console.log('Navigate to news:', newsItem.newsId);
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
                key={newsItem.newsId}
                className="card-interactive overflow-hidden cursor-pointer animate-fade-in-up text-left w-full"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleNewsClick(newsItem)}
                type="button"
              >
                {/* Card Image Placeholder */}
                <div className="h-48 bg-gradient-accent-avatar flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-pattern-primary opacity-20"></div>
                  <div className="relative z-10 text-center text-white p-6">
                    <svg
                      className="w-12 h-12 mx-auto mb-3 opacity-80"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L9 11.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="text-caption font-semibold opacity-90">
                      Xu hướng
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="badge-accent">Xu hướng</span>
                    <time className="text-caption text-neutral-500">
                      {formatDate(newsItem.createdAt)}
                    </time>
                  </div>

                  <h3 className="text-body-large font-semibold text-neutral-800 line-clamp-2 mb-3 hover:text-accent transition-colors">
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
