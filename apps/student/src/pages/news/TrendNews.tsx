import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendNewsHeader } from './components/trend-news/TrendNewsHeader';
import { TrendNewsFilter } from './components/trend-news/TrendNewsFilter';
import { TrendNewsList } from './components/trend-news/TrendNewsList';
import { News } from '@abc-interview-support-frontend/types';
import { newsService } from '@abc-interview-support-frontend/services';

export const TrendNews: React.FC = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState<News[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  const getNewsByType = async (newsType: string) => {
    try {
      const res = await newsService.getNewsByType(newsType);
      const news = res.content || [];
      setNews(news);
    } catch (error) {
      console.error('Error fetching news by type:', error);
      setNews([]);
    }
  }

  useEffect(() => {
    getNewsByType('NEWS');
  }, []);

  // Filter and sort news - NEWS articles (API already filtered by type)
  const filteredAndSortedNews = useMemo(() => {
    const filtered = news.filter((newsItem) => {
      // Only show published news with NEWS type
      const isPublished = newsItem.status === 'PUBLISHED';
      const isNewsType = newsItem.newsType === 'NEWS';

      // Filter by search term
      const matchesSearch =
        newsItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        newsItem.content.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by author type (based on userId pattern)
      let matchesAuthor = true;
      if (authorFilter) {
        const userIdStr = newsItem.userId.toString();
        if (authorFilter === 'admin') {
          matchesAuthor = userIdStr.startsWith('admin');
        } else if (authorFilter === 'recruiter') {
          matchesAuthor = userIdStr.startsWith('recruiter');
        } else if (authorFilter === 'user') {
          matchesAuthor = userIdStr.startsWith('user');
        }
      }

      return isPublished && isNewsType && matchesSearch && matchesAuthor;
    });

    // Sort news
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [news, searchTerm, authorFilter, sortBy]);

  const handleNewsClick = (newsItem: News) => {
    // Navigate to news detail page with state
    console.log('Navigating to news detail with ID:', newsItem.id, typeof newsItem.id);
    navigate(`/trend-news-detail/${newsItem.id}`, {
      state: {
        news: newsItem,
        allNews: news // Pass all news for related articles
      }
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header Section */}
      <TrendNewsHeader/>

      {/* Main Content */}
      <div className="container-center section-padding">
        {/* Filter Section */}
        <TrendNewsFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          authorFilter={authorFilter}
          onAuthorFilterChange={setAuthorFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* News List Section */}
        <TrendNewsList
          news={filteredAndSortedNews}
          onNewsClick={handleNewsClick}
        />
      </div>

      {/* Call to Action Section */}
      {filteredAndSortedNews.length > 0 && (
        <div className="bg-gradient-accent py-12">
          <div className="container-center text-center">
            <h2 className="text-heading-1 text-white mb-3">
              Muốn cập nhật xu hướng mới nhất?
            </h2>
            <p className="text-heading-2 text-white-90 mb-6 max-w-2xl mx-auto">
              Đăng ký nhận thông báo để không bỏ lỡ những tin tức xu hướng quan
              trọng nhất
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="input-field flex-1"
              />
              <button className="btn-primary whitespace-nowrap">
                Đăng ký ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
