import React from 'react';
import { News, User } from '@abc-interview-support-frontend/types';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

interface TrendNewsDetailHeaderProps {
  news: News;
  author?: User | null;
}

export const TrendNewsDetailHeader: React.FC<TrendNewsDetailHeaderProps> = ({
  news,
  author,
}) => {
  const formatDate = (date: string | Date) => {
    return dayjs(date).format('DD/MM/YYYY HH:mm:ss');
  };

  const getAuthorName = () => {
    if (author?.fullName) {
      return author.fullName;
    }
    return 'Unknown Author';
  };

  const getAuthorInitials = () => {
    if (author?.fullName) {
      return author.fullName.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2);
    }
    if (news.userId) {
      const userIdStr = news.userId.toString();
      if (userIdStr.startsWith('admin')) return 'QT';
      if (userIdStr.startsWith('recruiter')) return 'NTD';
      if (userIdStr.startsWith('user')) return 'ND';
    }
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
            <Link to={`/trend-news`} className="flex items-center space-x-2 text-white-80">
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
            </Link>
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
                {getAuthorInitials()}
              </div>
              <div>
                <div className="text-white font-medium">
                  {getAuthorName()}
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
