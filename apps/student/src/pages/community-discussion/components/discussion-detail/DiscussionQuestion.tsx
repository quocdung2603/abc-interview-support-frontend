import React, { useEffect } from 'react';
import {
  CrownOutlined,
} from '@ant-design/icons';
import { Field, Level, Post, Topic, User } from '@abc-interview-support-frontend/types';
import { userService } from '@abc-interview-support-frontend/services';
import dayjs from 'dayjs';

interface DiscussionQuestionProps {
  post: Post;
  fields: Field[];
  topics: Topic[];
  levels: Level[];
}

const DiscussionQuestion: React.FC<DiscussionQuestionProps> = ({ post, fields, topics, levels }) => {

  const [author, setAuthor] = React.useState<User | null>(null);

  const isAdmin = post.userId === 1;

  const formatDate = (dateStr: string) => {
    return dayjs(dateStr).format('DD/MM/YYYY HH:mm:ss');
  }


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

  return (
    <div className="card-elevated p-4 mb-6">
      {/* Header with author info */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-accent-avatar rounded-full flex items-center justify-center text-white font-semibold">
              {getAuthorInitials()}
            </div>
            {isAdmin && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <CrownOutlined className="text-white text-xs" />
              </div>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              {getAuthorName()}
            </h4>
            <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Question title */}
      <h1 className="text-lg md:text-base font-bold text-gray-900 mb-3 leading-tight">
        {post.title}
      </h1>
      <p className='text-sm text-gray-500 italic mb-3'>{post.content}</p>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <span key={`field-${post.fieldId}`} className="badge-accent text-xs">
            #{getFieldName(post.fieldId)}
          </span>
          <span key={`level-${post.levelId}`} className="badge-secondary text-xs">
            #{getLevelName(post.levelId)}
          </span>
          <span key={`topic-${post.topicId}`} className="badge-accent text-xs">
            #{getTopicName(post.topicId)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DiscussionQuestion;
