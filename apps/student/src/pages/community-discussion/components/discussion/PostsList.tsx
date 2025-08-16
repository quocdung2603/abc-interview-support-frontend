import React from 'react';
import DiscussionPostComponent from './DiscussionPost';

interface DiscussionPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  createdAt: string;
  likes: number;
  replies: number;
  field: string;
  level: string;
  tags: string[];
  isLiked: boolean;
  isBookmarked: boolean;
  isAdminQuestion?: boolean;
}

interface PostsListProps {
  posts: DiscussionPost[];
  loading: boolean;
  onLike: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onPostClick: (postId: string) => void;
  onLoadMore: () => void;
  hasMore: boolean;
}

const PostsList: React.FC<PostsListProps> = ({
  posts,
  loading,
  onLike,
  onBookmark,
  onPostClick,
  onLoadMore,
  hasMore,
}) => {
  if (loading && posts.length === 0) {
    return (
      <div className="card-elevated p-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg
            className="w-16 h-16 mx-auto animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </div>
        <p className="text-gray-600">Đang tải câu hỏi...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="card-elevated p-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Chưa có câu hỏi nào
        </h3>
        <p className="text-gray-600">
          Admin sẽ đăng câu hỏi phỏng vấn để mọi người cùng tham gia trả lời!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post, index) => (
        <DiscussionPostComponent
          key={post.id}
          post={post}
          onLike={onLike}
          onBookmark={onBookmark}
          onPostClick={onPostClick}
        />
      ))}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="btn-secondary"
          >
            {loading ? 'Đang tải...' : 'Xem thêm câu hỏi'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PostsList;
