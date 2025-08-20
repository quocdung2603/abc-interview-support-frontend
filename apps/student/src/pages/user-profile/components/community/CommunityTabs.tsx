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
    <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-lg)',
        }}
      >
        <h3
          className="text-heading-3"
          style={{ color: 'var(--color-primary)', margin: 0 }}
        >
          Tin tức tuyển dụng
        </h3>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <button className="btn-outline btn-sm">📅 Hôm nay</button>
          <button className="btn-outline btn-sm">🔥 Trending</button>
          <button className="btn-outline btn-sm">⭐ Đã lưu</button>
        </div>
      </div>

      {newsItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
          <div
            style={{
              fontSize: '3rem',
              marginBottom: 'var(--spacing-sm)',
              opacity: 0.3,
            }}
          >
            📰
          </div>
          <p style={{ color: 'var(--color-neutral-500)', margin: 0 }}>
            Không có tin tức mới
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-md)',
          }}
        >
          {newsItems.map((news) => (
            <div
              key={news.id}
              className="card-soft"
              style={{ padding: 'var(--spacing-md)' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)',
                      marginBottom: 'var(--spacing-xs)',
                    }}
                  >
                    <span
                      className="badge-neutral"
                      style={{ fontSize: '0.75rem' }}
                    >
                      {news.category}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-neutral-500)',
                      }}
                    >
                      • {news.source}
                    </span>
                  </div>
                  <h4
                    style={{
                      margin: '0 0 0.5rem 0',
                      color: 'var(--color-neutral-800)',
                    }}
                  >
                    {news.title}
                  </h4>
                  <p
                    style={{
                      margin: '0 0 0.5rem 0',
                      color: 'var(--color-neutral-600)',
                      lineHeight: 1.5,
                    }}
                  >
                    {news.summary}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      gap: 'var(--spacing-md)',
                      fontSize: '0.875rem',
                      color: 'var(--color-neutral-500)',
                    }}
                  >
                    <span>
                      📅{' '}
                      {new Date(news.publishedDate).toLocaleDateString('vi-VN')}
                    </span>
                    <span>⏱️ {news.readTime} phút đọc</span>
                  </div>
                </div>
                <button
                  className="btn-ghost btn-sm"
                  onClick={() => onBookmarkNews(news.id)}
                  style={{
                    color: news.isBookmarked
                      ? 'var(--color-warning)'
                      : 'var(--color-neutral-400)',
                    marginLeft: 'var(--spacing-md)',
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
    <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-lg)',
        }}
      >
        <h3
          className="text-heading-3"
          style={{ color: 'var(--color-primary)', margin: 0 }}
        >
          Cuộc thảo luận
        </h3>
        <button className="btn-accent btn-sm">➕ Tạo thảo luận mới</button>
      </div>

      {discussions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
          <div
            style={{
              fontSize: '3rem',
              marginBottom: 'var(--spacing-sm)',
              opacity: 0.3,
            }}
          >
            💬
          </div>
          <p style={{ color: 'var(--color-neutral-500)', margin: 0 }}>
            Chưa có thảo luận nào
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-md)',
          }}
        >
          {discussions.map((discussion) => (
            <div
              key={discussion.id}
              className="card-soft"
              style={{ padding: 'var(--spacing-md)' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ flex: 1 }}>
                  <h4
                    style={{
                      margin: '0 0 0.5rem 0',
                      color: 'var(--color-neutral-800)',
                    }}
                  >
                    {discussion.title}
                  </h4>
                  <p
                    style={{
                      margin: '0 0 0.5rem 0',
                      color: 'var(--color-neutral-600)',
                      lineHeight: 1.5,
                    }}
                  >
                    {discussion.content.length > 150
                      ? `${discussion.content.substring(0, 150)}...`
                      : discussion.content}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-md)',
                      marginBottom: 'var(--spacing-sm)',
                    }}
                  >
                    {discussion.tags.map((tag) => (
                      <span
                        key={tag}
                        className="tag"
                        style={{ fontSize: '0.75rem' }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: 'var(--spacing-lg)',
                      fontSize: '0.875rem',
                      color: 'var(--color-neutral-500)',
                    }}
                  >
                    <span>👤 {discussion.author}</span>
                    <span>
                      📅{' '}
                      {new Date(discussion.createdDate).toLocaleDateString(
                        'vi-VN'
                      )}
                    </span>
                    <span>💬 {discussion.replies} phản hồi</span>
                    <span>👍 {discussion.likes} lượt thích</span>
                    <span>👁️ {discussion.views} lượt xem</span>
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-xs)',
                  }}
                >
                  {discussion.isParticipated && (
                    <span
                      className="badge-accent"
                      style={{ fontSize: '0.75rem' }}
                    >
                      Đã tham gia
                    </span>
                  )}
                  <button
                    className="btn-outline btn-sm"
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
    <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-lg)',
        }}
      >
        <h3
          className="text-heading-3"
          style={{ color: 'var(--color-primary)', margin: 0 }}
        >
          Câu hỏi phỏng vấn
        </h3>
        <button className="btn-accent btn-sm">❓ Đặt câu hỏi mới</button>
      </div>

      {questions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
          <div
            style={{
              fontSize: '3rem',
              marginBottom: 'var(--spacing-sm)',
              opacity: 0.3,
            }}
          >
            ❓
          </div>
          <p style={{ color: 'var(--color-neutral-500)', margin: 0 }}>
            Chưa có câu hỏi nào
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-md)',
          }}
        >
          {questions.map((question) => (
            <div
              key={question.id}
              className="card-soft"
              style={{ padding: 'var(--spacing-md)' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)',
                      marginBottom: 'var(--spacing-xs)',
                    }}
                  >
                    <span
                      className="badge-neutral"
                      style={{ fontSize: '0.75rem' }}
                    >
                      {question.category}
                    </span>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: getDifficultyColor(
                          question.difficulty
                        ),
                        color: 'white',
                        fontSize: '0.75rem',
                      }}
                    >
                      {getDifficultyText(question.difficulty)}
                    </span>
                  </div>
                  <h4
                    style={{
                      margin: '0 0 0.5rem 0',
                      color: 'var(--color-neutral-800)',
                    }}
                  >
                    {question.title}
                  </h4>
                  <p
                    style={{
                      margin: '0 0 0.5rem 0',
                      color: 'var(--color-neutral-600)',
                      lineHeight: 1.5,
                    }}
                  >
                    {question.content.length > 150
                      ? `${question.content.substring(0, 150)}...`
                      : question.content}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-md)',
                      marginBottom: 'var(--spacing-sm)',
                    }}
                  >
                    {question.tags.map((tag) => (
                      <span
                        key={tag}
                        className="tag"
                        style={{ fontSize: '0.75rem' }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: 'var(--spacing-lg)',
                      fontSize: '0.875rem',
                      color: 'var(--color-neutral-500)',
                    }}
                  >
                    <span>👤 {question.author}</span>
                    <span>
                      📅{' '}
                      {new Date(question.createdDate).toLocaleDateString(
                        'vi-VN'
                      )}
                    </span>
                    <span>💬 {question.answers} câu trả lời</span>
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <button
                      className="btn-ghost btn-sm"
                      onClick={() => onVoteQuestion(question.id, 'up')}
                      style={{
                        padding: '0.25rem',
                        color: 'var(--color-success)',
                      }}
                    >
                      ▲
                    </button>
                    <span
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: 'var(--color-neutral-700)',
                      }}
                    >
                      {question.votes}
                    </span>
                    <button
                      className="btn-ghost btn-sm"
                      onClick={() => onVoteQuestion(question.id, 'down')}
                      style={{
                        padding: '0.25rem',
                        color: 'var(--color-danger)',
                      }}
                    >
                      ▼
                    </button>
                  </div>
                  {question.isSolved && (
                    <span
                      className="badge-success"
                      style={{ fontSize: '0.75rem' }}
                    >
                      ✓ Đã giải
                    </span>
                  )}
                  <button
                    className="btn-outline btn-sm"
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
