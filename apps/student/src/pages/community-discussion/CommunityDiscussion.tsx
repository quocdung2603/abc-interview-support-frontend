import React, { useState, useEffect, useMemo } from 'react';
import CommunityHero from './components/discussion/CommunityHero';
import SearchAndFilters from './components/discussion/SearchAndFilters';
import PostsList from './components/discussion/PostsList';
import { useNavigate } from 'react-router-dom';
import { Field, Level, Post, Topic } from '@abc-interview-support-frontend/types';
import { questionService, userService, communityService } from '@abc-interview-support-frontend/services';

const CommunityDiscussion: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
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
      field: post.fieldName || (fieldData || []).find(f => f.id === post.fieldId)?.name || 'Unknown',
      level: post.levelName || (levelData || []).find(l => l.id === post.levelId)?.name || 'Unknown',
      tags: [], // TODO: Generate from topic or other logic
      isAdminQuestion: post.userId === 1,
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
    navigate(`/community-discussion-details/${postId}`);
  };

  useEffect(() => {
    const LoadData = async () => {
      try {
        const [resFields, resTopics, resLevels, resPosts] = await Promise.all([
          questionService.getAllFields(),
          questionService.getAllTopics(),
          questionService.getAllLevels(),
          communityService.getAllPost()
        ]);

        setFieldData(resFields?.content || []);
        setTopicData(resTopics?.content || []);
        setLevelData(resLevels?.content || []);

        // Set posts from API
        const postsData = (resPosts?.content || resPosts || []) as Post[];
        console.log('Fetched posts:', postsData);
        setPosts(postsData);

        // Fetch user data for all unique userIds in posts
        const uniqueUserIds = [...new Set(postsData.map(post => post.userId))];
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
        setPosts([]);
        setUserData({});
      }
    };
    LoadData();
  }, []);

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
