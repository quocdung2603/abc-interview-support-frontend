import React, { useEffect, useState } from 'react';
import {
  CrownOutlined,
} from '@ant-design/icons';
import { Field, Level, Post, Topic, User } from '@abc-interview-support-frontend/types';
import { userService } from '@abc-interview-support-frontend/services';
import dayjs from 'dayjs';

interface DiscussionPostProps {
  post: Post;
  onPostClick: (postId: number) => void;
  fields: Field[];
  topics: Topic[];
  levels: Level[];
}

const DiscussionPost: React.FC<DiscussionPostProps> = ({
  post,
  onPostClick,
  fields,
  topics,
  levels,
}) => {

  const [author, setAuthor] = useState<User | null>(null);

  const getFieldName = (fieldId: number) => {
    const field = fields.find(f => f.id === fieldId);
    return field ? field.name : 'Unknown';
  }

  const getTopicName = (topicId: number) => {
    const topic = topics.find(t => t.id === topicId);
    return topic ? topic.name : 'Unknown';
  }

  const getLevelName = (levelId: number | undefined) => {
    if (!levelId) return 'Unknown';
    const level = levels.find(l => l.id === levelId);
    return level ? level.name : 'Unknown';
  };

  const formatDate = (dateStr: string) => {
    return dayjs(dateStr).format('DD/MM/YYYY HH:mm:ss');
  }

  const shorternContent = (content: string, maxLength: number) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  }

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
    if (post.userId === 1) return 'QT'; // Admin
    const userIdStr = post.userId.toString();
    if (userIdStr.startsWith('recruiter')) return 'NTD';
    if (userIdStr.startsWith('user')) return 'ND';
    return 'TG';
  };

  const getUserById = async (userId: number) => {
    try {
      const res = await userService.getUserById(userId.toString());
      setAuthor(res);
    } catch (error) {
      console.error('Error fetching user:', error);
      setAuthor(null);
    }
  }

  useEffect(() => {
    getUserById(post.userId);
  }, [post.userId]);

  const isAdmin = post.userId === 1;

  return (
    <div className="card-elevated p-4 animate-fade-in-up">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-accent-avatar rounded-full flex items-center justify-center text-white font-semibold">
              {getAuthorInitials()}
            </div>
            {isAdmin && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <CrownOutlined className="text-white text-xs" />
              </div>
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              {getAuthorName()}
            </h4>
            <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
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
        <h2 className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
          {post.title}
        </h2>
        <p className='text-sm text-gray-500 italic mb-3'>{shorternContent(post.content, 100)}</p>
      </button>
      <div className="flex gap-1 border-t-1 border-gray-200 pt-3">
        <span className="badge-secondary text-xs">{post.postType}</span>
        <span className="badge-secondary text-xs">{getFieldName(post.fieldId)}</span>
        <span className="badge-secondary text-xs">{getTopicName(post.topicId)}</span>
        <span className="badge-secondary text-xs">{getLevelName(post.levelId)}</span>
      </div>
    </div>
  );
};

export default DiscussionPost;
