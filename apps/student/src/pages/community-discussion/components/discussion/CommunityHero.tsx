import React from 'react';
import { MessageOutlined } from '@ant-design/icons';

interface CommunityHeroProps {
  totalQuestions?: number;
  activeParticipants?: number;
}

const CommunityHero: React.FC<CommunityHeroProps> = ({
  totalQuestions = 0,
  activeParticipants = 0,
}) => {
  return (
    <div className="news-header animate-fade-in">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern-primary opacity-10"></div>

      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-24 h-24 bg-white-10 rounded-full animate-gentle-float"></div>
      <div
        className="absolute bottom-10 left-10 w-16 h-16 bg-accent-10 rounded-full animate-gentle-float"
        style={{ animationDelay: '2s' }}
      ></div>

      <div className="relative container-center">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-display text-white mb-4 animate-fade-in-up">
            Câu hỏi <span className="text-accent">phỏng vấn</span>
          </h1>
          <p className="text-body-large text-white-90 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
            Tham gia trả lời các câu hỏi phỏng vấn được đặt ra bởi admin. Chia
            Chia sẻ kinh nghiệm, đánh giá câu trả lời và học hỏi từ cộng đồng.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 mb-6 animate-fade-in-up">
            <div className="stats-card-accent text-center">
              <div className="text-heading-2 text-white font-bold mb-2">
                {totalQuestions}
              </div>
              <div className="text-caption text-white-80">Câu hỏi</div>
            </div>
            <div className="w-px h-12 bg-white-20"></div>
            <div className="stats-card-accent text-center">
              <div className="text-heading-2 text-white font-bold mb-2">
                {activeParticipants}
              </div>
              <div className="text-caption text-white-80">Người tham gia</div>
            </div>
          </div>

          <div className="badge-white-outline animate-fade-in-up">
            <MessageOutlined className="mr-2" />
            Chỉ admin mới có thể đặt câu hỏi mới
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityHero;
