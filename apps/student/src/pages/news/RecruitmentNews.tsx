import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecruitmentNewsHeader } from './components/recruiment-news/RecruitmentNewsHeader';
import { RecruitmentNewsFilter } from './components/recruiment-news/RecruitmentNewsFilter';
import { RecruitmentNewsList } from './components/recruiment-news/RecruitmentNewsList';
import { RecruitmentNews as RNews } from '@abc-interview-support-frontend/types';
import { newsService } from '@abc-interview-support-frontend/services';

type SortOption = 'newest' | 'oldest' | 'salary';

export const RecruitmentNews: React.FC = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState<RNews[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [salaryFilter, setSalaryFilter] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const getNewsByType = async (newsType: string) => {
    try {
      const res = await newsService.getNewsByType(newsType);
      const news = res.content || [];
      console.log('Fetched recruitment news:', news);
      setNews(news);
    } catch (error) {
      console.error('Error fetching news by type:', error);
      setNews([]);
    }
  }

  useEffect(() => {
    getNewsByType('RECRUITMENT');
  }, []);

  // Filter and sort news - CHỈ XỬ LÝ TIN TỨC TUYỂN DỤNG ĐÃ ĐƯỢC PUBLISH
  const filteredAndSortedNews = useMemo(() => {
    const filtered = news.filter((newsItem) => {
      // CHỈ LẤY TIN TỨC CÓ NEWSTYPE LÀ 'RECRUITMENT' VÀ STATUS LÀ 'PUBLISHED'
      const isRecruitmentNews = newsItem.newsType === 'RECRUITMENT';
      const isPublished = newsItem.status === 'PUBLISHED';

      // Filter by search term
      const matchesSearch =
        newsItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        newsItem.content.toLowerCase().includes(searchTerm.toLowerCase());

      // Basic filters (trong thực tế sẽ có logic phức tạp hơn dựa trên metadata)
      let matchesCompany = true;
      let matchesLocation = true;
      let matchesSalary = true;

      // Simple keyword matching cho demo
      if (companyFilter) {
        const companyKeywords = {
          tech: ['tech', 'startup', 'ai', 'fintech'],
          finance: ['fintech', 'finance', 'bank'],
          startup: ['startup', 'series', 'equity'],
          enterprise: ['platform', 'enterprise', 'corporation'],
        };
        const keywords =
          companyKeywords[companyFilter as keyof typeof companyKeywords] || [];
        matchesCompany = keywords.some((keyword) =>
          newsItem.content.toLowerCase().includes(keyword)
        );
      }

      if (locationFilter) {
        const locationKeywords = {
          hanoi: ['hà nội', 'hanoi'],
          hcm: ['tp.hcm', 'hồ chí minh', 'q1', 'quận 1'],
          danang: ['đà nẵng', 'danang'],
          remote: ['remote', 'từ xa'],
          hybrid: ['hybrid', 'linh hoạt'],
        };
        const keywords =
          locationKeywords[locationFilter as keyof typeof locationKeywords] ||
          [];
        matchesLocation = keywords.some((keyword) =>
          newsItem.content.toLowerCase().includes(keyword)
        );
      }

      if (salaryFilter) {
        const salaryContent = newsItem.content.toLowerCase();
        switch (salaryFilter) {
          case 'under-15m':
            matchesSalary = /\b(10|12|15)[\s-]*m\b/.test(salaryContent);
            break;
          case '15m-25m':
            matchesSalary = /\b(15|18|20|22|25)[\s-]*m\b/.test(salaryContent);
            break;
          case '25m-40m':
            matchesSalary = /\b(25|28|30|35|40)[\s-]*m\b/.test(salaryContent);
            break;
          case 'above-40m':
            matchesSalary = /\b(40|45|50|60)[\s-]*m\b/.test(salaryContent);
            break;
          case 'negotiate':
            matchesSalary = /negotiable|thỏa thuận|trao đổi/.test(
              salaryContent
            );
            break;
        }
      }

      return (
        isRecruitmentNews &&
        isPublished &&
        matchesSearch &&
        matchesCompany &&
        matchesLocation &&
        matchesSalary
      );
    });

    // Sort news
    filtered.sort((a, b) => {
      if (sortBy === 'salary') {
        // Simple salary sorting based on content analysis
        const getSalaryValue = (content: string) => {
          const salaryRegex = /(\d+)[\s-]*m/i;
          const salaryMatch = salaryRegex.exec(content);
          return salaryMatch ? Number.parseInt(salaryMatch[1]) : 0;
        };
        return getSalaryValue(b.content) - getSalaryValue(a.content);
      } else {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
      }
    });

    return filtered;
  }, [news, searchTerm, companyFilter, locationFilter, salaryFilter, sortBy]);

  const handleNewsClick = (newsItem: RNews) => {
    // Navigate to recruitment news detail page with state
    console.log('Navigating to recruitment news detail with ID:', newsItem.id, typeof newsItem.id);
    navigate(`/recruitment-news-detail/${newsItem.id}`, {
      state: {
        news: newsItem,
        allNews: news // Pass all news for related articles
      }
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header Section */}
      <RecruitmentNewsHeader newsCount={news.length} />

      {/* Main Content */}
      <div className="container-center section-padding">
        {/* Filter Section */}
        <RecruitmentNewsFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          companyFilter={companyFilter}
          onCompanyFilterChange={setCompanyFilter}
          locationFilter={locationFilter}
          onLocationFilterChange={setLocationFilter}
          salaryFilter={salaryFilter}
          onSalaryFilterChange={setSalaryFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* News List Section */}
        <RecruitmentNewsList
          news={filteredAndSortedNews}
          onNewsClick={handleNewsClick}
        />
      </div>

      {/* Call to Action Section */}
      {filteredAndSortedNews.length > 0 && (
        <div className="bg-gradient-primary py-12">
          <div className="container-center text-center">
            <h2 className="text-heading-2 text-white mb-3">
              Bạn là nhà tuyển dụng?
            </h2>
            <p className="text-body-large text-white-90 mb-6 max-w-2xl mx-auto">
              Đăng tin tuyển dụng miễn phí và tiếp cận hàng nghìn ứng viên tiềm
              năng
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button className="btn-secondary">Đăng tin tuyển dụng</button>
              <button className="btn-outline bg-white text-primary border-white hover:bg-neutral-100">
                Tìm hiểu thêm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruitmentNews;
