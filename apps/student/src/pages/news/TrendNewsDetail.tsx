import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TrendNewsDetailHeader } from './components/trend-news-detail/TrendNewsDetailHeader';
import { TrendNewsDetailContent } from './components/trend-news-detail/TrendNewsDetailContent';
import { TrendNewsDetailComments } from './components/trend-news-detail/TrendNewsDetailComments';
import { TrendNewsDetailRelated } from './components/trend-news-detail/TrendNewsDetailRelated';
import { TrendNewsDetailBackNavigation } from './components/trend-news-detail/TrendNewsDetailBackNavigation';
import { News } from '@abc-interview-support-frontend/types';

/**
 * TRANG CHI TIẾT TIN TỨC XU HƯỚNG
 *
 * Component này hiển thị chi tiết một bài viết tin tức xu hướng với đầy đủ tính năng:
 * - Header với thông tin tác giả, ngày đăng, các action
 * - Nội dung bài viết với sidebar thông tin bổ sung
 * - Hệ thống bình luận
 * - Các bài viết liên quan
 * - Navigation trở lại
 *
 * URL: /trend-news-detail/:newsId
 */

// Mock data - Trong thực tế sẽ fetch từ API dựa trên newsId
const mockTrendNewsDetail: Record<string, News> = {
  '1': {
    newsId: '1',
    userId: 'admin-001',
    newsType: 'trend',
    title: 'Xu hướng AI trong tuyển dụng 2025: Cách chuẩn bị cho tương lai',
    content: `Trí tuệ nhân tạo đang thay đổi cách thức tuyển dụng từ cơ bản. Các công ty hiện đang sử dụng AI để sàng lọc CV, phân tích video phỏng vấn và đánh giá kỹ năng ứng viên một cách tự động và chính xác hơn bao giờ hết.

Trong năm 2025, chúng ta dự kiến sẽ thấy sự gia tăng mạnh mẽ trong việc áp dụng các công cụ AI tiên tiến. Các hệ thống này không chỉ giúp HR tiết kiệm thời gian mà còn đảm bảo quá trình tuyển dụng công bằng và hiệu quả hơn.

Để thành công trong môi trường tuyển dụng mới này, ứng viên cần hiểu rõ cách AI hoạt động và điều chỉnh hồ sơ của mình cho phù hợp. Điều này bao gồm việc tối ưu hóa CV với các từ khóa quan trọng, chuẩn bị cho các cuộc phỏng vấn video có thể được phân tích bởi AI, và phát triển những kỹ năng mà AI không thể thay thế được.

Những kỹ năng quan trọng nhất mà ứng viên nên tập trung phát triển bao gồm: tư duy phản biện, sáng tạo, kỹ năng giao tiếp interpersonal, và khả năng thích ứng với thay đổi. Đây là những lĩnh vực mà con người vẫn có lợi thế so với máy móc.

Cuối cùng, điều quan trọng nhất là duy trì thái độ học hỏi liên tục. Công nghệ AI sẽ tiếp tục phát triển và thay đổi, và những ai có thể thích ứng và học hỏi nhanh chóng sẽ là những người thành công nhất trong tương lai.`,
    createdAt: new Date('2025-01-15T10:30:00'),
  },
  '2': {
    newsId: '2',
    userId: 'recruiter-002',
    newsType: 'trend',
    title: 'Remote Work vs Hybrid: Xu hướng làm việc mới của thế hệ Z',
    content: `Thế hệ Z đang định hình lại thị trường lao động với những yêu cầu mới về linh hoạt trong công việc. Khác với các thế hệ trước, Gen Z coi trọng sự cân bằng work-life balance và mong muốn có nhiều lựa chọn về môi trường làm việc.

Nghiên cứu gần đây cho thấy 74% thế hệ Z muốn có tùy chọn làm việc từ xa ít nhất 2-3 ngày trong tuần. Họ không chỉ coi đây là một phúc lợi mà là một yêu cầu cơ bản khi lựa chọn nơi làm việc.

Các công ty đang phải thích ứng với xu hướng này bằng cách triển khai các mô hình làm việc hybrid. Mô hình này cho phép nhân viên kết hợp giữa làm việc tại văn phòng và từ xa, tạo ra sự linh hoạt mà thế hệ mới đang tìm kiếm.

Tuy nhiên, việc quản lý nhân sự trong môi trường hybrid cũng đặt ra những thách thức mới. Các nhà quản lý cần học cách duy trì năng suất, văn hóa công ty và sự gắn kết của đội nhóm khi một phần nhân viên làm việc từ xa.

Để thành công trong môi trường làm việc mới này, các công ty cần đầu tư vào công nghệ, đào tạo quản lý và xây dựng các chính sách rõ ràng về làm việc hybrid.`,
    createdAt: new Date('2025-01-14T14:20:00'),
  },
  '3': {
    newsId: '3',
    userId: 'user-003',
    newsType: 'trend',
    title: 'Kỹ năng mềm được ưu tiên nhất trong tuyển dụng IT 2025',
    content: `Không chỉ kỹ năng kỹ thuật, các nhà tuyển dụng IT hiện đặc biệt chú trọng đến kỹ năng mềm. Communication, teamwork, và problem-solving đang trở thành những yếu tố quyết định trong quá trình tuyển dụng.

Trong thế giới công nghệ ngày càng phức tạp, khả năng làm việc nhóm hiệu quả trở nên cực kỳ quan trọng. Các dự án phần mềm hiện đại thường đòi hỏi sự hợp tác giữa nhiều team khác nhau, từ developers, designers, product managers đến business analysts.

Kỹ năng giao tiếp cũng được đánh giá cao hơn bao giờ hết. Developers không chỉ cần viết code tốt mà còn phải có thể giải thích các giải pháp kỹ thuật cho các stakeholder không chuyên về IT.

Problem-solving và tư duy phản biện là những kỹ năng không thể thiếu. Trong môi trường công nghệ thay đổi nhanh chóng, khả năng phân tích vấn đề và tìm ra giải pháp sáng tạo là điều mà các nhà tuyển dụng tìm kiếm.

Cuối cùng, khả năng học hỏi và thích ứng với công nghệ mới cũng là một yếu tố quan trọng. Ngành IT luôn có những công nghệ mới xuất hiện, và những người có thể nhanh chóng nắm bắt và áp dụng chúng sẽ có lợi thế cạnh tranh.`,
    createdAt: new Date('2025-01-13T09:15:00'),
  },
};

