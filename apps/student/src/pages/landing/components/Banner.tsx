import React from 'react';

const Banner: React.FC = () => {
  return (
    <div className="banner-hero py-8 md:py-12 animate-fade-in overflow-hidden">
      {/* Professional overlay */}
      <div className="absolute inset-0 banner-overlay"></div>

      <div className="container-center relative z-10">
        <div className="hero-grid">
          {/* Left side: Title, description, search bar */}
          <div className="hero-content text-white animate-slide-in-left">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight mb-4">
              Rèn luyện hơn <span className="text-emphasis">5,423+</span> câu
              trắc nghiệm dành riêng cho bạn
            </h1>

            <p className="text-base md:text-lg text-blue-100 max-w-2xl leading-relaxed mb-6">
              Ngân hàng đề thi trắc nghiệm đa dạng, dành riêng cho các ngành học
              lập trình, khoa học, sư phạm, kinh tế. Cùng ABC Quiz: Luyện tập -
              Thi thử - Kiểm tra nguồn kiến thức!
            </p>

            {/* Professional search bar */}
            <div className="search-container p-3 max-w-4xl">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  className="input-field flex-grow"
                  placeholder="Tìm đề, chủ đề..."
                />

                <div className="flex-shrink-0 w-full sm:w-40">
                  <select className="select-field">
                    <option value="">Chọn danh mục</option>
                    <option value="cntt">Công nghệ thông tin</option>
                    <option value="kinh-te">Kinh tế</option>
                    <option value="su-pham">Sư phạm</option>
                  </select>
                </div>

                <button className="btn-accent whitespace-nowrap px-4">
                  Tìm kiếm
                </button>
              </div>
            </div>
          </div>

          {/* Right side: Professional image layout */}
          <div className="hero-images animate-slide-in-right">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Main image */}
              <div className="card-elevated absolute top-0 right-6 md:right-12 z-10 w-36 md:w-44 h-44 md:h-52 animate-gentle-float overflow-hidden">
                <img
                  src="https://picsum.photos/300/350"
                  alt="Hình ảnh học tập"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Secondary image 1 */}
              <div
                className="card-elevated absolute top-20 md:top-24 right-20 md:right-32 z-20 w-24 md:w-32 h-32 md:h-40 animate-gentle-float overflow-hidden"
                style={{ animationDelay: '1s' }}
              >
                <img
                  src="https://picsum.photos/200/250"
                  alt="Hình ảnh học tập 2"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Secondary image 2 */}
              <div
                className="card-elevated absolute top-12 md:top-16 right-0 z-30 w-20 md:w-28 h-28 md:h-36 animate-gentle-float overflow-hidden"
                style={{ animationDelay: '0.5s' }}
              >
                <img
                  src="https://picsum.photos/180/220"
                  alt="Hình ảnh học tập 3"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Professional statistics indicators */}
              <div className="stats-card-accent absolute top-32 md:top-40 right-0 z-40 text-xs md:text-sm font-semibold animate-pulse-soft">
                🎉 Hoàn thành! Được 150/50 câu
              </div>

              <div className="stats-card absolute -bottom-1 md:-bottom-2 right-1/2 transform translate-x-1/2 z-40 text-xs md:text-sm font-medium text-gray-700 animate-fade-in-up">
                📊 66% tham gia giải đề này
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
