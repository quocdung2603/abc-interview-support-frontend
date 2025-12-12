import { RecruitmentNews } from '@abc-interview-support-frontend/types';
import React from 'react';
import dayjs from 'dayjs';

interface RecruitmentNewsDetailContentProps {
  news: RecruitmentNews;
}

export const RecruitmentNewsDetailContent: React.FC<
  RecruitmentNewsDetailContentProps
> = ({ news }) => {
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('DD/MM/YYYY HH:mm:ss');
  };

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Job Overview */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-heading-2 text-neutral-900 mb-4">Thông tin vị trí</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {news.position && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                  <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Vị trí</p>
                <p className="font-medium text-neutral-900">{news.position}</p>
              </div>
            </div>
          )}

          {news.companyName && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Công ty</p>
                <p className="font-medium text-neutral-900">{news.companyName}</p>
              </div>
            </div>
          )}

          {news.location && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Địa điểm</p>
                <p className="font-medium text-neutral-900">{news.location}</p>
              </div>
            </div>
          )}

          {news.workingHours && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Giờ làm việc</p>
                <p className="font-medium text-neutral-900">{news.workingHours}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Requirements & Compensation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {news.experience && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-heading-3 text-neutral-900 mb-3">Kinh nghiệm yêu cầu</h3>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent-50 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-neutral-900 font-medium">{news.experience}</span>
            </div>
          </div>
        )}

        {news.salary && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-heading-3 text-neutral-900 mb-3">Mức lương</h3>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-success-50 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </div>
              <span className="text-neutral-900 font-medium">{news.salary}</span>
            </div>
          </div>
        )}
      </div>

      {/* Application Info */}
      {(news.deadline || news.applicationMethod) && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-heading-2 text-neutral-900 mb-4">Thông tin ứng tuyển</h3>
          <div className="space-y-4">
            {news.deadline && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-warning-50 rounded-lg flex items-center justify-center mt-0.5">
                  <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Hạn nộp hồ sơ</p>
                  <p className="font-medium text-neutral-900">{formatDate(news.deadline)}</p>
                </div>
              </div>
            )}

            {news.applicationMethod && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-info-50 rounded-lg flex items-center justify-center mt-0.5">
                  <svg className="w-4 h-4 text-info" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Cách thức ứng tuyển</p>
                  <p className="text-neutral-900">{news.applicationMethod}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detailed Content */}
      {news.content && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-heading-2 text-neutral-900 mb-4">Chi tiết công việc</h3>
          <div
            className="prose prose-custom max-w-none"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </div>
      )}
    </div>
  );
};
