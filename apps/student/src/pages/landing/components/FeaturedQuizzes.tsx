import React from 'react';

interface QuizItem {
  questions: string;
  icon: string;
  title: string;
  tags: string[];
}

const quizData: QuizItem[] = [
  {
    questions: '20 câu hỏi',
    icon: 'https://picsum.photos/40/40?random=1',
    title:
      '20 Bài Tập Kiểm Tra, Rèn Luyện JavaScript Phần 4 (Câu hỏi và hướng dẫn chi tiết)',
    tags: ['JavaScript', '340 người tham gia'],
  },
  {
    questions: '20 câu hỏi',
    icon: 'https://picsum.photos/40/40?random=2',
    title: '20 Bài Tập Về ES6 Và JavaScript Hiện Đại Phần 2',
    tags: ['JavaScript', '108 người tham gia'],
  },
  {
    questions: '20 câu hỏi',
    icon: 'https://picsum.photos/40/40?random=3',
    title: '20 Bài Tập Về DOM Trong JavaScript JS-DOM',
    tags: ['JavaScript', '30 người tham gia'],
  },
  {
    questions: '500 câu hỏi',
    icon: 'https://picsum.photos/40/40?random=4',
    title: 'Đề trắc nghiệm 500 Câu python thực hành',
    tags: ['Python', 'P T L T'],
  },
  {
    questions: '500 câu hỏi',
    icon: 'https://picsum.photos/40/40?random=5',
    title: 'Đề trắc nghiệm 500 Câu C++ thực hành',
    tags: ['C++', 'D T h a205'],
  },
  {
    questions: '20 câu hỏi',
    icon: 'https://picsum.photos/40/40?random=6',
    title: '20 Bài Tập Về ES6 Và JavaScript Hiện Đại',
    tags: ['JavaScript', 'n M Q aB2'],
  },
];

const FeaturedQuizzes: React.FC = () => {
  return (
    <div className="bg-white py-12 md:py-16 animate-fade-in">
      <div className="container-center text-center">
        {/* Professional heading */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          Đề thi <span className="text-gradient-primary">nổi bật</span>
        </h2>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Những đề thi nổi bật nhận được nhiều sự quan tâm từ cộng đồng học tập
        </p>

        {/* Quiz cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizData.map((item, index) => (
            <div
              key={`quiz-${index}-${item.title.slice(0, 10)}`}
              className="card-interactive p-4 flex flex-col items-center gap-3 animate-fade-in-up group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Question count badge */}
              <span className="badge-primary">{item.questions}</span>

              {/* Icon */}
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title */}
              <h3 className="text-base font-semibold text-gray-900 text-center line-clamp-2 group-hover:text-blue-600 transition-colors">
                {item.title}
              </h3>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 justify-center">
                {item.tags.map((tag, tagIndex) => (
                  <span
                    key={`tag-${index}-${tagIndex}-${tag}`}
                    className="badge-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action button */}
              <button className="btn-primary mt-2 text-sm px-4 py-2">
                Thi ngay →
              </button>
            </div>
          ))}
        </div>

        {/* View more button */}
        <div className="mt-8">
          <button className="btn-accent px-6 py-3 text-base">
            Xem thêm đề thi
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedQuizzes;
