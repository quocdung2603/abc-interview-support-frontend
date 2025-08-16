interface TrendNewsHeaderProps {
  newsCount: number;
}

export const TrendNewsHeader = ({ newsCount }: TrendNewsHeaderProps) => {
  return (
    <div className="news-header">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern-primary opacity-10"></div>

      <div className="relative container-center">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Title */}
          <h1 className="text-display text-white mb-6 animate-fade-in-up">
            Tin Tức Xu Hướng
          </h1>

          {/* Subtitle */}
          <p className="text-heading-3 text-white-90 mb-6 leading-relaxed animate-fade-in-up">
            Cập nhật những xu hướng mới nhất trong thế giới công nghệ và tuyển
            dụng
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 animate-fade-in-up">
            <div className="stats-card-accent">
              <div className="text-center">
                <div className="text-heading-2 text-white font-bold mb-2">
                  {newsCount}
                </div>
                <div className="text-caption text-white-80 font-medium uppercase tracking-wide">
                  Bài viết xu hướng
                </div>
              </div>
            </div>

            <div className="stats-card-accent">
              <div className="text-center">
                <div className="text-heading-2 text-white font-bold mb-2">
                  24/7
                </div>
                <div className="text-caption text-white-80 font-medium uppercase tracking-wide">
                  Cập nhật liên tục
                </div>
              </div>
            </div>

            <div className="stats-card-accent">
              <div className="text-center">
                <div className="text-heading-2 text-white font-bold mb-2">
                  100%
                </div>
                <div className="text-caption text-white-80 font-medium uppercase tracking-wide">
                  Không tốn chi phí
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <div className="icon-container-light">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="font-medium text-white-90">
                Thông tin chính xác
              </span>
            </div>

            <div className="flex items-center justify-center md:justify-start space-x-3">
              <div className="icon-container-light">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L10 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="font-medium text-white-90">
                Cập nhật nhanh chóng
              </span>
            </div>

            <div className="flex items-center justify-center md:justify-start space-x-3">
              <div className="icon-container-light">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="font-medium text-white-90">Đa dạng chủ đề</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white-5 rounded-full animate-gentle-float"></div>
      <div
        className="absolute bottom-10 right-10 w-16 h-16 bg-white-5 rounded-full animate-gentle-float"
        style={{ animationDelay: '2s' }}
      ></div>
      <div
        className="absolute top-1/2 left-20 w-12 h-12 bg-white-5 rounded-full animate-gentle-float"
        style={{ animationDelay: '4s' }}
      ></div>
    </div>
  );
};
