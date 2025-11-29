import { useMemo, useState, useEffect } from 'react';
import { CommunityHeader, CommunityTable, CommunityToolbar, CommunityPreviewDrawer, CommunityFormDrawer } from './components/community';
import { Post } from '@abc-interview-support-frontend/types';

// Mock data for testing
const mockPosts: Post[] = [
  {
    id: 1,
    userId: 1,
    title: "Hướng dẫn phỏng vấn Frontend Developer",
    content: "Bài viết này sẽ hướng dẫn các bạn cách chuẩn bị cho vị trí Frontend Developer. Bao gồm HTML, CSS, JavaScript, React, Vue.js và các framework hiện đại khác.",
    lockTime: null,
    createdAt: "2025-11-20T10:30:00.000000",
    updatedAt: "2025-11-20T10:30:00.000000"
  },
  {
    id: 2,
    userId: 2,
    title: "Kinh nghiệm làm việc tại công ty công nghệ",
    content: "Sau 2 năm làm việc tại một công ty công nghệ lớn, tôi muốn chia sẻ những kinh nghiệm thực tế về môi trường làm việc, văn hóa công ty, và cách thăng tiến trong sự nghiệp.",
    lockTime: null,
    createdAt: "2025-11-19T14:20:00.000000",
    updatedAt: "2025-11-21T09:15:00.000000"
  },
  {
    id: 3,
    userId: 3,
    title: "Locked Post Example",
    content: "This post is locked for commenting. You can only view existing comments.",
    lockTime: "2025-11-25T15:35:25.230932",
    createdAt: "2025-11-24T15:35:25.230932",
    updatedAt: "2025-11-24T15:35:25.230932"
  },
  {
    id: 4,
    userId: 1,
    title: "Cách học Data Structures and Algorithms hiệu quả",
    content: "DSA là nền tảng quan trọng cho mọi developer. Bài viết này sẽ hướng dẫn cách học DSA một cách có hệ thống, từ cơ bản đến nâng cao, kèm theo các tài liệu và bài tập thực hành.",
    lockTime: null,
    createdAt: "2025-11-18T08:45:00.000000",
    updatedAt: "2025-11-18T08:45:00.000000"
  },
  {
    id: 5,
    userId: 4,
    title: "Review sách 'Clean Code' - Robert C. Martin",
    content: "Sau khi đọc xong cuốn sách Clean Code, tôi muốn review và chia sẻ những điều học được. Cuốn sách này thực sự thay đổi cách tôi viết code và tư duy về programming.",
    lockTime: null,
    createdAt: "2025-11-17T16:10:00.000000",
    updatedAt: "2025-11-20T11:30:00.000000"
  },
  {
    id: 6,
    userId: 5,
    title: "Hỏi đáp về lương và phúc lợi trong ngành IT",
    content: "Thread hỏi đáp về mức lương, phúc lợi, thưởng trong các công ty IT Việt Nam. Mọi người có thể share kinh nghiệm và thông tin thực tế để tham khảo.",
    lockTime: null,
    createdAt: "2025-11-16T12:00:00.000000",
    updatedAt: "2025-11-22T14:45:00.000000"
  },
  {
    id: 7,
    userId: 3,
    title: "Chia sẻ kinh nghiệm đi onsite",
    content: "Đã có kinh nghiệm đi onsite 6 tháng tại Singapore. Muốn chia sẻ về văn hóa làm việc, cuộc sống, chi phí, và những kỹ năng cần thiết khi làm việc ở nước ngoài.",
    lockTime: null,
    createdAt: "2025-11-15T09:20:00.000000",
    updatedAt: "2025-11-15T09:20:00.000000"
  },
  {
    id: 8,
    userId: 2,
    title: "Cách chuẩn bị CV cho vị trí Senior Developer",
    content: "Hướng dẫn chi tiết cách viết CV thu hút nhà tuyển dụng cho vị trí Senior Developer. Bao gồm cách trình bày kinh nghiệm, dự án, kỹ năng, và các tips để CV nổi bật.",
    lockTime: null,
    createdAt: "2025-11-14T13:15:00.000000",
    updatedAt: "2025-11-19T10:00:00.000000"
  },
  {
    id: 9,
    userId: 6,
    title: "Discussion: Microservices vs Monolith",
    content: "Muốn thảo luận về ưu nhược điểm của kiến trúc Microservices so với Monolith. Các bạn nghĩ sao về việc migrate từ Monolith sang Microservices?",
    lockTime: null,
    createdAt: "2025-11-13T11:45:00.000000",
    updatedAt: "2025-11-21T16:20:00.000000"
  },
  {
    id: 10,
    userId: 4,
    title: "Tips để pass technical interview",
    content: "Sau nhiều lần phỏng vấn, tôi tổng hợp các tips để pass vòng technical interview. Bao gồm cách chuẩn bị, mindset, và các câu hỏi thường gặp.",
    lockTime: null,
    createdAt: "2025-11-12T15:30:00.000000",
    updatedAt: "2025-11-18T08:45:00.000000"
  }
];

const CommunityManagement = () => {
  const [searchText, setSearchText] = useState('');
  const [dataList, setDataList] = useState<Post[]>([]);
  const [selectedRowKeys] = useState<React.Key[]>([]);
  const [previewDrawerOpen, setPreviewDrawerOpen] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Load mock data on component mount
  useEffect(() => {
    setDataList(mockPosts);
  }, []);

  const filteredData = useMemo(() => {
    return dataList.filter((item) => {
      const matchesSearch = item?.title
        ?.toLowerCase()
        .includes(searchText.toLowerCase());
      return matchesSearch;
    });
  }, [dataList, searchText]);

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
    // For now, just close the form
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
          selectedRowKeys={selectedRowKeys}
        />

        <CommunityTable
          dataList={filteredData}
          onPreview={handlePreview}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <CommunityPreviewDrawer
        open={previewDrawerOpen}
        onClose={handlePreviewDrawerClose}
        post={selectedPost}
      />

      <CommunityFormDrawer
        open={formVisible}
        onClose={handleFormClose}
        data={selectedPost}
        onSuccess={handleFormSuccess}
      />
    </div >
  );
};

export default CommunityManagement;