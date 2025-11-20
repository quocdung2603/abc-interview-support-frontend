import React from 'react';
import {
  HeartOutlined,
  HeartFilled,
  CommentOutlined,
  BookOutlined,
  BookFilled,
  CrownOutlined,
} from '@ant-design/icons';

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

interface DiscussionPostProps {
  post: DiscussionPost;
  onLike: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onPostClick: (postId: string) => void;
}

const DiscussionPostComponent: React.FC<DiscussionPostProps> = ({
  post,
  onLike,
  onBookmark,
  onPostClick,
}) => {
  const getLevelBadgeClass = (level: string) => {
    switch (level.toLowerCase()) {
      case 'fresher':
        return 'badge-success';
      case 'junior':
        return 'badge-accent';
      case 'middle':
        return 'badge-warning';
      case 'senior':
        return 'badge-primary';
      default:
        return 'badge-secondary';
    }
  };

  return (
    <div className="card-elevated p-4 animate-fade-in-up">
      {/* Admin Badge */}
      {post.isAdminQuestion && (
        <div className="mb-2">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            <CrownOutlined />
            Câu hỏi từ Admin
          </div>
        </div>
      )}

      {/* Post Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <img
              src={post.authorAvatar}
              alt={post.author}
              className="w-10 h-10 rounded-full object-cover"
            />
            {post.isAdminQuestion && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <CrownOutlined className="text-white text-xs" />
              </div>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              {post.author}
              {post.isAdminQuestion && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                  Admin
                </span>
              )}
            </h4>
            <p className="text-sm text-gray-500">{post.createdAt}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <span className="badge-secondary text-xs">{post.field}</span>
          <span className={`${getLevelBadgeClass(post.level)} text-xs`}>
            {post.level}
          </span>
        </div>
      </div>

      {/* Post Content */}
      <button
        className="w-full text-left cursor-pointer"
        onClick={() => onPostClick(post.id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onPostClick(post.id);
          }
        }}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors line-clamp-2">
          {post.title}
        </h2>
        <p className="text-gray-600 mb-3 line-clamp-3">{post.content}</p>
      </button>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {post.tags.map((tag) => (
          <span key={tag} className="badge-primary text-xs">
            #{tag}
          </span>
        ))}
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onLike(post.id)}
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              post.isLiked
                ? 'text-red-600 bg-red-50'
                : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            {post.isLiked ? (
              <HeartFilled className="text-red-600" />
            ) : (
              <HeartOutlined />
            )}
            {post.likes}
          </button>
          <button
            className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            onClick={() => onPostClick(post.id)}
          >
            <CommentOutlined />
            {post.replies}
          </button>
        </div>
        <button
          onClick={() => onBookmark(post.id)}
          className={`p-2 rounded-lg transition-colors ${
            post.isBookmarked
              ? 'text-yellow-600 bg-yellow-50'
              : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
          }`}
        >
          {post.isBookmarked ? (
            <BookFilled className="text-yellow-600" />
          ) : (
            <BookOutlined />
          )}
        </button>
      </div>
    </div>
  );
};

export default DiscussionPostComponent;
