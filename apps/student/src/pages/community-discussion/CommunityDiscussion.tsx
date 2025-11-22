import React, { useState, useEffect } from 'react';
import CommunityHero from './components/discussion/CommunityHero';
import SearchAndFilters from './components/discussion/SearchAndFilters';
import CommunityStats from './components/discussion/CommunityStats';
import PostsList from './components/discussion/PostsList';
import { useNavigate } from 'react-router-dom';

interface Field {
  fieldId: string;
  name: string;
  description?: string;
}

interface Level {
  levelId: string;
  name: 'Fresher' | 'Junior' | 'Senior' | 'Middle';
  description?: string;
}

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

// Mock data
const mockFields: Field[] = [
  {
    fieldId: 'frontend',
    name: 'Frontend',
    description: 'React, Angular, Vue.js',
  },
  {
    fieldId: 'backend',
    name: 'Backend',
    description: 'Node.js, Java, Python',
  },
  {
    fieldId: 'fullstack',
    name: 'Fullstack',
    description: 'Full-stack development',
  },
  {
    fieldId: 'mobile',
    name: 'Mobile',
    description: 'React Native, Flutter, iOS, Android',
  },
  {
    fieldId: 'devops',
    name: 'DevOps',
    description: 'CI/CD, Docker, Kubernetes',
  },
  {
    fieldId: 'tester',
    name: 'Tester',
    description: 'Manual & Automation Testing',
  },
  {
    fieldId: 'ba',
    name: 'Business Analyst',
    description: 'Requirements Analysis',
  },
  {
    fieldId: 'bridge',
    name: 'Bridge Engineer',
    description: 'Communication & Technical Bridge',
  },
];

const mockLevels: Level[] = [
  {
    levelId: 'fresher',
    name: 'Fresher',
    description: '0-1 year experience',
  },
  {
    levelId: 'junior',
    name: 'Junior',
    description: '1-3 years experience',
  },
  {
    levelId: 'middle',
    name: 'Middle',
    description: '3-5 years experience',
  },
  {
    levelId: 'senior',
    name: 'Senior',
    description: '5+ years experience',
  },
];

const mockPosts: DiscussionPost[] = [
  {
    id: '1',
    title: 'Làm thế nào để chuẩn bị tốt cho phỏng vấn React Developer?',
    content:
      'Câu hỏi này dành cho các bạn đang chuẩn bị phỏng vấn React Developer. Hãy chia sẻ kinh nghiệm, tips và những câu hỏi thường gặp để giúp đỡ cộng đồng.',
    author: 'Admin ABC Interview',
    authorAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    createdAt: '2 giờ trước',
    likes: 24,
    replies: 12,
    field: 'Frontend',
    level: 'Junior',
    tags: ['React', 'Interview', 'JavaScript', 'Hooks'],
    isLiked: false,
    isBookmarked: true,
    isAdminQuestion: true,
  },
  {
    id: '2',
    title: 'Backend Developer cần những kỹ năng gì để phỏng vấn thành công?',
    content:
      'Phỏng vấn Backend Developer thường tập trung vào những kỹ năng nào? System Design, Database, API Design hay Microservices? Các bạn hãy chia sẻ kinh nghiệm của mình.',
    author: 'Admin ABC Interview',
    authorAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    createdAt: '4 giờ trước',
    likes: 56,
    replies: 28,
    field: 'Backend',
    level: 'Middle',
    tags: ['Backend', 'System Design', 'Database', 'Microservices'],
    isLiked: true,
    isBookmarked: false,
    isAdminQuestion: true,
  },
  {
    id: '3',
    title: 'Những sai lầm thường gặp trong phỏng vấn mà Fresher cần tránh',
    content:
      'Fresher thường mắc những sai lầm gì trong quá trình phỏng vấn? Cách chuẩn bị tâm lý, kỹ năng mềm và technical skills như thế nào? Mọi người hãy chia sẻ để giúp các bạn mới.',
    author: 'Admin ABC Interview',
    authorAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    createdAt: '6 giờ trước',
    likes: 89,
    replies: 45,
    field: 'Career',
    level: 'Fresher',
    tags: ['Tips', 'Fresher', 'Soft Skills', 'Communication'],
    isLiked: false,
    isBookmarked: true,
  },
  {
    id: '4',
    title: 'Roadmap học Flutter cho người mới bắt đầu',
    content:
      'Mình đang muốn chuyển sang Mobile Development với Flutter. Các senior có thể suggest roadmap học và các resources hay không?',
    author: 'Phạm Thị D',
    authorAvatar:
      'https://images.unsplash.com/photo-1494790108755-2616b79e217c?w=40&h=40&fit=crop&crop=face',
    createdAt: '8 giờ trước',
    likes: 32,
    replies: 18,
    field: 'Mobile',
    level: 'Fresher',
    tags: ['Flutter', 'Mobile', 'Learning', 'Roadmap'],
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: '5',
    title: 'DevOps Engineer cần skill gì để advance career?',
    content:
      'Mình đang làm DevOps được 3 năm, chủ yếu với Docker và Jenkins. Muốn advance lên Senior thì cần học thêm gì? Kubernetes có quan trọng không?',
    author: 'Hoàng Văn E',
    authorAvatar:
      'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=40&h=40&fit=crop&crop=face',
    createdAt: '1 ngày trước',
    likes: 67,
    replies: 34,
    field: 'DevOps',
    level: 'Middle',
    tags: ['DevOps', 'Kubernetes', 'Career', 'Skills'],
    isLiked: true,
    isBookmarked: true,
  },
];

