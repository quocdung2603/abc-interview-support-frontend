import React from 'react';

interface NewsItem {
  image: string;
  title: string;
  description: string;
  date: string;
  comments: string;
}

const newsData: NewsItem[] = [
  {
    image: 'https://picsum.photos/300/200?random=1',
    title: 'Giới thiệu đề 500 câu hỏi Python siêu bịch để 500 câu trắc',
    description:
      'Rèn luyện kiến thức Python siêu bịch để 500 câu trắc nghiệm khó ở Quiz; Đề 500 câu hỏi Python được chọn lọc, DE 500 câu hỏi Python với mục tiêu...',
    date: '06/02/2022',
    comments: '0 bình luận',
  },
  {
    image: 'https://picsum.photos/300/200?random=2',
    title: 'Giới thiệu đề 500 Câu H C++ cực hay',
    description:
      'Trải nghiệm kiến thức 500 Câu H C++ cực hay 500 câu hỏi Quiz cho học sinh, sinh viên để rèn luyện kỹ năng; Đề 500 câu H C++ chọn lọc DE 500 câu với mục tiêu...',
    date: '06/02/2022',
    comments: '0 bình luận',
  },
  {
    image: 'https://picsum.photos/300/200?random=3',
    title: 'Bật mí những điều bạn cần biết khi tham gia rèn luyện Quiz',
    description:
      'Howkteam hướng dẫn kỹ năng tham gia rèn luyện Quiz website Howkteam; Khi bạn biết đúng năng lực bạn cần biết để tham gia rèn luyện bạn cần chú ý...',
    date: '08/02/2021',
    comments: '4 bình luận',
  },
];

const NewsSection: React.FC = () => {
  return (
    <div className="section-alternate section-padding animate-fade-in">
      <div className="container-center">
        <div className="max-w-7xl mx-auto text-center">
          {/* Professional heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tin tức <span className="text-gradient-primary">thú vị</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
            Thông tin chia sẻ, hướng dẫn các bạn sinh viên ở Quiz để bạn rèn
            luyện thực tế
          </p>

          {/* News grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsData.map((item, index) => (
              <div
                key={item.title}
                className="card-elevated overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="badge-primary text-xs">{item.date}</span>
                    <span className="text-sky-600 text-xs font-medium">
                      {item.comments}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to action */}
          <div className="mt-12">
            <button className="btn-secondary">Xem thêm tin tức</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsSection;
