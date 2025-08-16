import React from 'react';

interface QuizItem {
  icon: string;
  title: string;
  questions: string;
}

const quizData: QuizItem[] = [
  {
    icon: 'https://picsum.photos/40/40?random=1',
    title: 'C++',
    questions: '1,342 câu hỏi',
  },
  {
    icon: 'https://picsum.photos/40/40?random=2',
    title: 'Python',
    questions: '1,205 câu hỏi',
  },
  {
    icon: 'https://picsum.photos/40/40?random=3',
    title: 'C#',
    questions: '51 câu hỏi',
  },
  {
    icon: 'https://picsum.photos/40/40?random=4',
    title: 'Cấu trúc dữ liệu',
    questions: '233 câu hỏi',
  },
  {
    icon: 'https://picsum.photos/40/40?random=5',
    title: 'Toán tư',
    questions: '233 câu hỏi',
  },
  {
    icon: 'https://picsum.photos/40/40?random=6',
    title: 'Biến cái và đệ đi lặp',
    questions: '788 câu hỏi',
  },
  {
    icon: 'https://picsum.photos/40/40?random=7',
    title: 'Vong lặp',
    questions: '562 câu hỏi',
  },
  {
    icon: 'https://picsum.photos/40/40?random=8',
    title: 'Mảng',
    questions: '517 câu hỏi',
  },
  {
    icon: 'https://picsum.photos/40/40?random=9',
    title: 'Function',
    questions: '779 câu hỏi',
  },
];

const RandomQuiz: React.FC = () => {
  return (
    <div className="bg-white section-padding animate-fade-in">
      <div className="container-center">
        <div className="max-w-7xl mx-auto text-center">
          {/* Professional heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trắc nghiệm{' '}
            <span className="text-gradient-primary">ngẫu nhiên</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
            Đề thi được tạo ngẫu nhiên từ kho bài tập theo danh mục bạn lựa chọn
          </p>

          {/* Quiz categories grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizData.map((item, index) => (
              <div
                key={item.title}
                className="card-interactive p-6 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.icon}
                      alt={item.title}
                      className="w-12 h-12 rounded-lg object-cover shadow-sm"
                    />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-sky-600 font-medium">
                        {item.questions}
                      </p>
                    </div>
                  </div>
                  <button className="btn-outline btn-sm">Bắt đầu</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RandomQuiz;
