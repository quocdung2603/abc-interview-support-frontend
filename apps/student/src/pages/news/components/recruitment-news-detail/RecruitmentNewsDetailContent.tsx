import { News } from '@abc-interview-support-frontend/types';
import React from 'react';

interface RecruitmentNewsDetailContentProps {
  news: News;
}

export const RecruitmentNewsDetailContent: React.FC<
  RecruitmentNewsDetailContentProps
> = ({ news }) => {
  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div
          className="prose prose-custom max-w-none"
          dangerouslySetInnerHTML={{ __html: news.content }}
        />
      </div>
    </div>
  );
};
