import { News } from '@abc-interview-support-frontend/types';
import React from 'react';

interface RecruitmentNewsDetailHeaderProps {
  news: News;
}

export const RecruitmentNewsDetailHeader: React.FC<
  RecruitmentNewsDetailHeaderProps
> = ({ news }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const getCompanyName = () => {
    // Extract company name from userId hoặc content
    if (news.userId.startsWith('recruiter-')) {
      return 'TechViet Solutions';
    }
    return 'Công ty ABC';
  };

  const getJobType = () => {
    if (news.title.toLowerCase().includes('senior')) return 'Senior Level';
    if (news.title.toLowerCase().includes('junior')) return 'Junior Level';
    if (news.title.toLowerCase().includes('intern')) return 'Internship';
    return 'Middle Level';
  };

  const getUrgencyBadge = () => {
    const daysOld = Math.floor(
      (Date.now() - new Date(news.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysOld <= 3) return 'Mới đăng';
    if (daysOld <= 7) return 'Hot Job';
    return null;
  };

  return (
    <div className="bg-gradient-primary text-white">
      <div className="container-center py-10">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-white-70">
            <li>
              <button
                onClick={() => window.history.back()}
                className="hover:text-white transition-colors"
              >
                Tin tức tuyển dụng
              </button>
            </li>
            <li>/</li>
            <li className="text-white">Chi tiết</li>
          </ol>
        </nav>

        {/* Job Info */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {getUrgencyBadge() && (
                <span className="badge-success text-xs">
                  {getUrgencyBadge()}
                </span>
              )}
              <span className="badge-secondary text-xs">{getJobType()}</span>
              <span className="text-white-70 text-sm">
                {formatDate(news.createdAt)}
              </span>
            </div>

            <h1 className="text-heading-1 mb-3">{news.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-white-90">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{getCompanyName()}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>TP.HCM (Hybrid)</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>25-40 triệu VND</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button className="btn-secondary">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              Ứng tuyển ngay
            </button>
            <button className="btn-outline border-white text-white hover:bg-white hover:text-primary">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
              Lưu tin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
