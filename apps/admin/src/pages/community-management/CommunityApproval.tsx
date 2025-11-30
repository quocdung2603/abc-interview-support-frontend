import { useMemo, useState, useEffect } from 'react';
import { Field, Level, Post, Topic } from '@abc-interview-support-frontend/types';
import { questionService } from '@abc-interview-support-frontend/services';
import { CommunityApprovalFormDrawer, CommunityApprovalHeader, CommunityApprovalTable, CommunityApprovalToolbar } from './components/approval';

// Mock data for testing
const mockPosts: Post[] = [
  {
    id: 1,
    userId: 1,
    fieldId: 1,
    topicId: 1,
    levelId: 1,
    postType: 'DISCUSSION',
    status: 'PUBLISHED',
    title: "Hướng dẫn phỏng vấn Frontend Developer",
    content: "Bài viết này sẽ hướng dẫn các bạn cách chuẩn bị cho vị trí Frontend Developer. Bao gồm HTML, CSS, JavaScript, React, Vue.js và các framework hiện đại khác.",
    lockTime: null,
    createdAt: "2025-11-20T10:30:00.000000",
    updatedAt: "2025-11-20T10:30:00.000000"
  },
  {
    id: 2,
    userId: 2,
    fieldId: 2,
    topicId: 2,
    levelId: 2,
    postType: 'DISCUSSION',
    status: 'PUBLISHED',
    title: "Kinh nghiệm làm việc tại công ty công nghệ",
    content: "Sau 2 năm làm việc tại một công ty công nghệ lớn, tôi muốn chia sẻ những kinh nghiệm thực tế về môi trường làm việc, văn hóa công ty, và cách thăng tiến trong sự nghiệp.",
    lockTime: null,
    createdAt: "2025-11-19T14:20:00.000000",
    updatedAt: "2025-11-21T09:15:00.000000"
  },
  {
    id: 3,
    userId: 3,
    fieldId: 1,
    topicId: 3,
    levelId: 3,
    postType: 'QUESTION',
    status: 'LOCKED',
    title: "Locked Post Example",
    content: "This post is locked for commenting. You can only view existing comments.",
    lockTime: "2025-11-25T15:35:25.230932",
    createdAt: "2025-11-24T15:35:25.230932",
    updatedAt: "2025-11-24T15:35:25.230932"
  },
  {
    id: 4,
    userId: 1,
    fieldId: 3,
    topicId: 4,
    levelId: 1,
    postType: 'DISCUSSION',
    status: 'DRAFT',
    title: "Cách học Data Structures and Algorithms hiệu quả",
    content: "DSA là nền tảng quan trọng cho mọi developer. Bài viết này sẽ hướng dẫn cách học DSA một cách có hệ thống, từ cơ bản đến nâng cao, kèm theo các tài liệu và bài tập thực hành.",
    lockTime: null,
    createdAt: "2025-11-18T08:45:00.000000",
    updatedAt: "2025-11-18T08:45:00.000000"
  },
  {
    id: 5,
    userId: 4,
    fieldId: 2,
    topicId: 5,
    levelId: 2,
    postType: 'DISCUSSION',
    status: 'PUBLISHED',
    title: "Review sách 'Clean Code' - Robert C. Martin",
    content: "Sau khi đọc xong cuốn sách Clean Code, tôi muốn review và chia sẻ những điều học được. Cuốn sách này thực sự thay đổi cách tôi viết code và tư duy về programming.",
    lockTime: null,
    createdAt: "2025-11-17T16:10:00.000000",
    updatedAt: "2025-11-20T11:30:00.000000"
  },
  {
    id: 6,
    userId: 5,
    fieldId: 1,
    topicId: 6,
    levelId: 3,
    postType: 'QUESTION',
    status: 'PUBLISHED',
    title: "Hỏi đáp về lương và phúc lợi trong ngành IT",
    content: "Thread hỏi đáp về mức lương, phúc lợi, thưởng trong các công ty IT Việt Nam. Mọi người có thể share kinh nghiệm và thông tin thực tế để tham khảo.",
    lockTime: null,
    createdAt: "2025-11-16T12:00:00.000000",
    updatedAt: "2025-11-22T14:45:00.000000"
  },
  {
    id: 7,
    userId: 3,
    fieldId: 3,
    topicId: 7,
    levelId: 1,
    postType: 'DISCUSSION',
    status: 'PUBLISHED',
    title: "Chia sẻ kinh nghiệm đi onsite",
    content: "Đã có kinh nghiệm đi onsite 6 tháng tại Singapore. Muốn chia sẻ về văn hóa làm việc, cuộc sống, chi phí, và những kỹ năng cần thiết khi làm việc ở nước ngoài.",
    lockTime: null,
    createdAt: "2025-11-15T09:20:00.000000",
    updatedAt: "2025-11-15T09:20:00.000000"
  },
  {
    id: 8,
    userId: 2,
    fieldId: 2,
    topicId: 8,
    levelId: 2,
    postType: 'DISCUSSION',
    status: 'PUBLISHED',
    title: "Cách chuẩn bị CV cho vị trí Senior Developer",
    content: "Hướng dẫn chi tiết cách viết CV thu hút nhà tuyển dụng cho vị trí Senior Developer. Bao gồm cách trình bày kinh nghiệm, dự án, kỹ năng, và các tips để CV nổi bật.",
    lockTime: null,
    createdAt: "2025-11-14T13:15:00.000000",
    updatedAt: "2025-11-19T10:00:00.000000"
  },
  {
    id: 9,
    userId: 6,
    fieldId: 1,
    topicId: 9,
    levelId: 3,
    postType: 'QUESTION',
    status: 'PUBLISHED',
    title: "Discussion: Microservices vs Monolith",
    content: "Muốn thảo luận về ưu nhược điểm của kiến trúc Microservices so với Monolith. Các bạn nghĩ sao về việc migrate từ Monolith sang Microservices?",
    lockTime: null,
    createdAt: "2025-11-13T11:45:00.000000",
    updatedAt: "2025-11-21T16:20:00.000000"
  },
  {
    id: 10,
    userId: 4,
    fieldId: 3,
    topicId: 10,
    levelId: 1,
    postType: 'DISCUSSION',
    status: 'DRAFT',
    title: "Tips để pass technical interview",
    content: "Sau nhiều lần phỏng vấn, tôi tổng hợp các tips để pass vòng technical interview. Bao gồm cách chuẩn bị, mindset, và các câu hỏi thường gặp.",
    lockTime: null,
    createdAt: "2025-11-12T15:30:00.000000",
    updatedAt: "2025-11-18T08:45:00.000000"
  }
];

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

  // Load mock data on component mount
  useEffect(() => {
    getAllFields();
    getAllTopics();
    getAllLevels();
    setDataList(mockPosts);
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

  const handleApprove = async (postId: number, decision: 'approve' | 'reject', comment?: string) => {
    try {
      // TODO: Implement actual API call for approval
      console.log('Approving post:', postId, 'Decision:', decision, 'Comment:', comment);

      // Update local state for mock purposes
      setDataList(prev => prev.map(post =>
        post.id === postId
          ? { ...post, status: decision === 'approve' ? 'PUBLISHED' : 'LOCKED' as any }
          : post
      ));

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