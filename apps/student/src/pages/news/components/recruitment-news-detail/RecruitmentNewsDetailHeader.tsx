import { RecruitmentNews } from '@abc-interview-support-frontend/types';
import React from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

interface RecruitmentNewsDetailHeaderProps {
  news: RecruitmentNews;
}

export const RecruitmentNewsDetailHeader: React.FC<
  RecruitmentNewsDetailHeaderProps
> = ({ news }) => {
  const formatDate = (date: string | Date) => {
    return dayjs(date).format('DD/MM/YYYY HH:mm:ss');
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
        <nav className="mb-6 animate-fade-in-up">
          <Link to={`/recruitment-news`} className="flex items-center space-x-2 text-white-80">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span className="cursor-pointer hover:text-white transition-colors">
              Tin tức tuyển dụng
            </span>
            <span>/</span>
            <span className="text-white">Chi tiết tuyển dụng</span>
          </Link>
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
          </div>
        </div>
      </div>
    </div>
  );
};
