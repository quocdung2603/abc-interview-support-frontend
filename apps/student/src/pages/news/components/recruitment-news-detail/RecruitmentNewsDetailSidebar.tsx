import { RecruitmentNews } from '@abc-interview-support-frontend/types';
import React from 'react';

interface RecruitmentNewsDetailSidebarProps {
  news: RecruitmentNews;
}

export const RecruitmentNewsDetailSidebar: React.FC<
  RecruitmentNewsDetailSidebarProps
> = ({ news }) => {
  const getCompanyName = () => {
    return news.companyName || 'Không rõ tên Công ty';
  };

  return (
    <div className="space-y-4">
      {/* Company Card */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold">
            TV
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900">
              {getCompanyName()}
            </h3>
            <p className="text-sm text-neutral-600">Tech Company</p>
          </div>
        </div>
        <button className="w-full btn-outline">Tìm hiểu thêm về công</button>
      </div>

      {/* Quick Apply */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="font-semibold text-neutral-900 mb-4">Ứng tuyển nhanh</h3>
        <div className="space-y-4">
          <button className="w-full btn-primary">Gửi CV có sẵn</button>
          <button className="w-full btn-outline">Upload CV mới</button>
        </div>
        <p className="text-xs text-neutral-500 mt-3">
          CV của bạn sẽ được gửi trực tiếp đến nhà tuyển dụng
        </p>
      </div>

      {/* Job Stats */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="font-semibold text-neutral-900 mb-4">Thông tin thêm</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-neutral-600">Hạn nộp:</span>
            <span className="font-medium">28/02/2025</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-600">Số lượng tuyển:</span>
            <span className="font-medium">2-3 người</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-600">Đã ứng tuyển:</span>
            <span className="font-medium">24 hồ sơ</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-600">Lượt xem:</span>
            <span className="font-medium">156 lượt</span>
          </div>
        </div>
      </div>
    </div>
  );
};
