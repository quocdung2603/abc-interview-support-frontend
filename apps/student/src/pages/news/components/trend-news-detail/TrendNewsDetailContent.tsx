import React, { useState, useEffect } from 'react';
import { News, User } from '@abc-interview-support-frontend/types';
import { Tag, message } from 'antd';
import { questionService, newsService } from '@abc-interview-support-frontend/services';

interface TrendNewsDetailContentProps {
  news: News;
  author?: User | null;
}

export const TrendNewsDetailContent: React.FC<TrendNewsDetailContentProps> = ({
  news,
  author
}) => {
  const [fieldName, setFieldName] = useState<string>('Loading...');
  const [usefulVotes, setUsefulVotes] = useState<number>(news.usefulVote || 0);
  const [interestVotes, setInterestVotes] = useState<number>(news.interestVote || 0);
  const [isVoting, setIsVoting] = useState<boolean>(false);

  useEffect(() => {
    const fetchFieldName = async () => {
      try {
        const res = await questionService.getFieldById(news.fieldId || 1);
        setFieldName(res.name);
      } catch (error) {
        console.error('Error fetching field name:', error);
        setFieldName('Unknown Field');
      }
    };
    fetchFieldName();
  }, [news.fieldId]);

  // Parse content thành các đoạn văn
  const paragraphs = news.content.split('\n').filter((p) => p.trim() !== '');

  const getAuthorName = () => {
    if (author?.fullName) {
      return author.fullName;
    }
    return 'Unknown Author';
  };

  const getAuthorInitials = () => {
    if (author?.fullName) {
      return author.fullName.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2);
    }
    if (news.userId) {
      const userIdStr = news.userId.toString();
      if (userIdStr.startsWith('admin')) return 'QT';
      if (userIdStr.startsWith('recruiter')) return 'NTD';
      if (userIdStr.startsWith('user')) return 'ND';
    }
    return 'TG';
  };

  const handleUsefulVote = async () => {
    if (isVoting) return;

    try {
      setIsVoting(true);
      await newsService.voteNews(news.id, 'USEFUL');
      setUsefulVotes(prev => prev + 1);
      message.success('Đã vote hữu ích thành công!');
    } catch (error) {
      console.error('Error voting useful:', error);
      message.error('Có lỗi xảy ra khi vote hữu ích. Vui lòng thử lại!');
    } finally {
      setIsVoting(false);
    }
  };

  const handleInterestVote = async () => {
    if (isVoting) return;

    try {
      setIsVoting(true);
      await newsService.voteNews(news.id, 'INTEREST');
      setInterestVotes(prev => prev + 1);
      message.success('Đã vote thú vị thành công!');
    } catch (error) {
      console.error('Error voting interest:', error);
      message.error('Có lỗi xảy ra khi vote thú vị. Vui lòng thử lại!');
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="bg-white">
      <div className="container-center section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <article className="lg:col-span-3">
              <div className="card-elevated p-6">
                {/* Article Content */}
                <div className="prose-custom">
                  {paragraphs.map((paragraph, index) => (
                    <p
                      key={`paragraph-${paragraph.slice(0, 20)}-${index}`}
                      className="text-body-large text-neutral-700 leading-relaxed mb-4 animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Content Highlights */}
                <div className="mt-8 p-4 bg-accent-10 rounded-xl border-l-4 border-accent animate-fade-in-up">
                  <h3 className="text-heading-3 text-accent mb-4 flex items-center">
                    <svg
                      className="w-6 h-6 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Điểm nhấn quan trọng
                  </h3>
                  <p className="text-body text-neutral-700 leading-relaxed">
                    Bài viết này cung cấp những thông tin cập nhật và xu hướng
                    mới nhất trong lĩnh vực công nghệ và tuyển dụng, giúp bạn
                    nắm bắt được những cơ hội và thách thức trong thị trường lao
                    động hiện tại.
                  </p>
                </div>

                {/* Tags */}
                <div className="mt-8 pt-8 border-t border-neutral-200">
                  <h4 className="text-body font-semibold text-neutral-800 mb-4">
                    Chủ đề liên quan:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="badge-accent">{fieldName}</span>

                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 pt-8 border-t border-neutral-200 flex flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-body text-neutral-600">
                      {usefulVotes}
                    </span>
                    <button
                      className="btn-primary flex items-center"
                      onClick={handleUsefulVote}
                      disabled={isVoting}
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                        />
                      </svg>
                      {isVoting ? 'Đang vote...' : 'Hữu ích'}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-body text-neutral-600">
                      {interestVotes}
                    </span>
                    <button
                      className="btn-secondary flex items-center"
                      onClick={handleInterestVote}
                      disabled={isVoting}
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.737 3h4.017c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
                        />
                      </svg>
                      {isVoting ? 'Đang vote...' : 'Thú vị'}
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-8 space-y-4">
                {/* Table of Contents */}
                <div className="card-elevated p-4">
                  <h3 className="text-heading-3 text-neutral-800 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      />
                    </svg>
                    Nội dung bài viết
                  </h3>
                  <div className="space-y-2">
                    <button className="block text-body text-accent hover:text-accent-dark transition-colors text-left">
                      → Giới thiệu chung
                    </button>
                    <button className="block text-body text-neutral-600 hover:text-accent transition-colors text-left">
                      → Tình hình hiện tại
                    </button>
                    <button className="block text-body text-neutral-600 hover:text-accent transition-colors text-left">
                      → Xu hướng tương lai
                    </button>
                    <button className="block text-body text-neutral-600 hover:text-accent transition-colors text-left">
                      → Kết luận
                    </button>
                  </div>
                </div>

                {/* Author Info */}
                <div className="card-elevated p-4">
                  <h3 className="text-heading-3 text-neutral-800 mb-4">
                    Về tác giả
                  </h3>
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gradient-accent-avatar rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {getAuthorInitials()}
                    </div>
                    <div>
                      <div className="text-body font-semibold text-neutral-800 mb-1">
                        {getAuthorName()}
                      </div>
                      <p className="text-caption text-neutral-600 leading-relaxed">
                        <Tag color="blue">{author?.roleName}</Tag> - <Tag color="yellow">{author?.eloRank}</Tag>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Related Actions */}
                <div className="card-elevated p-4">
                  <h3 className="text-heading-3 text-neutral-800 mb-4">
                    Hành động
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full btn-sm btn-accent flex items-center justify-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4zM9 6v11h2V6H9zm4 0v11h2V6h-2z"
                        />
                      </svg>
                      Báo cáo bài viết
                    </button>

                    <button className="w-full btn-sm btn-outline flex items-center justify-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Xem thêm từ tác giả
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};
