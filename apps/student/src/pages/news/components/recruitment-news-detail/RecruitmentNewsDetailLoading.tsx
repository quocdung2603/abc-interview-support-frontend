import React from 'react';

export const RecruitmentNewsDetailLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Loading skeleton */}
      <div className="bg-white">
        <div className="container-center py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 rounded mb-4 w-2/3"></div>
            <div className="h-4 bg-neutral-200 rounded mb-2 w-1/3"></div>
            <div className="h-4 bg-neutral-200 rounded mb-8 w-1/4"></div>
          </div>
        </div>
      </div>

      <div className="container-center section-padding">
        <div className="animate-pulse space-y-6">
          <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
          <div className="h-4 bg-neutral-200 rounded w-full"></div>
          <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
          <div className="h-32 bg-neutral-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};
