import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { TrendNewsDetailHeader } from './components/trend-news-detail/TrendNewsDetailHeader';
import { TrendNewsDetailContent } from './components/trend-news-detail/TrendNewsDetailContent';
import { TrendNewsDetailRelated } from './components/trend-news-detail/TrendNewsDetailRelated';
import { News, User } from '@abc-interview-support-frontend/types';
import { newsService, userService } from '@abc-interview-support-frontend/services';

const TrendNewsDetail: React.FC = () => {
  const location = useLocation();
  const newsFromState = location.state?.news as News | undefined;
  const allNewsFromState = location.state?.allNews as News[] | undefined;
  const [news, setNews] = useState<News | null>(newsFromState || null);
  const [author, setAuthor] = useState<User | null>(null);
  const [loading, setLoading] = useState(!newsFromState);
  const [error, setError] = useState<string | null>(null);

  const fetchAuthor = async (userId: string) => {
    try {
      const userData = await userService.getUserById(userId);
      setAuthor(userData);
    } catch (error) {
      console.error('Error fetching author:', error);
      setAuthor(null);
    }
  };

  // Fetch news detail from API if not provided via state
  useEffect(() => {
    const fetchNewsAndAuthor = async (newsId: string) => {
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
        console.log('Fetched news data:', newsData);
        setNews(newsData);
        // Fetch author data after getting news
        if (newsData.userId) {
          fetchAuthor(newsData.userId.toString());
        }
      } catch (err) {
        console.error('Error fetching news detail:', err);
        setError('Failed to load news article');
        setNews(null);
      } finally {
        setLoading(false);
      }
    };

    if (newsFromState) {
      // Use news from navigation state
      setNews(newsFromState);
      setLoading(false);
      setError(null);
      // Fetch author data
      if (newsFromState.userId) {
        fetchAuthor(newsFromState.userId.toString());
      }
    } else {
      // Extract ID from URL path and fetch
      const pathSegments = location.pathname.split('/');
      const newsIdFromPath = pathSegments.at(-1);

      if (newsIdFromPath) {
        fetchNewsAndAuthor(newsIdFromPath);
      } else {
        setError('No news ID provided');
        setLoading(false);
      }
    }
  }, [newsFromState, location.pathname]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-neutral-600">Đang tải bài viết...</p>
        </div>
      </div>
    );
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

  // Nếu chưa có data
  if (!news) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600">Không tìm thấy bài viết</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Article Header */}
      <TrendNewsDetailHeader news={news} author={author} />

      {/* Article Content */}
      <TrendNewsDetailContent news={news} author={author} />

      {/* Related Articles */}
      <TrendNewsDetailRelated
        currentNewsId={news.id.toString()}
        currentNews={news}
        allNews={allNewsFromState || []}
      />
    </div>
  );
};

export default TrendNewsDetail;