const TrendNewsDetail: React.FC = () => {
  const { newsId } = useParams<{ newsId: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulate API call to fetch news detail
  useEffect(() => {
    // Luôn sử dụng bài viết đầu tiên làm mock data để test giao diện
    const mockNews = mockTrendNewsDetail['1'];
    setNews(mockNews);
    setLoading(false);
  }, [newsId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        {/* Loading Header */}
        <div className="news-header">
          <div className="absolute inset-0 bg-pattern-primary opacity-10"></div>
          <div className="relative container-center">
            <div className="max-w-4xl mx-auto animate-pulse">
              <div className="h-8 bg-white-20 rounded-md mb-6 w-48"></div>
              <div className="h-12 bg-white-20 rounded-md mb-4"></div>
              <div className="h-12 bg-white-20 rounded-md mb-8 w-3/4"></div>
              <div className="flex space-x-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white-20 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-white-20 rounded w-24"></div>
                    <div className="h-3 bg-white-20 rounded w-16"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Content */}
        <div className="container-center section-padding">
          <div className="max-w-4xl mx-auto">
            <div className="card-elevated p-8 animate-pulse">
              <div className="space-y-4">
                <div className="h-4 bg-neutral-200 rounded w-full"></div>
                <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
                <div className="h-4 bg-neutral-200 rounded w-4/6"></div>
                <div className="h-4 bg-neutral-200 rounded w-full"></div>
                <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Nếu chưa có data (không bao giờ xảy ra với mock data, nhưng giữ lại cho an toàn)
  if (!news) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Sticky Navigation */}
      <TrendNewsDetailBackNavigation />

      {/* Article Header */}
      <TrendNewsDetailHeader news={news} />

      {/* Article Content */}
      <TrendNewsDetailContent news={news} />

      {/* Comments Section */}
      <TrendNewsDetailComments newsId={news.newsId} />

      {/* Related Articles */}
      <TrendNewsDetailRelated currentNewsId={news.newsId} />
    </div>
  );
};

export default TrendNewsDetail;
