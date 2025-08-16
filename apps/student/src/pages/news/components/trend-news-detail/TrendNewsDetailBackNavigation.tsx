import React from 'react';
import { useNavigate } from 'react-router-dom';

export const TrendNewsDetailBackNavigation: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToTrendNews = () => {
    navigate('/trend-news');
  };

  const handleBackToPrevious = () => {
    navigate(-1);
  };

  return (
    <div className="border-b border-neutral-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="container-center">
        <div className="py-4">
          <div className="flex items-center justify-between">
            {/* Back Navigation */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToPrevious}
                className="flex items-center space-x-2 text-neutral-600 hover:text-accent transition-colors group"
                type="button"
              >
                <div className="w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-accent-10 flex items-center justify-center transition-colors">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </div>
                <span className="text-body font-medium">Trở lại</span>
              </button>

              <div className="h-6 w-px bg-neutral-300"></div>

              <button
                onClick={handleBackToTrendNews}
                className="flex items-center space-x-2 text-neutral-600 hover:text-accent transition-colors"
                type="button"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
                <span className="text-body">Tin tức xu hướng</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                className="flex items-center space-x-2 text-neutral-600 hover:text-red-500 transition-colors"
                type="button"
                title="Yêu thích bài viết"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span className="hidden sm:inline text-caption">Yêu thích</span>
              </button>

              <button
                className="flex items-center space-x-2 text-neutral-600 hover:text-accent transition-colors"
                type="button"
                title="Chia sẻ bài viết"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </svg>
                <span className="hidden sm:inline text-caption">Chia sẻ</span>
              </button>

              <button
                className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-800 transition-colors"
                type="button"
                title="Lưu bài viết"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                <span className="hidden sm:inline text-caption">Lưu</span>
              </button>

              <div className="h-6 w-px bg-neutral-300"></div>

              <button
                className="flex items-center space-x-1 text-neutral-600 hover:text-neutral-800 transition-colors"
                type="button"
                title="Thêm tùy chọn"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
