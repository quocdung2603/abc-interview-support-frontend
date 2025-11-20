import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendNewsHeader } from './components/trend-news/TrendNewsHeader';
import { TrendNewsFilter } from './components/trend-news/TrendNewsFilter';
import { TrendNewsList } from './components/trend-news/TrendNewsList';
import { News } from '@abc-interview-support-frontend/types';

/**
 * TRANG TIN TỨC XU HƯỚNG
 *
 * Component này và tất cả các component con của nó CHỈ XỬ LÝ TIN TỨC CÓ newsType = 'trend'
 *
 * Features:
 * - Hiển thị danh sách tin tức xu hướng
 * - Lọc theo từ khóa và tác giả
 * - Sắp xếp theo thời gian
 * - Responsive design
 *
 * Tin tức có thể được đăng bởi:
 * - Admin (admin-xxx)
 * - Recruiter (recruiter-xxx)
 * - User (user-xxx)
 */

// Mock data - Trong thực tế sẽ fetch từ API
const mockTrendNews: News[] = [
  {
    newsId: '1',
    userId: 'admin-001',
    newsType: 'trend',
    title: 'Xu hướng AI trong tuyển dụng 2025: Cách chuẩn bị cho tương lai',
    content:
      'Trí tuệ nhân tạo đang thay đổi cách thức tuyển dụng. Các công ty hiện đang sử dụng AI để sàng lọc CV, phân tích video phỏng vấn và đánh giá kỹ năng ứng viên. Bài viết này sẽ hướng dẫn bạn cách chuẩn bị để thành công trong môi trường tuyển dụng mới này.',
    createdAt: new Date('2025-01-15'),
  },
  {
    newsId: '2',
    userId: 'recruiter-002',
    newsType: 'trend',
    title: 'Remote Work vs Hybrid: Xu hướng làm việc mới của thế hệ Z',
    content:
      'Thế hệ Z đang định hình lại thị trường lao động với những yêu cầu mới về linh hoạt trong công việc. Tìm hiểu các xu hướng làm việc từ xa và hybrid đang được ưa chuộng nhất hiện nay.',
    createdAt: new Date('2025-01-14'),
  },
  {
    newsId: '3',
    userId: 'user-003',
    newsType: 'trend',
    title: 'Kỹ năng mềm được ưu tiên nhất trong tuyển dụng IT 2025',
    content:
      'Không chỉ kỹ năng kỹ thuật, các nhà tuyển dụng IT hiện đặc biệt chú trọng đến kỹ năng mềm. Communication, teamwork, và problem-solving đang trở thành những yếu tố quyết định trong quá trình tuyển dụng.',
    createdAt: new Date('2025-01-13'),
  },
  {
    newsId: '4',
    userId: 'admin-001',
    newsType: 'trend',
    title: 'Blockchain và Web3: Cơ hội việc làm mới cho lập trình viên',
    content:
      'Công nghệ blockchain và Web3 đang tạo ra những cơ hội việc làm mới với mức lương hấp dẫn. Tìm hiểu các vị trí hot nhất và kỹ năng cần thiết để gia nhập lĩnh vực này.',
    createdAt: new Date('2025-01-12'),
  },
  {
    newsId: '5',
    userId: 'recruiter-004',
    newsType: 'trend',
    title: 'Green Tech: Xu hướng tuyển dụng trong lĩnh vực công nghệ xanh',
    content:
      'Với sự quan tâm ngày càng tăng về môi trường, các công ty công nghệ xanh đang mở rộng quy mô và tuyển dụng mạnh mẽ. Đây là cơ hội tuyệt vời cho những ai muốn kết hợp passion với career.',
    createdAt: new Date('2025-01-11'),
  },
  {
    newsId: '6',
    userId: 'user-005',
    newsType: 'trend',
    title:
      'Salary Transparency: Xu hướng minh bạch lương bổng trong tuyển dụng',
    content:
      'Ngày càng nhiều công ty áp dụng chính sách minh bạch về lương bổng ngay từ job posting. Tìm hiểu tác động của xu hướng này đến thị trường lao động và cách ứng viên có thể tận dụng.',
    createdAt: new Date('2025-01-10'),
  },
];

export const TrendNews: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<News[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Simulate data loading
  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // CHỈ LẤY TIN TỨC CÓ NEWSTYPE LÀ 'TREND'
      const trendNewsOnly = mockTrendNews.filter(
        (newsItem) => newsItem.newsType === 'trend'
      );
      setNews(trendNewsOnly);
      setLoading(false);
    };

    loadNews();
  }, []);

  // Filter and sort news - CHỈ XỬ LÝ TIN TỨC XU HƯỚNG
  const filteredAndSortedNews = useMemo(() => {
    const filtered = news.filter((newsItem) => {
      // CHỈ LẤY TIN TỨC CÓ NEWSTYPE LÀ 'TREND'
      const isTrendNews = newsItem.newsType === 'trend';

      // Filter by search term
      const matchesSearch =
        newsItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        newsItem.content.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by author type (based on userId pattern)
      let matchesAuthor = true;
      if (authorFilter) {
        if (authorFilter === 'admin') {
          matchesAuthor = newsItem.userId.startsWith('admin');
        } else if (authorFilter === 'recruiter') {
          matchesAuthor = newsItem.userId.startsWith('recruiter');
        } else if (authorFilter === 'user') {
          matchesAuthor = newsItem.userId.startsWith('user');
        }
      }

      return isTrendNews && matchesSearch && matchesAuthor;
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
    // Navigate to news detail page
    navigate(`/trend-news-detail/${newsItem.newsId}`);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header Section */}
      <TrendNewsHeader newsCount={news.length} />

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
          loading={loading}
          onNewsClick={handleNewsClick}
        />
      </div>

      {/* Call to Action Section */}
      {!loading && filteredAndSortedNews.length > 0 && (
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
