import React, { useState } from 'react';
import {
  Question,
  Answer,
} from '../../../../../../../libs/types/src/lib/question-types';

interface CommunityInteractionProps {
  userPosts: Array<{
    id: string;
    title: string;
    content: string;
    type: 'post' | 'discussion' | 'question';
    createdDate: Date;
    likes: number;
    comments: number;
    views: number;
  }>;
  userQuestionInteractions: Array<{
    question: Question;
    userAnswer?: Answer;
    hasVoted: boolean;
    voteType: 'useful' | 'unuseful' | null;
    interactionDate: Date;
  }>;
}

const CommunityInteraction: React.FC<CommunityInteractionProps> = ({
  userPosts,
  userQuestionInteractions,
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'interactions'>('posts');

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'post':
        return 'var(--color-accent)';
      case 'discussion':
        return 'var(--color-warning)';
      case 'question':
        return 'var(--color-success)';
      default:
        return 'var(--color-neutral-400)';
    }
  };

  const getPostTypeText = (type: string) => {
    switch (type) {
      case 'post':
        return 'Bài viết';
      case 'discussion':
        return 'Thảo luận';
      case 'question':
        return 'Câu hỏi';
      default:
        return type;
    }
  };

  const getVoteTypeColor = (voteType: string | null) => {
    switch (voteType) {
      case 'useful':
        return 'var(--color-success)';
      case 'unuseful':
        return 'var(--color-danger)';
      default:
        return 'var(--color-neutral-400)';
    }
  };

  const renderUserPosts = () => {
    if (userPosts.length === 0) {
      return (
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
            Bạn chưa có bài viết hoặc thảo luận nào
          </p>
        </div>
      );
    }

    return (
      <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
        {userPosts.map((post) => (
          <div
            key={post.id}
            className="card-interactive"
            style={{ padding: 'var(--spacing-md)' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 'var(--spacing-sm)',
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    marginBottom: '0.5rem',
                  }}
                >
                  <span
                    className="badge-secondary"
                    style={{
                      backgroundColor: getPostTypeColor(post.type),
                      color: 'white',
                    }}
                  >
                    {getPostTypeText(post.type)}
                  </span>
                  <span
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-neutral-500)',
                    }}
                  >
                    {formatDate(post.createdDate)}
                  </span>
                </div>
                <h3
                  style={{
                    margin: '0 0 0.5rem 0',
                    color: 'var(--color-neutral-800)',
                  }}
                >
                  {post.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: 'var(--color-neutral-600)',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {post.content}
                </p>
              </div>
              <button
                className="btn-outline btn-sm"
                style={{ marginLeft: 'var(--spacing-sm)' }}
              >
                Xem chi tiết
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: 'var(--spacing-sm)',
                borderTop: '1px solid var(--color-neutral-200)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: 'var(--spacing-md)',
                  fontSize: '0.875rem',
                  color: 'var(--color-neutral-500)',
                }}
              >
                <span>👍 {post.likes} lượt thích</span>
                <span>💬 {post.comments} bình luận</span>
                <span>👁️ {post.views} lượt xem</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderQuestionInteractions = () => {
    if (userQuestionInteractions.length === 0) {
      return (
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
            Bạn chưa có tương tác nào với câu hỏi trong cộng đồng
          </p>
        </div>
      );
    }

    return (
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.9rem',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: 'var(--color-neutral-50)' }}>
              <th
                style={{
                  padding: 'var(--spacing-sm)',
                  textAlign: 'left',
                  borderBottom: '2px solid var(--color-neutral-200)',
                  fontWeight: '600',
                }}
              >
                Câu hỏi
              </th>
              <th
                style={{
                  padding: 'var(--spacing-sm)',
                  textAlign: 'center',
                  borderBottom: '2px solid var(--color-neutral-200)',
                  fontWeight: '600',
                }}
              >
                Đánh giá
              </th>
              <th
                style={{
                  padding: 'var(--spacing-sm)',
                  textAlign: 'center',
                  borderBottom: '2px solid var(--color-neutral-200)',
                  fontWeight: '600',
                }}
              >
                Đã trả lời
              </th>
              <th
                style={{
                  padding: 'var(--spacing-sm)',
                  textAlign: 'center',
                  borderBottom: '2px solid var(--color-neutral-200)',
                  fontWeight: '600',
                }}
              >
                Ngày tương tác
              </th>
              <th
                style={{
                  padding: 'var(--spacing-sm)',
                  textAlign: 'center',
                  borderBottom: '2px solid var(--color-neutral-200)',
                  fontWeight: '600',
                }}
              >
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {userQuestionInteractions.map((interaction, index) => (
              <tr
                key={`${interaction.question.questionId}-${index}`}
                style={{ borderBottom: '1px solid var(--color-neutral-200)' }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    'var(--color-neutral-50)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = 'transparent')
                }
              >
                <td style={{ padding: 'var(--spacing-sm)', maxWidth: '300px' }}>
                  <div
                    style={{
                      fontWeight: '500',
                      color: 'var(--color-neutral-800)',
                      marginBottom: '0.25rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {interaction.question.questionContent}
                  </div>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--color-neutral-500)',
                    }}
                  >
                    Hữu ích: {interaction.question.usefulVote} • Không hữu ích:{' '}
                    {interaction.question.unusefulVote}
                  </div>
                </td>
                <td
                  style={{ padding: 'var(--spacing-sm)', textAlign: 'center' }}
                >
                  {interaction.hasVoted ? (
                    <span
                      className="badge-secondary"
                      style={{
                        backgroundColor: getVoteTypeColor(interaction.voteType),
                        color: 'white',
                      }}
                    >
                      {interaction.voteType === 'useful'
                        ? 'Hữu ích'
                        : 'Không hữu ích'}
                    </span>
                  ) : (
                    <span
                      style={{
                        color: 'var(--color-neutral-400)',
                        fontSize: '0.875rem',
                      }}
                    >
                      Chưa đánh giá
                    </span>
                  )}
                </td>
                <td
                  style={{ padding: 'var(--spacing-sm)', textAlign: 'center' }}
                >
                  {interaction.userAnswer ? (
                    <span className="badge-success">Có</span>
                  ) : (
                    <span
                      style={{
                        color: 'var(--color-neutral-400)',
                        fontSize: '0.875rem',
                      }}
                    >
                      Chưa
                    </span>
                  )}
                </td>
                <td
                  style={{
                    padding: 'var(--spacing-sm)',
                    textAlign: 'center',
                    color: 'var(--color-neutral-600)',
                  }}
                >
                  {formatDate(interaction.interactionDate)}
                </td>
                <td
                  style={{ padding: 'var(--spacing-sm)', textAlign: 'center' }}
                >
                  <button className="btn-outline btn-sm">Xem câu hỏi</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div
      className="card-elevated"
      style={{
        padding: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-lg)',
      }}
    >
      <h2
        className="text-heading-2"
        style={{
          color: 'var(--color-primary)',
          margin: '0 0 var(--spacing-md) 0',
        }}
      >
        Tương tác cộng đồng
      </h2>

      {/* Tabs */}
      <div
        style={{
          borderBottom: '2px solid var(--color-neutral-200)',
          marginBottom: 'var(--spacing-md)',
        }}
      >
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <button
            onClick={() => setActiveTab('posts')}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: `3px solid ${
                activeTab === 'posts' ? 'var(--color-accent)' : 'transparent'
              }`,
              color:
                activeTab === 'posts'
                  ? 'var(--color-accent)'
                  : 'var(--color-neutral-600)',
              fontWeight: activeTab === 'posts' ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Bài viết của tôi ({userPosts.length})
          </button>

          <button
            onClick={() => setActiveTab('interactions')}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: `3px solid ${
                activeTab === 'interactions'
                  ? 'var(--color-accent)'
                  : 'transparent'
              }`,
              color:
                activeTab === 'interactions'
                  ? 'var(--color-accent)'
                  : 'var(--color-neutral-600)',
              fontWeight: activeTab === 'interactions' ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Tương tác câu hỏi ({userQuestionInteractions.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'posts' && renderUserPosts()}
        {activeTab === 'interactions' && renderQuestionInteractions()}
      </div>
    </div>
  );
};

export default CommunityInteraction;
