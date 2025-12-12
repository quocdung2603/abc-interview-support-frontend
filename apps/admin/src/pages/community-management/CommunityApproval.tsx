import { useMemo, useState, useEffect } from 'react';
import { Field, Level, Post, Topic } from '@abc-interview-support-frontend/types';
import { questionService, communityService } from '@abc-interview-support-frontend/services';
import { CommunityApprovalFormDrawer, CommunityApprovalHeader, CommunityApprovalTable, CommunityApprovalToolbar } from './components/approval';

const CommunityApproval = () => {
  const [searchText, setSearchText] = useState('');
  const [fieldFilter, setFieldFilter] = useState<string>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [postTypeFilter, setPostTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dataList, setDataList] = useState<Post[]>([]);
  const [fieldData, setFieldData] = useState<Field[]>([]);
  const [topicData, setTopicData] = useState<Topic[]>([]);
  const [levelData, setLevelData] = useState<Level[]>([]);
  const [selectedRowKeys] = useState<React.Key[]>([]);
  const [previewDrawerOpen, setPreviewDrawerOpen] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const getAllFields = async () => {
    try {
      const res = await questionService.getAllFields();
      console.log('Fields:', res.content);
      setFieldData(res.content || []);
    } catch (error) {
      console.error('Error fetching fields:', error);
      setFieldData([]);
    }
  };

  const getAllTopics = async () => {
    try {
      const res = await questionService.getAllTopics();
      console.log('Topics:', res.content);
      setTopicData(res.content || []);
    } catch (error) {
      console.error('Error fetching topics:', error);
      setTopicData([]);
    }
  };

  const getAllLevels = async () => {
    try {
      const res = await questionService.getAllLevels();
      console.log('Levels:', res.content);
      setLevelData(res.content || []);
    } catch (error) {
      console.error('Error fetching levels:', error);
      setLevelData([]);
    }
  };

  const getAllPosts = async () => {
    try {
      const res = await communityService.getAllPost();
      console.log('Posts:', res.content || res);
      // Filter posts that are not PUBLISHED (i.e., DRAFT and LOCKED)
      const filteredPosts = (res.content || res).filter((post: Post) => post.status !== 'PUBLISHED');
      setDataList(filteredPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setDataList([]);
    }
  };

  // Load data on component mount
  useEffect(() => {
    getAllFields();
    getAllTopics();
    getAllLevels();
    getAllPosts();
  }, []);

  const filteredData = useMemo(() => {
    return dataList.filter((item) => {
      const matchesSearch = item?.title
        ?.toLowerCase()
        .includes(searchText.toLowerCase());
      const matchesField = fieldFilter === 'all' || item.fieldId === Number(fieldFilter);
      const matchesTopic = topicFilter === 'all' || item.topicId === Number(topicFilter);
      const matchesLevel = levelFilter === 'all' || item.levelId === Number(levelFilter);
      const matchesPostType = postTypeFilter === 'all' || item.postType === postTypeFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

      return matchesSearch && matchesField && matchesTopic && matchesLevel && matchesPostType && matchesStatus;
    });
  }, [dataList, searchText, fieldFilter, topicFilter, levelFilter, postTypeFilter, statusFilter]);

  const handleCreate = () => {
    setSelectedPost(null); // Clear selected post for creation
    setFormVisible(true);
  };

  const handlePreview = (data: Post) => {
    setSelectedPost(data);
    setPreviewDrawerOpen(true);
  };

  const handleEdit = (data: Post) => {
    setSelectedPost(data);
    setFormVisible(true);
  };

  const handleDelete = async (communityId: number) => {
    try {
      await communityService.deleteDiscussionPost(communityId);
      // Refresh the data after deletion
      await getAllPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handlePreviewDrawerClose = () => {
    setPreviewDrawerOpen(false);
    setSelectedPost(null);
  };

  const handleFormClose = () => {
    setFormVisible(false);
    setSelectedPost(null);
  };

  const handleApprove = async (postId: number, decision: 'approve' | 'reject', comment?: string) => {
    try {
      if (decision === 'approve') {
        // Call approve API for approval
        await communityService.approvePost(postId);
        console.log('Approved post:', postId, 'Comment:', comment);
      } else if (decision === 'reject') {
        // Call reject API for rejection
        await communityService.rejectPost(postId);
        console.log('Rejected post:', postId, 'Comment:', comment);
      }

      // Refresh the data after approval/rejection
      await getAllPosts();

      // Close preview drawer if open
      setPreviewDrawerOpen(false);
      setSelectedPost(null);
    } catch (error) {
      console.error('Error approving post:', error);
      throw error;
    }
  };

  return (
    <div className="container-center animate-fade-in-up">
      <CommunityApprovalHeader onCreate={handleCreate} />
      <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
        <CommunityApprovalToolbar
          searchText={searchText}
          onSearchChange={setSearchText}
          fieldFilter={fieldFilter}
          onFieldFilterChange={setFieldFilter}
          topicFilter={topicFilter}
          onTopicFilterChange={setTopicFilter}
          levelFilter={levelFilter}
          onLevelFilterChange={setLevelFilter}
          postTypeFilter={postTypeFilter}
          onPostTypeFilterChange={setPostTypeFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          selectedRowKeys={selectedRowKeys}
          fields={fieldData}
          topics={topicData}
          levels={levelData}
          questionTypes={[]} // TODO: Add question types data
        />

        <CommunityApprovalTable
          dataList={filteredData}
          onPreview={handlePreview}
          onEdit={handleEdit}
          onDelete={handleDelete}
          fields={fieldData}
          topics={topicData}
          levels={levelData}
        />
      </div>

      <CommunityApprovalFormDrawer
        open={formVisible}
        onClose={handleFormClose}
        post={selectedPost}
        fields={fieldData}
        topics={topicData}
        levels={levelData}
        onApprove={handleApprove}
      />
    </div >
  );
};

export default CommunityApproval;