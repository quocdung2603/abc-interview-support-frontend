import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RecruitmentNewsDetailLoading } from './components/recruitment-news-detail/RecruitmentNewsDetailLoading';
import { RecruitmentNewsDetailNotFound } from './components/recruitment-news-detail/RecruitmentNewsDetailNotFound';
import { RecruitmentNewsDetailHeader } from './components/recruitment-news-detail/RecruitmentNewsDetailHeader';
import { RecruitmentNewsDetailContent } from './components/recruitment-news-detail/RecruitmentNewsDetailContent';
import { RecruitmentNewsDetailSidebar } from './components/recruitment-news-detail/RecruitmentNewsDetailSidebar';
import { News } from '@abc-interview-support-frontend/types';

/**
 * TRANG CHI TIẾT TIN TỨC TUYỂN DỤNG
 *
 * Component này CHỈ XỬ LÝ TIN TỨC CÓ newsType = 'recruitment'
 *
 * Features:
 * - Hiển thị chi tiết tin tức tuyển dụng
 * - Thông tin công ty và vị trí tuyển dụng
 * - Thông tin ứng tuyển và liên hệ
 * - Navigation về trang danh sách
 *
 * Mock data được sử dụng cho mục đích test giao diện
 */

// Mock data chi tiết cho tin tức tuyển dụng
const mockRecruitmentNewsDetail: News = {
  newsId: 'r1',
  userId: 'recruiter-001',
  newsType: 'recruitment',
  title: 'Tuyển Senior Frontend Developer - React/Next.js',
  content: `
<div class="job-posting">
  <div class="company-info">
    <h3>Về Công Ty</h3>
    <p><strong>TechViet Solutions</strong> là công ty fintech hàng đầu Việt Nam, chuyên phát triển giải pháp thanh toán số cho doanh nghiệp. Với hơn 500 nhân viên và đang mở rộng nhanh chóng, chúng tôi cần những talent tài năng để cùng xây dựng tương lai của fintech Việt Nam.</p>
  </div>

  <div class="job-description">
    <h3>Mô Tả Công Việc</h3>
    <ul>
      <li>Phát triển và maintain các web application sử dụng React, Next.js, TypeScript</li>
      <li>Làm việc với team Backend để integrate API và optimize performance</li>
      <li>Implement responsive design và đảm bảo cross-browser compatibility</li>
      <li>Code review và mentor các junior developer</li>
      <li>Tham gia vào việc thiết kế architecture cho các feature mới</li>
      <li>Optimize application performance và user experience</li>
    </ul>
  </div>

  <div class="job-requirements">
    <h3>Yêu Cầu Ứng Viên</h3>
    <h4>Bắt buộc:</h4>
    <ul>
      <li>3+ năm kinh nghiệm phát triển Frontend với React</li>
      <li>Thành thạo TypeScript, JavaScript ES6+</li>
      <li>Có kinh nghiệm với Next.js, SSR/SSG</li>
      <li>Hiểu biết về state management (Redux, Zustand, Context API)</li>
      <li>Kinh nghiệm với CSS frameworks (Tailwind CSS, Styled Components)</li>
      <li>Biết sử dụng Git, CI/CD basics</li>
    </ul>
    
    <h4>Ưu tiên:</h4>
    <ul>
      <li>Kinh nghiệm với microservices architecture</li>
      <li>Biết về testing (Jest, React Testing Library, Cypress)</li>
      <li>Có kinh nghiệm với fintech/banking domain</li>
      <li>Kiến thức về web security và performance optimization</li>
    </ul>
  </div>

  <div class="benefits">
    <h3>Quyền Lợi</h3>
    <ul>
      <li><strong>Lương:</strong> 25-40 triệu VND (tùy theo kinh nghiệm)</li>
      <li><strong>Bonus:</strong> 13th month salary + performance bonus</li>
      <li><strong>Bảo hiểm:</strong> Full social insurance + premium health insurance</li>
      <li><strong>Working mode:</strong> Hybrid (3 days office, 2 days WFH)</li>
      <li><strong>Nghỉ phép:</strong> 15 days/year + 5 days sick leave</li>
      <li><strong>Training:</strong> Budget 20 triệu/năm cho conferences và courses</li>
      <li><strong>Equipment:</strong> MacBook Pro M3 + monitor + accessories</li>
      <li><strong>Office:</strong> Modern office tại Landmark 81, free snacks</li>
    </ul>
  </div>

  <div class="work-environment">
    <h3>Môi Trường Làm Việc</h3>
    <p>Team Frontend có 8 người, làm việc theo Agile/Scrum. Văn hóa công ty tôn trọng work-life balance, khuyến khích innovation và personal growth. Regular team building, knowledge sharing sessions.</p>
  </div>

  <div class="how-to-apply">
    <h3>Cách Thức Ứng Tuyển</h3>
    <p>Gửi CV và portfolio qua email: <strong>recruitment@techviet.com</strong></p>
    <p>Hoặc apply trực tiếp qua LinkedIn: TechViet Solutions</p>
    <p><strong>Deadline:</strong> 28/02/2025</p>
    
    <h4>Quy trình phỏng vấn:</h4>
    <ol>
      <li>HR Interview (30 phút) - Cultural fit và motivation</li>
      <li>Technical Interview (1 giờ) - Coding test và system design</li>
      <li>Final Interview (45 phút) - Meet with team lead và PM</li>
    </ol>
  </div>
</div>
  `.trim(),
  createdAt: new Date('2025-01-15T08:30:00'),
};

export const RecruitmentNewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading và luôn load cùng một mock data để test giao diện
    const loadNews = async () => {
      setLoading(true);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // CHỈ XỬ LÝ TIN TỨC CÓ NEWSTYPE LÀ 'RECRUITMENT'
      // Trong thực tế sẽ fetch tin tức theo ID từ API và check newsType
      console.log('Loading recruitment news detail for ID:', id);
      setNews(mockRecruitmentNewsDetail);
      setLoading(false);
    };

    loadNews();
  }, [id]);

  // Loading state
  if (loading) {
    return <RecruitmentNewsDetailLoading />;
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
