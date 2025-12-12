import React, { useState, useEffect } from 'react';
import { Post, Field, Topic, Level, User } from '@abc-interview-support-frontend/types';
import CreatePostButton from './CreatePostButton';
import PostTable from './PostTable';
import CreatePostDrawer, { CreatePostData } from './CreatePostDrawer';
import CommunityFilter, { CommunityFilters } from './CommunityFilter';
import { communityService } from '@abc-interview-support-frontend/services';
import { message, Modal } from 'antd';
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
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [editingPost, setEditingPost] = useState<Post | undefined>();
  const [filters, setFilters] = useState<CommunityFilters>({});
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);
  const navigate = useNavigate();

  useEffect(() => {
    let filtered = [...posts];

    if (filters.postType) {
      filtered = filtered.filter(post => post.postType === filters.postType);
    }
    if (filters.fieldId) {
      filtered = filtered.filter(post => post.fieldId === filters.fieldId);
    }
    if (filters.topicId) {
      filtered = filtered.filter(post => post.topicId === filters.topicId);
    }
    if (filters.levelId) {
      filtered = filtered.filter(post => post.levelId === filters.levelId);
    }
    if (filters.status) {
      filtered = filtered.filter(post => post.status === filters.status);
    }
    if (filters.title) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(filters.title!.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  }, [posts, filters]);

  const handleCreatePost = () => {
    setDrawerMode('create');
    setEditingPost(undefined);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setDrawerMode('create');
    setEditingPost(undefined);
  };

  const handleSubmitPost = async (data: CreatePostData) => {
    try {
      await communityService.createDiscussionPost(user.id, data);
      onRefresh();
      setDrawerOpen(false);
      message.success('Tạo bài thảo luận thành công!');
    } catch (error) {
      console.error('Error creating post:', error);
      message.error('Không thể tạo bài thảo luận. Vui lòng thử lại!');
    }
  };

  const handleUpdatePost = async (postId: number, data: CreatePostData) => {
    try {
      await communityService.updateDiscussionPost(postId, data);
      onRefresh();
      setDrawerOpen(false);
      message.success('Cập nhật bài thảo luận thành công!');
    } catch (error) {
      console.error('Error updating post:', error);
      message.error('Không thể cập nhật bài thảo luận. Vui lòng thử lại!');
    }
  };

  const handleViewPost = (postId: number) => {
    console.log('View post:', postId);
    // Implement view post logic here
    navigate(`/community-discussion-details/${postId}`);
  };

  const handleEditPost = (postId: number) => {
    console.log('Edit post:', postId);
    // Find the post to edit
    const postToEdit = posts.find(post => post.id === postId);
    if (postToEdit && postToEdit.status === 'DRAFT') {
      setDrawerMode('edit');
      setEditingPost(postToEdit);
      setDrawerOpen(true);
    } else {
      message.error('Chỉ có thể chỉnh sửa bài thảo luận ở trạng thái nháp!');
    }
  };

  const handleDeletePost = (postId: number) => {
    Modal.confirm({
      title: 'Xác nhận xóa bài thảo luận',
      content: 'Bạn có chắc chắn muốn xóa bài thảo luận này? Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          await communityService.deleteDiscussionPost(postId);
          onRefresh();
          message.success('Xóa bài thảo luận thành công!');
        } catch (error) {
          console.error('Error deleting post:', error);
          message.error('Không thể xóa bài thảo luận. Vui lòng thử lại!');
        }
      },
    });
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

      {/* Community Filter */}
      <CommunityFilter
        fields={fields}
        topics={topics}
        levels={levels}
        onFilterChange={setFilters}
      />

      {/* Post Table */}
      <PostTable posts={filteredPosts} onViewPost={handleViewPost} onEditPost={handleEditPost} onDeletePost={handleDeletePost} />

      {/* Create Post Drawer */}
      <CreatePostDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        fields={fields}
        topics={topics}
        levels={levels}
        mode={drawerMode}
        editingPost={editingPost}
        onSubmit={handleSubmitPost}
        onUpdate={handleUpdatePost}
      />
    </div>
  );
};

export default CommunityTabs;
