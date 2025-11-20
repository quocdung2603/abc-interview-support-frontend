import React from 'react';
import { News } from '@frontend/types';

interface TrendNewsDetailHeaderProps {
  news: News;
}

export const TrendNewsDetailHeader: React.FC<TrendNewsDetailHeaderProps> = ({
  news,
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getAuthorName = (userId: string) => {
    if (userId.startsWith('admin')) return 'Quản trị viên';
    if (userId.startsWith('recruiter')) return 'Nhà tuyển dụng';
    if (userId.startsWith('user')) return 'Người dùng';
    return 'Tác giả';
  };

  const getAuthorInitials = (userId: string) => {
    if (userId.startsWith('admin')) return 'QT';
    if (userId.startsWith('recruiter')) return 'NTD';
    if (userId.startsWith('user')) return 'ND';
    return 'TG';
  };

  return (
    <div className="news-header">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern-primary opacity-10"></div>

      <div className="relative container-center">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6 animate-fade-in-up">
            <div className="flex items-center space-x-2 text-white-80">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="cursor-pointer hover:text-white transition-colors">
                Tin tức xu hướng
              </span>
              <span>/</span>
              <span className="text-white">Chi tiết bài viết</span>
            </div>
          </nav>

          {/* Article Badge */}
          <div className="mb-6 animate-fade-in-up">
            <span className="badge-white-outline">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L9 11.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                  clipRule="evenodd"
                />
              </svg>
              Xu hướng hot
            </span>
          </div>

          {/* Article Title */}
          <h1 className="text-display text-white mb-6 leading-tight animate-fade-in-up">
            {news.title}
          </h1>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6 animate-fade-in-up">
            {/* Author */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-accent-avatar rounded-full flex items-center justify-center text-white font-semibold">
                {getAuthorInitials(news.userId)}
              </div>
              <div>
                <div className="text-white font-medium">
                  {getAuthorName(news.userId)}
                </div>
                <div className="text-white-80 text-caption">Tác giả</div>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center space-x-2 text-white-80">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{formatDate(news.createdAt)}</span>
            </div>

            {/* Reading Time Estimate */}
            <div className="flex items-center space-x-2 text-white-80">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span>{Math.ceil(news.content.length / 1000)} phút đọc</span>
            </div>
          </div>

          {/* Social Actions */}
          <div className="flex items-center gap-3 animate-fade-in-up">
            <button className="flex items-center space-x-2 bg-white-10 backdrop-filter backdrop-blur-10 border border-white-20 rounded-lg px-4 py-2 text-white hover:bg-white-20 transition-all">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>Yêu thích</span>
            </button>

            <button className="flex items-center space-x-2 bg-white-10 backdrop-filter backdrop-blur-10 border border-white-20 rounded-lg px-4 py-2 text-white hover:bg-white-20 transition-all">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
              <span>Chia sẻ</span>
            </button>

            <button className="flex items-center space-x-2 bg-white-10 backdrop-filter backdrop-blur-10 border border-white-20 rounded-lg px-4 py-2 text-white hover:bg-white-20 transition-all">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              <span>Lưu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white-05 rounded-full animate-gentle-float"></div>
      <div
        className="absolute bottom-10 right-10 w-16 h-16 bg-white-05 rounded-full animate-gentle-float"
        style={{ animationDelay: '2s' }}
      ></div>
      <div
        className="absolute top-1/2 left-20 w-12 h-12 bg-white-05 rounded-full animate-gentle-float"
        style={{ animationDelay: '4s' }}
      ></div>
    </div>
  );
};
