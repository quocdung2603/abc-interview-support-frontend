import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendNewsHeader } from './components/trend-news/TrendNewsHeader';
import { TrendNewsFilter } from './components/trend-news/TrendNewsFilter';
import { TrendNewsList } from './components/trend-news/TrendNewsList';
import { News, Field } from '@abc-interview-support-frontend/types';
import { newsService, questionService } from '@abc-interview-support-frontend/services';

export const TrendNews: React.FC = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState<News[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [fieldId, setFieldId] = useState<number | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

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

  const getFields = async () => {
    try {
      const res = await questionService.getAllFields();
      const fields = res.content || [];
      setFields(fields);
    } catch (error) {
      console.error('Error fetching fields:', error);
      setFields([]);
    }
  }

  useEffect(() => {
    getNewsByType('NEWS');
    getFields();
  }, []);

  // Filter and sort news - NEWS articles (API already filtered by type)
  const filteredAndSortedNews = useMemo(() => {
    const filtered = news.filter((newsItem) => {
      // Only show published news with NEWS type
      const isPublished = newsItem.status === 'PUBLISHED';
      const isNewsType = newsItem.newsType === 'NEWS';

      // Filter by search term (title only)
      const matchesSearch = searchTerm === '' ||
        newsItem.title.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by fieldId
      const matchesField = fieldId === undefined || newsItem.fieldId === fieldId;

      // Filter by date range
      let matchesDateRange = true;
      if (dateRange && dateRange[0] && dateRange[1]) {
        const itemDate = new Date(newsItem.createdAt);
        const startDate = new Date(dateRange[0]);
        const endDate = new Date(dateRange[1]);
        matchesDateRange = itemDate >= startDate && itemDate <= endDate;
      }

      return isPublished && isNewsType && matchesSearch && matchesField && matchesDateRange;
    });

    // Sort by newest first (default)
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // newest first
    });

    console.log('Total news from API:', news.length);
    console.log('Filtered news:', filtered.length);
    console.log('Items per page:', 9);
    console.log('Total pages:', Math.ceil(filtered.length / 9));

    console.log('Total news from API:', news.length);
    console.log('Filtered news:', filtered.length);
    console.log('Items per page:', 9);
    console.log('Total pages:', Math.ceil(filtered.length / 9));

    return filtered;
  }, [news, searchTerm, fieldId, dateRange]);

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
      <div className='mb-6'>
        <TrendNewsHeader />
      </div>

      {/* Main Content */}
      <div className="container-center">
        {/* Filter Section */}
        <TrendNewsFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          fields={fields}
          fieldId={fieldId}
          onFieldChange={setFieldId}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />

        {/* News List Section */}
        <div className="my-6">
          <TrendNewsList
            news={filteredAndSortedNews}
            onNewsClick={handleNewsClick}
          />
        </div>
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
