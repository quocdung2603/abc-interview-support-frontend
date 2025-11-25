import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { RecruitmentNewsDetailLoading } from './components/recruitment-news-detail/RecruitmentNewsDetailLoading';
import { RecruitmentNewsDetailNotFound } from './components/recruitment-news-detail/RecruitmentNewsDetailNotFound';
import { RecruitmentNewsDetailHeader } from './components/recruitment-news-detail/RecruitmentNewsDetailHeader';
import { RecruitmentNewsDetailContent } from './components/recruitment-news-detail/RecruitmentNewsDetailContent';
import { RecruitmentNewsDetailSidebar } from './components/recruitment-news-detail/RecruitmentNewsDetailSidebar';
import { RecruitmentNews as RNews } from '@abc-interview-support-frontend/types';
import { newsService } from '@abc-interview-support-frontend/services';

export const RecruitmentNewsDetail: React.FC = () => {
  const location = useLocation();
  const newsFromState = location.state?.news as RNews | undefined;
  const [news, setNews] = useState<RNews | null>(newsFromState || null);
  const [loading, setLoading] = useState(!newsFromState);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsDetail = async (newsId: string) => {
      // Validate ID
      if (!newsId || newsId.trim() === '' || Number.isNaN(Number(newsId))) {
        setError('Invalid news ID');
        setLoading(false);
        return;
      }

      const numericId = Number(newsId);
      if (numericId <= 0) {
        setError('News ID must be a positive number');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const newsData = await newsService.getNewById(numericId);
        console.log('Fetched recruitment news data:', newsData);

        // Ensure this is recruitment news
        if (newsData.newsType !== 'RECRUITMENT') {
          setError('This news is not a recruitment article');
          setNews(null);
          return;
        }

        setNews(newsData);
      } catch (err) {
        console.error('Error fetching recruitment news detail:', err);
        setError('Failed to load recruitment news article');
        setNews(null);
      } finally {
        setLoading(false);
      }
    };

    if (newsFromState) {
      // Use news from navigation state
      console.log('Using recruitment news from navigation state:', newsFromState);
      setNews(newsFromState);
      setLoading(false);
      setError(null);
    } else {
      // Extract ID from URL path and fetch
      const pathSegments = location.pathname.split('/');
      const newsIdFromPath = pathSegments.at(-1);

      if (newsIdFromPath) {
        fetchNewsDetail(newsIdFromPath);
      } else {
        setError('No news ID provided');
        setLoading(false);
      }
    }
  }, [newsFromState, location.pathname]);

  // Loading state
  if (loading) {
    return <RecruitmentNewsDetailLoading />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-red-100 rounded-full">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-neutral-800 mb-2">
            Không thể tải bài viết
          </h2>
          <p className="text-neutral-600 mb-4">{error}</p>
          <button
            onClick={() => globalThis.history.back()}
            className="btn-primary"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  // Not found state
  if (!news) {
    return <RecruitmentNewsDetailNotFound />;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header Section với thông tin job */}
      <RecruitmentNewsDetailHeader news={news} />

      {/* Main Content */}
      <div className="container-center section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Content */}
          <RecruitmentNewsDetailContent news={news} />

          {/* Sidebar với thông tin công ty và action */}
          <RecruitmentNewsDetailSidebar news={news} />
        </div>
      </div>
    </div>
  );
};

export default RecruitmentNewsDetail;
