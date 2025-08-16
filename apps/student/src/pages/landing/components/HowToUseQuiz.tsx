import React from 'react';
import {
  UserAddOutlined,
  SearchOutlined,
  TrophyOutlined,
} from '@ant-design/icons';

const HowToUseQuiz: React.FC = () => {
  return (
    <div className="bg-white section-padding animate-fade-in">
      <div className="container-center">
        <div className="max-w-4xl mx-auto text-center">
          {/* Professional heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Cách sử dụng <span className="text-gradient-primary">Quiz</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
            Nếu đây là lần đầu truy cập, đừng bối rối! ABCquiz cực kỳ đơn giản
            và dễ sử dụng chỉ với vài thao tác
          </p>

          {/* Steps grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="card-elevated p-8 text-center animate-fade-in-up">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserAddOutlined className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Tạo tài khoản & Đăng nhập
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Bạn có thể tạo riêng cho mình một tài khoản mới, hoặc liên kết
                tài khoản Google để tham gia tại Howkteam.com
              </p>
            </div>

            {/* Step 2 */}
            <div
              className="card-elevated p-8 text-center animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <SearchOutlined className="text-sky-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Tìm kiếm đề / Thi nhanh
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Quiz cung cấp cho bạn một ngân hàng đề trắc nghiệm đồ sộ mà bạn
                có thể nhanh chóng thử sức với bất kỳ đề nào hứng thú
              </p>
            </div>

            {/* Step 3 */}
            <div
              className="card-elevated p-8 text-center animate-fade-in-up"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrophyOutlined className="text-emerald-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Thử thách bạn bè
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Thử sức cùng bạn bè, cộng đồng là cách cực kỳ hữu hiệu để nâng
                cao skills của bạn ngay hôm nay.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToUseQuiz;
