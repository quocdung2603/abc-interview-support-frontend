interface RecruitmentNewsHeaderProps {
  newsCount: number;
}

export const RecruitmentNewsHeader = ({
  newsCount,
}: RecruitmentNewsHeaderProps) => {
  return (
    <div className="news-header">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern-primary opacity-10"></div>

      <div className="relative container-center">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Title */}
          <h1 className="text-display text-white mb-4 animate-fade-in-up">
            Tin Tức Tuyển Dụng
          </h1>

          {/* Subtitle */}
          <p className="text-heading-3 text-white-90 mb-4 leading-relaxed animate-fade-in-up">
            Khám phá những cơ hội việc làm mới nhất từ các công ty hàng đầu
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 animate-fade-in-up">
            <div className="stats-card-accent">
              <div className="text-center">
                <div className="text-heading-3 text-white font-bold mb-1">
                  {newsCount}
                </div>
                <div className="text-caption text-white-80 font-medium uppercase tracking-wide">
                  Cơ hội tuyển dụng
                </div>
              </div>
            </div>

            <div className="stats-card-accent">
              <div className="text-center">
                <div className="text-heading-3 text-white font-bold mb-1">
                  50+
                </div>
                <div className="text-caption text-white-80 font-medium uppercase tracking-wide">
                  Công ty đối tác
                </div>
              </div>
            </div>

            <div className="stats-card-accent">
              <div className="text-center">
                <div className="text-heading-3 text-white font-bold mb-1">
                  100%
                </div>
                <div className="text-caption text-white-80 font-medium uppercase tracking-wide">
                  Miễn phí ứng tuyển
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up">
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <div className="icon-container-light">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-white-90 font-medium">
                Việc làm chất lượng cao
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
                    d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-white-90 font-medium">
                Mức lương cạnh tranh
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
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-white-90 font-medium">
                Môi trường năng động
              </span>
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
