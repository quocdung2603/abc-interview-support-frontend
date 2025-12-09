import React, { useEffect, useState, useCallback } from 'react';

// Import types
import { User, EloHistory, ExamResult, Field, Topic, Level, QuestionType, Post, News, Question } from '@abc-interview-support-frontend/types';

// Import hooks
import { useAuth } from '@abc-interview-support-frontend/sso-utils';

// Import components
import PersonalInfoTabs from './components/personal-info/PersonalInfoTabs';
import CommunityTabs from './components/community/CommunityTabs';
import NewsTabs from './components/news/NewsTabs';
import QuestionTabs from './components/question/QuestionTabs';
import CareerTabs from './components/career/CareerTabs';
import ExamTabs from './components/exam/ExamTabs';
import Sidebar from './components/Sidebar';
import { userService, examService, questionService, communityService, newsService } from '@abc-interview-support-frontend/services';

const UserProfile: React.FC = () => {
  // Get authenticated user
  const { user: authUser } = useAuth();

  // Dashboard state
  const [activeSection, setActiveSection] = useState<string>('personal');
  const [activeSubsection, setActiveSubsection] = useState<string>('info');

  // Convert AuthUser to User format for profile display
  const [user, setUser] = useState<User>(() => {
    if (authUser) {
      return {
        id: Number(authUser.userId),
        roleId: Number(authUser.roleId),
        roleName: authUser.roleName,
        fullName: authUser.fullName || '',
        email: authUser.email,
        passWord: '', // Not available from auth
        dateOfBirth: authUser.dateOfBirth || '',
        address: authUser.address || '',
        status: authUser.status,
        isStudying: authUser.isStudying || false,
        eloScore: authUser.eloScore || 0,
        eloRank: authUser.eloRank || 'Newbie',
        createdAt: authUser.createdAt || new Date().toISOString(),
        verifyToken: authUser.verifyToken || null,
      };
    }
    // Fallback to mock data if no auth user (shouldn't happen in normal flow)
    return {
      id: 1,
      roleId: 3,
      roleName: 'User',
      fullName: 'User',
      email: 'user@example.com',
      passWord: '',
      dateOfBirth: new Date().toISOString(),
      address: '',
      status: 'Verified',
      isStudying: false,
      eloScore: 0,
      eloRank: 'Newbie',
      createdAt: new Date().toISOString(),
    };
  });

  // Mock ELO history
  const [eloHistory, setEloHistory] = useState<EloHistory[]>([]);

  const loadEloHistory = useCallback(async () => {
    if (user.id) {
      try {
        const history = await userService.getEloHistoryById(user.id.toString());
        setEloHistory(history);
      } catch (error) {
        console.error('Error loading ELO history:', error);
        setEloHistory([]);
      }
    }
  }, [user.id]);

  // Exam results state
  const [examResults, setExamResults] = useState<ExamResult[]>([]);

  // Options state for filters
  const [fields, setFields] = useState<Field[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([]);

  const loadExamResults = useCallback(async () => {
    if (user.id) {
      try {
        const results = await examService.getExamResultByUserId(user.id.toString());
        setExamResults(results.content || results);
      } catch (error) {
        console.error('Error loading exam results:', error);
        setExamResults([]);
      }
    }
  }, [user.id]);

  // Load filter options from API
  const loadFilterOptions = useCallback(async () => {
    try {
      const [fieldsRes, levelsRes, topicsRes, questionTypesRes] = await Promise.all([
        questionService.getAllFields(),
        questionService.getAllLevels(),
        questionService.getAllTopics(),
        questionService.getAllQuestionTypes(),
      ]);

      setFields(fieldsRes.content || fieldsRes || []);
      setLevels(levelsRes.content || levelsRes || []);
      setTopics(topicsRes.content || topicsRes || []);
      setQuestionTypes(questionTypesRes.content || questionTypesRes || []);
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  }, []);

  const [posts, setPosts] = useState<Post[]>([]);

  const loadCommunityPost = useCallback(async () => {
    if (user.id) {
      try {
        const res = await communityService.getAllPost();
        let posts = res.content || [];
        posts = posts.filter((post: Post) => post.userId === user.id);
        setPosts(posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      }
    }
  }, [user.id]);

  const [news, setNews] = useState<News[]>([]);
  const loadNews = useCallback(async () => {
    if (user.id) {
      try {
        const res = await newsService.getAllNews();
        let news = res.content || [];
        console.log('User Id:', user.id);
        console.log('User News Items:', news);
        news = news.filter((newsItem: News) => newsItem.userId === user.id);
        setNews(news);
      } catch (error) {
        setNews([]);
        console.error('Error fetching news:', error);
      }
    }
  }, [user.id]);

  const [questions, setQuestions] = useState<Question[]>([]);
  const loadQuestions = useCallback(async () => {
    if (user.id) {
      try {
        const res = await questionService.getAllQuestions();
        let questions = res.content || [];
        questions = questions.filter((question: Question) => question.userId === user.id);
        setQuestions(questions);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setQuestions([]);
      }
    }
  }, [user.id]);

  // Function to reload all data
  const loadUserData = useCallback(async () => {
    await Promise.all([
      loadEloHistory(),
      loadExamResults(),
      loadFilterOptions(),
      loadCommunityPost(),
      loadNews(),
      loadQuestions(),
    ]);
  }, [loadEloHistory, loadExamResults, loadFilterOptions, loadCommunityPost, loadNews, loadQuestions]);

  // Create completed exams from exam results
  const completedExams = examResults.map(result => ({
    id: result.id, // Use result.id as unique key instead of examId
    userId: result.userId,
    examType: 'VIRTUAL' as const, // Default type
    title: `Exam ${result.examId}`,
    position: 'Unknown Position',
    fieldId: 0, // Default field
    levelId: 0, // Default level
    topicIds: [], // Empty topics
    questionTypeIds: [], // Empty question types
    questionCount: 0,
    duration: 0,
    status: 'COMPLETED' as const,
    language: 'Vietnamese',
    createdAt: result.completedAt,
    createdBy: 0,
    result: result
  }));

  // Load ELO history and exam results on component mount
  useEffect(() => {
    loadEloHistory();
    loadExamResults();
    loadFilterOptions();
    loadCommunityPost();
    loadNews();
    loadQuestions();
  }, [loadEloHistory, loadExamResults, loadFilterOptions, loadCommunityPost, loadNews, loadQuestions]);
  // Mock community data

  // Handler functions
  const handleUpdateUser = async (updatedUser: User) => {
    try {
      const res = await userService.updateUser(user.id.toString(), updatedUser);
      setUser(res);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Handle section change
  const handleSectionChange = (section: string, subsection?: string) => {
    setActiveSection(section);
    if (subsection) {
      setActiveSubsection(subsection);
    } else {
      // Set default subsection based on section
      if (section === 'personal') {
        setActiveSubsection('info');
      } else if (section === 'community') {
        setActiveSubsection('discussions');
      }
    }
  };

  // Render content based on active section and subsection
  const renderContent = () => {
    switch (activeSection) {
      case 'personal':
        switch (activeSubsection) {
          case 'info':
            return (
              <PersonalInfoTabs
                user={user}
                eloHistory={eloHistory}
                onUpdateUser={handleUpdateUser}
                showOnlyPersonalInfo={true}
              />
            );
          case 'elo':
            return (
              <PersonalInfoTabs
                user={user}
                eloHistory={eloHistory}
                onUpdateUser={handleUpdateUser}
                showOnlyEloRank={true}
              />
            );
          case 'recruiter':
            return (
              <PersonalInfoTabs
                user={user}
                eloHistory={eloHistory}
                onUpdateUser={handleUpdateUser}
                showOnlyRecruiterRegis={true}
              />
            );
          default:
            return (
              <PersonalInfoTabs
                user={user}
                eloHistory={eloHistory}
                onUpdateUser={handleUpdateUser}
                showOnlyPersonalInfo={true}
              />
            );
        }
        break;
      case 'exams':
        return (
          <ExamTabs
            completedExams={completedExams}
            fields={fields}
            levels={levels}
            topics={topics}
            questionTypes={questionTypes}
          />
        );

      case 'community':
        switch (activeSubsection) {
          case 'discussions':
            return (
              <CommunityTabs
                user={user}
                posts={posts}
                fields={fields}
                topics={topics}
                levels={levels}
                onRefresh={loadUserData}
              />
            );
          case 'questions':
            return (
              <QuestionTabs
                user={user}
                questions={questions}
                fields={fields}
                topics={topics}
                levels={levels}
                questionTypes={questionTypes}
                onRefresh={loadUserData}
              />
            );
          case 'news':
            return (
              <NewsTabs
                user={user}
                news={news}
                fields={fields}
                topics={topics}
                levels={levels}
                onRefresh={loadUserData}
              />
            );
          default:
            return (
              <CommunityTabs
                user={user}
                posts={posts}
                fields={fields}
                topics={topics}
                levels={levels}
                onRefresh={loadUserData}
              />
            );
        }

      case 'career':
        return <CareerTabs />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          activeSection={activeSection}
          activeSubsection={activeSubsection}
          onSectionChange={handleSectionChange}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="p-8">
            {/* Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;