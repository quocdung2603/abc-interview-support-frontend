import React from 'react';
import { CheckCircleOutlined } from '@ant-design/icons';

const PracticeWithFriends: React.FC = () => {
  return (
    <div className="bg-white section-padding animate-fade-in">
      <div className="container-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Image illustration */}
          <div className="md:w-1/2 mb-8 md:mb-0 animate-fade-in-up">
            <div className="card-elevated overflow-hidden">
              <img
                src="https://picsum.photos/600/400?random=10"
                alt="Nhóm bạn học tập"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Content */}
          <div className="md:w-1/2 md:pl-8 flex flex-col gap-8 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Luyện tập cùng{' '}
              <span className="text-gradient-primary">bạn bè</span> qua các bài
              tập trắc nghiệm hữu ích
            </h2>
            <p className="text-lg text-gray-600">
              Với mỗi cuộc đua, bạn hoàn toàn có thể tham gia một đề thi ngẫu
              nhiên từ Quiz, thử thách bạn bè với các đề thi để kiểm tra. Bạn
              còn chờ gì mà không bắt đầu ngay!
            </p>

            {/* Benefits list */}
            <ul className="space-y-4">
              <li className="flex items-start">
                <CheckCircleOutlined className="text-sky-600 text-2xl mr-3 mt-1" />
                <span className="text-gray-700 text-base font-medium">
                  Ngân hàng câu hỏi trắc nghiệm lập trình đồ sộ
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircleOutlined className="text-sky-600 text-2xl mr-3 mt-1" />
                <span className="text-gray-700 text-base font-medium">
                  Tham gia thi và nhận kết quả ngay sau khi nộp bài
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircleOutlined className="text-sky-600 text-2xl mr-3 mt-1" />
                <span className="text-gray-700 text-base font-medium">
                  Giải thích đáp án với mỗi lựa chọn, giúp bạn hiểu sâu hơn
                </span>
              </li>
            </ul>

            {/* Call to action */}
            <button className="btn-primary">Thử ngay</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeWithFriends;
