import React, { useState } from 'react';
import TabNavigation from '../TabNavigation';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  publishedDate: Date;
  source: string;
  readTime: number;
  category: string;
  isBookmarked: boolean;
}

interface DiscussionItem {
  id: string;
  title: string;
  content: string;
  author: string;
  createdDate: Date;
  replies: number;
  likes: number;
  views: number;
  tags: string[];
  isParticipated: boolean;
}

interface QuestionItem {
  id: string;
  title: string;
  content: string;
  author: string;
  createdDate: Date;
  answers: number;
  votes: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  tags: string[];
  isSolved: boolean;
}

interface CommunityTabsProps {
  newsItems: NewsItem[];
  discussions: DiscussionItem[];
  questions: QuestionItem[];
  onBookmarkNews: (newsId: string) => void;
  onJoinDiscussion: (discussionId: string) => void;
  onAnswerQuestion: (questionId: string) => void;
  onVoteQuestion: (questionId: string, voteType: 'up' | 'down') => void;
}

const CommunityTabs: React.FC<CommunityTabsProps> = ({
  newsItems,
  discussions,
  questions,
  onBookmarkNews,
  onJoinDiscussion,
  onAnswerQuestion,
  onVoteQuestion,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<string>('news');

  const subTabs = [
    {
      id: 'news',
      label: 'Tin tức',
      icon: '',
      description: 'Tin tức tuyển dụng mới nhất',
      badge: newsItems.filter((news) => !news.isBookmarked).length || undefined,
    },
    {
      id: 'discussions',
      label: 'Cuộc thảo luận',
      icon: '',
      description: 'Thảo luận cộng đồng',
      badge: discussions.filter((d) => !d.isParticipated).length || undefined,
    },
    {
      id: 'questions',
      label: 'Câu hỏi',
      icon: '',
      description: 'Hỏi đáp phỏng vấn',
      badge: questions.filter((q) => !q.isSolved).length || undefined,
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'var(--color-success)';
      case 'Medium':
        return 'var(--color-warning)';
      case 'Hard':
        return 'var(--color-danger)';
      default:
        return 'var(--color-neutral-600)';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'Dễ';
      case 'Medium':
        return 'Trung bình';
      case 'Hard':
        return 'Khó';
      default:
        return difficulty;
    }
  };

  const renderNews = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-blue-600 m-0">
          📰 Tin tức tuyển dụng
        </h3>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
            📅 Hôm nay
          </button>
          <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
            🔥 Trending
          </button>
          <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
            ⭐ Đã lưu
          </button>
        </div>
      </div>

      {newsItems.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2 opacity-30">📰</div>
          <p className="text-sm text-gray-500 m-0">Không có tin tức mới</p>
        </div>
      ) : (
        <div className="space-y-3">
          {newsItems.map((news) => (
            <div
              key={news.id}
              className="bg-gray-50 rounded-md p-3 border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 text-xs font-medium text-gray-600 bg-gray-200 rounded">
                      {news.category}
                    </span>
                    <span className="text-xs text-gray-500">• {news.source}</span>
                  </div>
                  <h4 className="text-base font-semibold text-gray-800 m-0 mb-1">
                    {news.title}
                  </h4>
                  <p className="text-sm text-gray-600 m-0 mb-2 leading-relaxed">
                    {news.summary}
                  </p>
                  <div className="flex gap-3 text-xs text-gray-500">
                    <span>📅 {new Date(news.publishedDate).toLocaleDateString('vi-VN')}</span>
                    <span>⏱️ {news.readTime} phút đọc</span>
                  </div>
                </div>
                <button
                  className="ml-3 text-lg hover:scale-110 transition-transform"
                  onClick={() => onBookmarkNews(news.id)}
                  style={{
                    color: news.isBookmarked ? '#fbbf24' : '#9ca3af',
                  }}
                >
                  {news.isBookmarked ? '⭐' : '☆'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderDiscussions = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-blue-600 m-0">
          💬 Cuộc thảo luận
        </h3>
        <button className="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">
          ➕ Tạo thảo luận mới
        </button>
      </div>

      {discussions.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2 opacity-30">💬</div>
          <p className="text-sm text-gray-500 m-0">Chưa có thảo luận nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {discussions.map((discussion) => (
            <div
              key={discussion.id}
              className="bg-gray-50 rounded-md p-3 border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-gray-800 m-0 mb-1">
                    {discussion.title}
                  </h4>
                  <p className="text-sm text-gray-600 m-0 mb-2 leading-relaxed">
                    {discussion.content.length > 150
                      ? `${discussion.content.substring(0, 150)}...`
                      : discussion.content}
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    {discussion.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs font-medium text-blue-600 bg-blue-50 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>👤 {discussion.author}</span>
                    <span>📅 {new Date(discussion.createdDate).toLocaleDateString('vi-VN')}</span>
                    <span>💬 {discussion.replies} phản hồi</span>
                    <span>👍 {discussion.likes} lượt thích</span>
                    <span>👁️ {discussion.views} lượt xem</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 ml-3">
                  {discussion.isParticipated && (
                    <span className="px-2 py-0.5 text-xs font-medium text-green-600 bg-green-50 rounded">
                      Đã tham gia
                    </span>
                  )}
                  <button
                    className="px-3 py-1 text-xs font-medium text-gray-600 bg-white hover:bg-gray-50 border border-gray-300 rounded-md transition-colors"
                    onClick={() => onJoinDiscussion(discussion.id)}
                  >
                    💬 Tham gia
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderQuestions = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-blue-600 m-0">
          ❓ Câu hỏi phỏng vấn
        </h3>
        <button className="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">
          ❓ Đặt câu hỏi mới
        </button>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2 opacity-30">❓</div>
          <p className="text-sm text-gray-500 m-0">Chưa có câu hỏi nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((question) => (
            <div
              key={question.id}
              className="bg-gray-50 rounded-md p-3 border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 text-xs font-medium text-gray-600 bg-gray-200 rounded">
                      {question.category}
                    </span>
                    <span
                      className="px-2 py-0.5 text-xs font-medium text-white rounded"
                      style={{
                        backgroundColor: getDifficultyColor(question.difficulty),
                      }}
                    >
                      {getDifficultyText(question.difficulty)}
                    </span>
                  </div>
                  <h4 className="text-base font-semibold text-gray-800 m-0 mb-1">
                    {question.title}
                  </h4>
                  <p className="text-sm text-gray-600 m-0 mb-2 leading-relaxed">
                    {question.content.length > 150
                      ? `${question.content.substring(0, 150)}...`
                      : question.content}
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    {question.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs font-medium text-blue-600 bg-blue-50 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>👤 {question.author}</span>
                    <span>📅 {new Date(question.createdDate).toLocaleDateString('vi-VN')}</span>
                    <span>💬 {question.answers} câu trả lời</span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1 ml-3">
                  <div className="flex flex-col items-center">
                    <button
                      className="text-green-600 hover:text-green-700 text-sm p-0.5"
                      onClick={() => onVoteQuestion(question.id, 'up')}
                    >
                      ▲
                    </button>
                    <span className="text-sm font-semibold text-gray-700">
                      {question.votes}
                    </span>
                    <button
                      className="text-red-600 hover:text-red-700 text-sm p-0.5"
                      onClick={() => onVoteQuestion(question.id, 'down')}
                    >
                      ▼
                    </button>
                  </div>
                  {question.isSolved && (
                    <span className="px-2 py-0.5 text-xs font-medium text-green-600 bg-green-50 rounded">
                      ✓ Đã giải
                    </span>
                  )}
                  <button
                    className="px-3 py-1 text-xs font-medium text-gray-600 bg-white hover:bg-gray-50 border border-gray-300 rounded-md transition-colors"
                    onClick={() => onAnswerQuestion(question.id)}
                  >
                    💡 Trả lời
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case 'news':
        return renderNews();
      case 'discussions':
        return renderDiscussions();
      case 'questions':
        return renderQuestions();
      default:
        return null;
    }
  };

  return (
    <div>
      <TabNavigation
        tabs={subTabs}
        activeTab={activeSubTab}
        onTabChange={setActiveSubTab}
      />
      <div style={{ minHeight: '400px' }}>{renderSubTabContent()}</div>
    </div>
  );
};

export default CommunityTabs;
