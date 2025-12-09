import { useMemo, useState, useEffect } from 'react';
import { CommunityHeader, CommunityTable, CommunityToolbar, CommunityPreviewDrawer, CommunityFormDrawer } from './components/community';
import { Field, Level, Post, Topic } from '@abc-interview-support-frontend/types';
import { questionService, communityService } from '@abc-interview-support-frontend/services';

const CommunityManagement = () => {
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
      setDataList((res.content || res || []) as Post[]);
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

  const handleDelete = (communityId: number) => {
    // For mock purposes, remove from local state
    setDataList(prev => prev.filter(post => post.id !== communityId));
  };

  const handlePreviewDrawerClose = () => {
    setPreviewDrawerOpen(false);
    setSelectedPost(null);
  };

  const handleFormClose = () => {
    setFormVisible(false);
    setSelectedPost(null);
  };

  const handleFormSuccess = () => {
    // Refresh data after form submission
    getAllPosts();
    setFormVisible(false);
    setSelectedPost(null);
  };

  return (
    <div className="container-center animate-fade-in-up">
      <CommunityHeader onCreate={handleCreate} />
      <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
        <CommunityToolbar
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

        <CommunityTable
          dataList={filteredData}
          onPreview={handlePreview}
          onEdit={handleEdit}
          onDelete={handleDelete}
          fields={fieldData}
          topics={topicData}
          levels={levelData}
        />
      </div>

      <CommunityPreviewDrawer
        open={previewDrawerOpen}
        onClose={handlePreviewDrawerClose}
        post={selectedPost}
        fields={fieldData}
        topics={topicData}
        levels={levelData}
      />

      <CommunityFormDrawer
        open={formVisible}
        onClose={handleFormClose}
        data={selectedPost}
        onSuccess={handleFormSuccess}
        fields={fieldData}
        topics={topicData}
        levels={levelData}
      />
    </div >
  );
};

export default CommunityManagement;