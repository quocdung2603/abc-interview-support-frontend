import React from 'react';

const ChallengeBanner: React.FC = () => {
  return (
    <div className="bg-section-alternate section-padding overflow-hidden animate-fade-in">
      {/* Professional decorative elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100 rounded-full opacity-50 animate-pulse-soft"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-sky-100 rounded-full opacity-40 animate-gentle-float"></div>
        <div
          className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-50 rounded-full opacity-60 animate-pulse-soft"
          style={{ animationDelay: '1s' }}
        ></div>
      </div>

      {/* Content */}
      <div className="container-center relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-6 animate-fade-in-up">
            Bắt đầu thử thách với trắc nghiệm từ{' '}
            <span className="text-gradient-primary">ABCQuiz!</span>
          </h1>

          <div className="space-y-4 mb-10 animate-slide-in-left">
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
              Khởi động một chuỗi ngày luyện tập, bằng việc chọn đề phù hợp nhất
              với bạn hay chọn ngẫu nhiên để khám phá các ngành học lập trình,
              khoa học, sư phạm, kinh tế.
            </p>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Đừng quên, với mỗi bài học bạn sẽ được giải thích chi tiết và tùy
              từng lý do để chọn ra đáp án chính xác nhất.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-6 animate-slide-in-right">
            <button className="btn-secondary px-8 py-4 text-lg font-semibold">
              📚 THI THEO ĐỀ
            </button>
            <button className="btn-accent px-8 py-4 text-lg font-semibold">
              🎲 THI NGẪU NHIÊN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeBanner;
