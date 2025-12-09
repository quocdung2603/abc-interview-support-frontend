import React, { useState } from 'react';
import { Post, Field, Topic, Level, User } from '@abc-interview-support-frontend/types';
import CreatePostButton from './CreatePostButton';
import PostTable from './PostTable';
import CreatePostDrawer, { CreatePostData } from './CreatePostDrawer';
import { communityService } from '@abc-interview-support-frontend/services';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

interface CommunityTabsProps {
  user: User;
  posts: Post[];
  fields: Field[];
  topics: Topic[];
  levels: Level[];
  onRefresh: () => void;
}

const CommunityTabs: React.FC<CommunityTabsProps> = ({
  user,
  posts,
  fields,
  topics,
  levels,
  onRefresh,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreatePost = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleSubmitPost = async (data: CreatePostData) => {
    try {
      await communityService.createDiscussionPost(user.id, data);
      onRefresh();
      setDrawerOpen(false);
      message.success('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      message.error('Error creating post. Please try again.');
    }
  };

  const handleViewPost = (postId: number) => {
    console.log('View post:', postId);
    // Implement view post logic here
    navigate(`/community-discussion-details/${postId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>💬</span>
            <span>Cộng đồng</span>
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Chia sẻ và thảo luận với cộng đồng
          </p>
        </div>
        <CreatePostButton onClick={handleCreatePost} />
      </div>

      {/* Post Table */}
      <PostTable posts={posts} onViewPost={handleViewPost} />

      {/* Create Post Drawer */}
      <CreatePostDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        fields={fields}
        topics={topics}
        levels={levels}
        onSubmit={handleSubmitPost}
      />
    </div>
  );
};

export default CommunityTabs;
