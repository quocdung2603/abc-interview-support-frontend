import React, { useState, useEffect, useMemo } from 'react';
import CommunityHero from './components/discussion/CommunityHero';
import SearchAndFilters from './components/discussion/SearchAndFilters';
import PostsList from './components/discussion/PostsList';
import { useNavigate } from 'react-router-dom';
import { Field, Level, Post, Topic } from '@abc-interview-support-frontend/types';
import { questionService, userService } from '@abc-interview-support-frontend/services';

const mockPosts: Post[] = [
  {
    id: 1,
    userId: 1,
    fieldId: 1,
    topicId: 1,
    levelId: 1,
    postType: 'DISCUSSION',
    status: 'PUBLISHED',
    title: 'Làm thế nào để chuẩn bị tốt cho phỏng vấn React Developer?',
    content:
      'Câu hỏi này dành cho các bạn đang chuẩn bị phỏng vấn React Developer. Hãy chia sẻ kinh nghiệm, tips và những câu hỏi thường gặp để giúp đỡ cộng đồng.',
    lockTime: null,
    createdAt: '2025-11-30T10:30:00.000000',
    updatedAt: '2025-11-30T10:30:00.000000',
  },
  {
    id: 2,
    userId: 2,
    fieldId: 2,
    topicId: 2,
    levelId: 2,
    postType: 'DISCUSSION',
    status: 'PUBLISHED',
    title: 'Backend Developer cần những kỹ năng gì để phỏng vấn thành công?',
    content:
      'Phỏng vấn Backend Developer thường tập trung vào những kỹ năng nào? System Design, Database, API Design hay Microservices? Các bạn hãy chia sẻ kinh nghiệm của mình.',
    lockTime: null,
    createdAt: '2025-11-30T08:30:00.000000',
    updatedAt: '2025-11-30T08:30:00.000000',
  },
  {
    id: 3,
    userId: 3,
    fieldId: 3,
    topicId: 3,
    levelId: 1,
    postType: 'DISCUSSION',
    status: 'PUBLISHED',
    title: 'Những sai lầm thường gặp trong phỏng vấn mà Fresher cần tránh',
    content:
      'Fresher thường mắc những sai lầm gì trong quá trình phỏng vấn? Cách chuẩn bị tâm lý, kỹ năng mềm và technical skills như thế nào? Mọi người hãy chia sẻ để giúp các bạn mới.',
    lockTime: null,
    createdAt: '2025-11-30T06:30:00.000000',
    updatedAt: '2025-11-30T06:30:00.000000',
  },
  {
    id: 4,
    userId: 4,
    fieldId: 4,
    topicId: 4,
    levelId: 1,
    postType: 'DISCUSSION',
    status: 'PUBLISHED',
    title: 'Roadmap học Flutter cho người mới bắt đầu',
    content:
      'Mình đang muốn chuyển sang Mobile Development với Flutter. Các senior có thể suggest roadmap học và các resources hay không?',
    lockTime: null,
    createdAt: '2025-11-30T04:30:00.000000',
    updatedAt: '2025-11-30T04:30:00.000000',
  },
  {
    id: 5,
    userId: 5,
    fieldId: 5,
    topicId: 5,
    levelId: 2,
    postType: 'DISCUSSION',
    status: 'PUBLISHED',
    title: 'DevOps Engineer cần skill gì để advance career?',
    content:
      'Mình đang làm DevOps được 3 năm, chủ yếu với Docker và Jenkins. Muốn advance lên Senior thì cần học thêm gì? Kubernetes có quan trọng không?',
    lockTime: null,
    createdAt: '2025-11-29T10:30:00.000000',
    updatedAt: '2025-11-29T10:30:00.000000',
  },
  {
    id: 6,
    userId: 6,
    fieldId: 6,
    topicId: 6,
    levelId: 2,
    postType: 'DISCUSSION',
    status: 'PUBLISHED',
    title: 'DevOps Engineer cần skill gì để advance career?',
    content:
      'Mình đang làm DevOps được 3 năm, chủ yếu với Docker và Jenkins. Muốn advance lên Senior thì cần học thêm gì? Kubernetes có quan trọng không?',
    lockTime: null,
    createdAt: '2025-11-29T10:30:00.000000',
    updatedAt: '2025-11-29T10:30:00.000000',
  },
  {
    id: 7,
    userId: 5,
    fieldId: 5,
    topicId: 5,
    levelId: 2,
    postType: 'DISCUSSION',
    status: 'PUBLISHED',
    title: 'DevOps Engineer cần skill gì để advance career?',
    content:
      'Mình đang làm DevOps được 3 năm, chủ yếu với Docker và Jenkins. Muốn advance lên Senior thì cần học thêm gì? Kubernetes có quan trọng không?',
    lockTime: null,
    createdAt: '2025-11-29T10:30:00.000000',
    updatedAt: '2025-11-29T10:30:00.000000',
  },
  {
    id: 8,
    userId: 5,
    fieldId: 5,
    topicId: 5,
    levelId: 2,
    postType: 'DISCUSSION',
    status: 'PUBLISHED',
    title: 'DevOps Engineer cần skill gì để advance career?',
    content:
      'Mình đang làm DevOps được 3 năm, chủ yếu với Docker và Jenkins. Muốn advance lên Senior thì cần học thêm gì? Kubernetes có quan trọng không?',
    lockTime: null,
    createdAt: '2025-11-29T10:30:00.000000',
    updatedAt: '2025-11-29T10:30:00.000000',
  },
  {
    id: 9,
    userId: 5,
    fieldId: 5,
    topicId: 5,
    levelId: 2,
    postType: 'DISCUSSION',
    status: 'PUBLISHED',
    title: 'DevOps Engineer cần skill gì để advance career?',
    content:
      'Mình đang làm DevOps được 3 năm, chủ yếu với Docker và Jenkins. Muốn advance lên Senior thì cần học thêm gì? Kubernetes có quan trọng không?',
    lockTime: null,
    createdAt: '2025-11-29T10:30:00.000000',
    updatedAt: '2025-11-29T10:30:00.000000',
  },
  {
    id: 10,
    userId: 5,
    fieldId: 5,
    topicId: 5,
    levelId: 2,
    postType: 'DISCUSSION',
    status: 'PUBLISHED',
    title: 'DevOps Engineer cần skill gì để advance career?',
    content:
      'Mình đang làm DevOps được 3 năm, chủ yếu với Docker và Jenkins. Muốn advance lên Senior thì cần học thêm gì? Kubernetes có quan trọng không?',
    lockTime: null,
    createdAt: '2025-11-29T10:30:00.000000',
    updatedAt: '2025-11-29T10:30:00.000000',
  },
];

