import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecruitmentNewsHeader } from './components/recruiment-news/RecruitmentNewsHeader';
import { RecruitmentNewsFilter } from './components/recruiment-news/RecruitmentNewsFilter';
import { RecruitmentNewsList } from './components/recruiment-news/RecruitmentNewsList';
import { News } from '@abc-interview-support-frontend/types';

/**
 * TRANG TIN TỨC TUYỂN DỤNG
 *
 * Component này và tất cả các component con của nó CHỈ XỬ LÝ TIN TỨC CÓ newsType = 'recruitment'
 *
 * Features:
 * - Hiển thị danh sách tin tức tuyển dụng từ các công ty
 * - Lọc theo từ khóa, công ty, địa điểm, mức lương
 * - Sắp xếp theo thời gian và mức lương
 * - Responsive design
 * - Hiển thị thông tin chi tiết về việc làm
 *
 * Tin tức tuyển dụng được đăng bởi:
 * - Recruiter (recruiter-xxx)
 * - Company HR (company-xxx)
 */

// Mock data cho tin tức tuyển dụng - Trong thực tế sẽ fetch từ API
const mockRecruitmentNews: News[] = [
  {
    newsId: 'r1',
    userId: 'recruiter-001',
    newsType: 'recruitment',
    title: 'Tuyển Senior Frontend Developer - React/Next.js',
    content:
      'Chúng tôi đang tìm kiếm Senior Frontend Developer có kinh nghiệm với React, Next.js để join team phát triển sản phẩm fintech hàng đầu. Yêu cầu: 3+ năm kinh nghiệm, thành thạo TypeScript, có kinh nghiệm với microservices. Lương 25-40M, làm việc hybrid.',
    createdAt: new Date('2025-01-15T08:30:00'),
  },
  {
    newsId: 'r2',
    userId: 'recruiter-002',
    newsType: 'recruitment',
    title: 'Backend Developer - Node.js/Python tại Startup AI',
    content:
      'Startup AI đang scale up cần Backend Developer giỏi Node.js hoặc Python. Làm việc với data science team để phát triển API cho ML models. Remote-first company, flexible working hours. Package 20-35M + equity.',
    createdAt: new Date('2025-01-14T16:45:00'),
  },
  {
    newsId: 'r3',
    userId: 'company-001',
    newsType: 'recruitment',
    title: 'DevOps Engineer - AWS/Kubernetes - Công ty Fintech',
    content:
      'Vị trí DevOps Engineer cho hệ thống fintech xử lý hàng triệu giao dịch/ngày. Cần kinh nghiệm AWS, Kubernetes, Docker, CI/CD. Team quốc tế, làm việc với Singapore office. Lương negotiable up to 50M.',
    createdAt: new Date('2025-01-14T10:20:00'),
  },
  {
    newsId: 'r4',
    userId: 'recruiter-003',
    newsType: 'recruitment',
    title: 'Product Manager - Tech Startup Series A',
    content:
      'Tech startup vừa gọi vốn Series A 10M USD cần Product Manager để lead product strategy. Yêu cầu: MBA hoặc kinh nghiệm tương đương, data-driven mindset, experience với B2B SaaS. Salary: 30-45M + stock options.',
    createdAt: new Date('2025-01-13T14:15:00'),
  },
  {
    newsId: 'r5',
    userId: 'company-002',
    newsType: 'recruitment',
    title: 'UX/UI Designer - E-commerce Platform',
    content:
      'E-commerce platform hàng đầu VN tuyển UX/UI Designer cho mobile app. Cần portfolio mạnh về mobile design, hiểu biết về user research và usability testing. Team design 15+ người, văn phòng đẹp tại Q1. Lương 18-28M.',
    createdAt: new Date('2025-01-13T09:30:00'),
  },
  {
    newsId: 'r6',
    userId: 'recruiter-004',
    newsType: 'recruitment',
    title: 'Data Scientist - Machine Learning Engineer',
    content:
      'Công ty AI hàng đầu cần Data Scientist với strong background về ML/DL. Work with latest tech: PyTorch, TensorFlow, MLOps. Research-oriented environment, publish papers. PhD preferred nhưng không bắt buộc. Salary: 35-60M.',
    createdAt: new Date('2025-01-12T15:45:00'),
  },
];

type SortOption = 'newest' | 'oldest' | 'salary';

export const RecruitmentNews: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<News[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [salaryFilter, setSalaryFilter] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Simulate data loading
  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // CHỈ LẤY TIN TỨC CÓ NEWSTYPE LÀ 'RECRUITMENT'
      const recruitmentNewsOnly = mockRecruitmentNews.filter(
        (newsItem) => newsItem.newsType === 'recruitment'
      );
      setNews(recruitmentNewsOnly);
      setLoading(false);
    };

    loadNews();
  }, []);

  // Filter and sort news - CHỈ XỬ LÝ TIN TỨC TUYỂN DỤNG
  const filteredAndSortedNews = useMemo(() => {
    const filtered = news.filter((newsItem) => {
      // CHỈ LẤY TIN TỨC CÓ NEWSTYPE LÀ 'RECRUITMENT'
      const isRecruitmentNews = newsItem.newsType === 'recruitment';

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
          return salaryMatch ? parseInt(salaryMatch[1]) : 0;
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

  const handleNewsClick = (newsItem: News) => {
    // Navigate to recruitment news detail page
    navigate(`/recruitment-news-detail/${newsItem.newsId}`);
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
          loading={loading}
          onNewsClick={handleNewsClick}
        />
      </div>

      {/* Call to Action Section */}
      {!loading && filteredAndSortedNews.length > 0 && (
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
