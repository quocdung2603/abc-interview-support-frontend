import React from 'react';
import {
  UserOutlined,
  CalendarOutlined,
  EyeOutlined,
  MessageOutlined,
  BookOutlined,
  CrownOutlined,
} from '@ant-design/icons';

interface DiscussionQuestionProps {
  title: string;
  author: string;
  authorAvatar: string;
  createdAt: string;
  field: string;
  level: string;
  tags: string[];
  views: number;
  replies: number;
}

const DiscussionQuestion: React.FC<DiscussionQuestionProps> = ({
  title,
  author,
  authorAvatar,
  createdAt,
  field,
  level,
  tags,
  views,
  replies,
}) => {
  return (
    <div className="card-elevated p-6 mb-6">
      {/* Header with author info */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={authorAvatar}
              alt={author}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <CrownOutlined className="text-white text-xs" />
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <UserOutlined className="text-gray-400" />
              {author}
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                Admin
              </span>
            </h4>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <CalendarOutlined className="text-gray-400" />
              {createdAt}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="badge-primary">{field}</span>
          <span className="badge-secondary">{level}</span>
        </div>
      </div>

      {/* Question title */}
      <h1 className="text-2xl md:text-xl font-bold text-gray-900 mb-4 leading-tight">
        {title}
      </h1>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag) => (
          <span key={tag} className="badge-accent text-xs">
            #{tag}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-gray-600">
            <EyeOutlined />
            <span className="text-sm font-medium">{views} lượt xem</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MessageOutlined />
            <span className="text-sm font-medium">{replies} câu trả lời</span>
          </div>
        </div>
        <button className="btn-outline btn-sm inline-flex items-center gap-2">
          <BookOutlined />
          Lưu câu hỏi
        </button>
      </div>
    </div>
  );
};

export default DiscussionQuestion;