const CommunityDiscussion: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [fieldData, setFieldData] = useState<Field[]>([]);
  const [topicData, setTopicData] = useState<Topic[]>([]);
  const [levelData, setLevelData] = useState<Level[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedField, setSelectedField] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedPostType, setSelectedPostType] = useState('all');
  const [userData, setUserData] = useState<Record<number, any>>({});

  // Convert Post to enriched Post format for UI components
  const enrichPostsForUI = (posts: Post[]): Post[] => {
    return posts.map(post => ({
      ...post,
      // UI-specific fields
      author: userData[post.userId]?.fullName || 'User',
      authorAvatar: userData[post.userId]?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      likes: Math.floor(Math.random() * 100), // Mock data
      replies: Math.floor(Math.random() * 50), // Mock data
      field: (fieldData || []).find(f => f.id === post.fieldId)?.name || 'Unknown',
      level: (levelData || []).find(l => l.id === post.levelId)?.name || 'Unknown',
      tags: [], // TODO: Generate from topic or other logic
      isLiked: false,
      isBookmarked: false,
      isAdminQuestion: post.userId === 1, // Mock admin check
    }));
  };

  // Filter posts based on search and filters using useMemo for performance
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Field filter
    if (selectedField !== 'all') {
      const fieldId = Number(selectedField);
      filtered = filtered.filter((post) => post.fieldId === fieldId);
    }

    // Topic filter
    if (selectedTopic !== 'all') {
      const topicId = Number(selectedTopic);
      filtered = filtered.filter((post) => post.topicId === topicId);
    }

    // Level filter
    if (selectedLevel !== 'all') {
      const levelId = Number(selectedLevel);
      filtered = filtered.filter((post) => post.levelId === levelId);
    }

    // Post Type filter
    if (selectedPostType !== 'all') {
      filtered = filtered.filter((post) => post.postType === selectedPostType);
    }

    return filtered;
  }, [posts, searchQuery, selectedField, selectedTopic, selectedLevel, selectedPostType]);

  // Create enriched posts for UI with memoization
  const enrichedFilteredPosts = useMemo(() => {
    return enrichPostsForUI(filteredPosts);
  }, [filteredPosts, fieldData, levelData, userData]);

  const handlePostClick = (postId: number) => {
    console.log('Navigate to post:', postId);
    navigate(`/community-discussion-details/${postId}`);
  };

  useEffect(() => {
    const LoadData = async () => {
      try {
        const [resFields, resTopics, resLevels] = await Promise.all([
          questionService.getAllFields(),
          questionService.getAllTopics(),
          questionService.getAllLevels()
        ]);

        setFieldData(resFields?.content || []);
        setTopicData(resTopics?.content || []);
        setLevelData(resLevels?.content || []);

        // Fetch user data for all unique userIds in posts
        const uniqueUserIds = [...new Set(posts.map(post => post.userId))];
        const userPromises = uniqueUserIds.map(userId =>
          userService.getUserById(userId.toString()).catch(() => null)
        );

        const userResults = await Promise.all(userPromises);
        const userMap: Record<number, any> = {};

        uniqueUserIds.forEach((userId, index) => {
          if (userResults[index]) {
            userMap[userId] = userResults[index].data || userResults[index];
          }
        });

        setUserData(userMap);
      } catch (error) {
        console.error('Error loading data:', error);
        // Set empty arrays as fallback
        setFieldData([]);
        setTopicData([]);
        setLevelData([]);
        setUserData({});
      }
    };
    LoadData();
  }, [posts]);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <CommunityHero />

      {/* Main Content */}
      <div className="container-center">
        {/* Search and Filters - Above Posts */}
        <div className="my-6">
          <SearchAndFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedField={selectedField}
            onFieldChange={setSelectedField}
            selectedTopic={selectedTopic}
            onTopicChange={setSelectedTopic}
            selectedLevel={selectedLevel}
            onLevelChange={setSelectedLevel}
            selectedPostType={selectedPostType}
            onPostTypeChange={setSelectedPostType}
            fields={fieldData}
            topics={topicData}
            levels={levelData}
          />
        </div>

        {/* Posts List */}
        <div>
          <PostsList
            posts={enrichedFilteredPosts}
            onPostClick={handlePostClick}
            fields={fieldData}
            topics={topicData}
            levels={levelData}
          />
        </div>
      </div>
    </div>
  );
};

export default CommunityDiscussion;