const CommunityDiscussion: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<DiscussionPost[]>(mockPosts);
  const [filteredPosts, setFilteredPosts] =
    useState<DiscussionPost[]>(mockPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedField, setSelectedField] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [loading, setLoading] = useState(false);

  // Filter posts based on search and filters
  useEffect(() => {
    let filtered = posts;

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Field filter
    if (selectedField !== 'all') {
      const fieldName = mockFields.find(
        (f) => f.fieldId === selectedField
      )?.name;
      if (fieldName) {
        filtered = filtered.filter((post) => post.field === fieldName);
      }
    }

    // Level filter
    if (selectedLevel !== 'all') {
      const levelName = mockLevels.find(
        (l) => l.levelId === selectedLevel
      )?.name;
      if (levelName) {
        filtered = filtered.filter((post) => post.level === levelName);
      }
    }

    setFilteredPosts(filtered);
  }, [posts, searchQuery, selectedField, selectedLevel]);

  const handleLike = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          }
          : post
      )
    );
  };

  const handleBookmark = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, isBookmarked: !post.isBookmarked }
          : post
      )
    );
  };

  const handlePostClick = (postId: string) => {
    console.log('Navigate to post:', postId);
    navigate(`/community-discussion-details/${postId}`);
  };

  const handleLoadMore = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <CommunityHero totalQuestions={1234} activeParticipants={567} />

      {/* Main Content */}
      <div className="section-padding">
        <div className="container-center">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="sticky top-24 space-y-4">
                {/* Search and Filters */}
                <SearchAndFilters
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedField={selectedField}
                  onFieldChange={setSelectedField}
                  selectedLevel={selectedLevel}
                  onLevelChange={setSelectedLevel}
                  fields={mockFields}
                  levels={mockLevels}
                />

                {/* Community Stats */}
                <CommunityStats
                  totalQuestions={1234}
                  activeParticipants={567}
                  questionsToday={filteredPosts.length}
                />
              </div>
            </div>

            {/* Posts List */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                  Thảo luận gần đây
                </h2>
                <p className="text-gray-600">
                  {filteredPosts.length} bài viết
                  {searchQuery && ` phù hợp với "${searchQuery}"`}
                  {selectedField !== 'all' &&
                    ` trong lĩnh vực ${mockFields.find((f) => f.fieldId === selectedField)
                      ?.name
                    }`}
                  {selectedLevel !== 'all' &&
                    ` cấp độ ${mockLevels.find((l) => l.levelId === selectedLevel)
                      ?.name
                    }`}
                </p>
              </div>

              <PostsList
                posts={filteredPosts}
                loading={loading}
                onLike={handleLike}
                onBookmark={handleBookmark}
                onPostClick={handlePostClick}
                onLoadMore={handleLoadMore}
                hasMore={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityDiscussion;
