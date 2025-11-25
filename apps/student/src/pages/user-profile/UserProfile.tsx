import React, { useState } from 'react';

// Import types
import { User, EloHistory } from '@abc-interview-support-frontend/types';

// Import hooks
import { useAuth } from '@abc-interview-support-frontend/sso-utils';

// Import components
import PersonalInfoTabs from './components/personal-info/PersonalInfoTabs';
import CVApplicationTabs from './components/cv-application/CVApplicationTabs';
import CommunityTabs from './components/community/CommunityTabs';
import CareerTabs from './components/career/CareerTabs';
import TabNavigation from './components/TabNavigation';
import ExamTabs from './components/exam/ExamTabs';
import { userService } from '@abc-interview-support-frontend/services';

const UserProfile: React.FC = () => {
  // Get authenticated user
  const { user: authUser } = useAuth();

  // Tab state
  const [activeTab, setActiveTab] = useState<string>('personal');

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
        createdAt: new Date().toISOString(),
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
  const [eloHistory] = useState<EloHistory[]>([
    {
      eloHistoryId: 'elo-001',
      userId: '1',
      createdAt: new Date('2024-01-01'),
      action: 'Hoàn thành bài kiểm tra JavaScript',
      points: 50,
      description: 'Đạt 85% trong bài kiểm tra JavaScript Fundamentals',
      examId: 'exam-001',
      examTitle: 'JavaScript Fundamentals',
    },
    {
      eloHistoryId: 'elo-002',
      userId: '1',
      createdAt: new Date('2024-01-03'),
      action: 'Trả lời câu hỏi cộng đồng',
      points: 15,
      description: 'Câu trả lời về React Hooks được vote up',
      examId: null,
      examTitle: null,
    },
    {
      eloHistoryId: 'elo-003',
      userId: '1',
      createdAt: new Date('2024-01-05'),
      action: 'Hoàn thành bài kiểm tra React',
      points: 75,
      description: 'Đạt 92% trong bài kiểm tra React Advanced',
      examId: 'exam-002',
      examTitle: 'React Advanced',
    },
  ] as any);

  // Mock exam data
  const [completedExams] = useState([
    {
      examId: 'exam-001',
      examType: 'Virtual' as const,
      title: 'JavaScript Fundamentals',
      topics: JSON.stringify(['Variables', 'Functions', 'Objects', 'Arrays']),
      questionTypes: JSON.stringify(['Multiple Choice', 'Code']),
      questionCount: 25,
      duration: 45,
      status: 'Completed' as const,
      language: 'Vietnamese',
      createdAt: new Date('2023-12-01'),
      createdBy: 'system',
      result: {
        resultId: 'result-001',
        examId: 'exam-001',
        userId: '1',
        score: 85,
        passStatus: true,
        feedback: 'Excellent understanding of JavaScript fundamentals',
        completedAt: new Date('2024-01-01'),
      },
    },
    {
      examId: 'exam-002',
      examType: 'Virtual' as const,
      title: 'React Advanced Concepts',
      topics: JSON.stringify(['Hooks', 'Context', 'Performance', 'Testing']),
      questionTypes: JSON.stringify(['Multiple Choice', 'Code', 'Essay']),
      questionCount: 30,
      duration: 60,
      status: 'Completed' as const,
      language: 'Vietnamese',
      createdAt: new Date('2023-12-15'),
      createdBy: 'system',
      result: {
        resultId: 'result-002',
        examId: 'exam-002',
        userId: '1',
        score: 92,
        passStatus: true,
        feedback: 'Outstanding performance in advanced React concepts',
        completedAt: new Date('2024-01-05'),
      },
    },
  ] as any);

  const [registeredExams] = useState([
    {
      examId: 'exam-003',
      examType: 'Virtual' as const,
      title: 'Node.js Backend Development',
      topics: JSON.stringify(['Express', 'Database', 'Authentication', 'APIs']),
      questionTypes: JSON.stringify(['Multiple Choice', 'Code']),
      questionCount: 50,
      duration: 90,
      status: 'Active' as const,
      language: 'Vietnamese',
      createdAt: new Date('2024-01-01'),
      createdBy: 'system',
      registration: {
        registrationId: 'reg-001',
        examId: 'exam-003',
        userId: '1',
        registeredAt: new Date('2024-01-10'),
        scheduledAt: new Date('2024-01-20'),
        status: 'Confirmed' as const,
      },
    },
  ] as any);

  const [upcomingExams] = useState([
    {
      examId: 'exam-004',
      examType: 'Virtual' as const,
      title: 'Database Design & SQL',
      topics: JSON.stringify([
        'SQL Queries',
        'Database Design',
        'Normalization',
        'Indexing',
      ]),
      questionTypes: JSON.stringify(['Multiple Choice', 'SQL Code']),
      questionCount: 40,
      duration: 75,
      status: 'Active' as const,
      language: 'Vietnamese',
      createdAt: new Date('2024-01-15'),
      createdBy: 'system',
      registration: {
        registrationId: 'reg-002',
        examId: 'exam-004',
        userId: '1',
        registeredAt: new Date('2024-01-20'),
        scheduledAt: new Date('2024-01-25'),
        status: 'Pending' as const,
      },
    },
  ] as any);

  // Mock CV and application data
  const [uploadedCVs, setUploadedCVs] = useState([
    {
      id: 'cv-001',
      fileName: 'Nguyen_Minh_Tuan_CV.pdf',
      uploadDate: new Date('2024-01-05'),
      fileSize: 2.3,
      isActive: true,
    },
    {
      id: 'cv-002',
      fileName: 'Nguyen_Minh_Tuan_EN.pdf',
      uploadDate: new Date('2024-01-08'),
      fileSize: 2.1,
      isActive: false,
    },
  ]);

  const [appliedCompanies] = useState([
    {
      id: 'app-001',
      companyName: 'Tech Innovations Co.',
      position: 'Frontend Developer',
      appliedDate: new Date('2024-01-10'),
      status: 'Interview' as const,
      cvUsed: 'Nguyen_Minh_Tuan_CV.pdf',
    },
    {
      id: 'app-002',
      companyName: 'Startup Hub Vietnam',
      position: 'Full Stack Developer',
      appliedDate: new Date('2024-01-12'),
      status: 'Reviewed' as const,
      cvUsed: 'Nguyen_Minh_Tuan_EN.pdf',
    },
  ]);

  // Mock community data
  const [newsItems] = useState([
    {
      id: 'news-001',
      title: 'Top 10 câu hỏi phỏng vấn JavaScript thường gặp năm 2024',
      summary:
        'Tổng hợp các câu hỏi phỏng vấn JavaScript phổ biến nhất mà các nhà tuyển dụng thường hỏi.',
      publishedDate: new Date('2024-01-15'),
      source: 'VietnamWorks',
      readTime: 5,
      category: 'Phỏng vấn',
      isBookmarked: false,
    },
    {
      id: 'news-002',
      title: 'Xu hướng tuyển dụng IT 2024: Remote work và AI skills',
      summary:
        'Khảo sát mới nhất về xu hướng tuyển dụng trong ngành công nghệ thông tin.',
      publishedDate: new Date('2024-01-12'),
      source: 'ITViec',
      readTime: 8,
      category: 'Xu hướng',
      isBookmarked: true,
    },
  ]);

  const [discussions] = useState([
    {
      id: 'discussion-001',
      title: 'Tips để vượt qua vòng phỏng vấn technical của các công ty lớn',
      content:
        'Mình vừa pass được vòng phỏng vấn technical của một công ty outsourcing lớn. Chia sẻ một số kinh nghiệm...',
      author: 'Nguyễn Văn A',
      createdDate: new Date('2024-01-14'),
      replies: 23,
      likes: 45,
      views: 234,
      tags: ['phỏng vấn', 'technical', 'kinh nghiệm'],
      isParticipated: false,
    },
    {
      id: 'discussion-002',
      title: 'Làm sao để chuẩn bị portfolio tốt cho Frontend Developer?',
      content:
        'Mình đang chuẩn bị portfolio để apply vào vị trí Frontend Dev. Các bạn có thể chia sẻ kinh nghiệm...',
      author: 'Trần Thị B',
      createdDate: new Date('2024-01-13'),
      replies: 18,
      likes: 32,
      views: 156,
      tags: ['portfolio', 'frontend', 'tư vấn'],
      isParticipated: true,
    },
  ]);

  const [communityQuestions] = useState([
    {
      id: 'question-001',
      title: 'Sự khác biệt giữa var, let và const trong JavaScript?',
      content:
        'Em đang học JavaScript và thấy có 3 cách khai báo biến. Các anh chị có thể giải thích rõ sự khác biệt...',
      author: 'Lê Minh C',
      createdDate: new Date('2024-01-15'),
      answers: 7,
      votes: 12,
      difficulty: 'Easy' as const,
      category: 'JavaScript',
      tags: ['javascript', 'variables', 'es6'],
      isSolved: true,
    },
    {
      id: 'question-002',
      title: 'Cách implement Binary Search Tree hiệu quả nhất?',
      content:
        'Em đang làm bài tập về cấu trúc dữ liệu. Ai có thể hướng dẫn cách implement BST một cách tối ưu...',
      author: 'Phạm Văn D',
      createdDate: new Date('2024-01-14'),
      answers: 3,
      votes: 8,
      difficulty: 'Hard' as const,
      category: 'Data Structures',
      tags: ['algorithms', 'tree', 'data-structures'],
      isSolved: false,
    },
  ]);

  // Handler functions
  const handleUpdateUser = async (updatedUser: User) => {
    try {
      const res = await userService.updateUser(user.id.toString(), updatedUser);
      setUser(res);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleUploadCV = (cvFile: File) => {
    const newCV = {
      id: `cv-${Date.now()}`,
      fileName: cvFile.name,
      uploadDate: new Date(),
      fileSize: cvFile.size,
      isActive: false,
    };
    setUploadedCVs((prev) => [...prev, newCV]);
  };

  const handleDeleteCV = (cvId: string) => {
    setUploadedCVs((prev) => prev.filter((cv) => cv.id !== cvId));
  };

  const handleSetActiveCV = (cvId: string) => {
    setUploadedCVs((prev) =>
      prev.map((cv) => ({
        ...cv,
        isActive: cv.id === cvId,
      }))
    );
  };

  // Tab configuration with badges
  const tabs = [
    {
      id: 'personal',
      label: 'Thông tin cá nhân',
      icon: '👤',
      description: '',
      badge: undefined,
    },
    {
      id: 'exams',
      label: 'Bài kiểm tra',
      icon: '📝',
      description: '',
      badge: upcomingExams.length || undefined,
    },
    {
      id: 'cv',
      label: 'CV & Ứng tuyển',
      icon: '📄',
      description: '',
      badge:
        appliedCompanies.filter((app) => app.status === 'Interview').length ||
        undefined,
    },
    {
      id: 'community',
      label: 'Cộng đồng',
      icon: '💬',
      description: '',
      badge: discussions.length || undefined,
    },
    {
      id: 'career',
      label: 'Định hướng nghề nghiệp',
      icon: '🎯',
      description: '',
      badge: undefined,
    },
  ];

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <PersonalInfoTabs
            user={user as any}
            eloHistory={eloHistory as any}
            onUpdateUser={handleUpdateUser as any}
          />
        );

      case 'exams':
        return (
          <ExamTabs
            completedExams={completedExams}
            registeredExams={registeredExams}
            upcomingExams={upcomingExams}
          />
        );

      case 'cv':
        return (
          <CVApplicationTabs
            uploadedCVs={uploadedCVs as any}
            appliedCompanies={appliedCompanies as any}
            onUploadCV={handleUploadCV}
            onDeleteCV={handleDeleteCV}
            onSetActiveCV={handleSetActiveCV}
          />
        );

      case 'community':
        return (
          <CommunityTabs
            newsItems={newsItems}
            discussions={discussions}
            questions={communityQuestions}
            onBookmarkNews={() => { alert('Bookmark news feature coming soon!'); }}
            onJoinDiscussion={() => { alert('Join discussion feature coming soon!'); }}
            onAnswerQuestion={() => { alert('Answer question feature coming soon!'); }}
            onVoteQuestion={() => { alert('Vote question feature coming soon!'); }}
          />
        );

      case 'career':
        return <CareerTabs />;

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-neutral-50)',
        padding: 'var(--spacing-lg)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <h1
            className="text-heading-1"
            style={{
              margin: '0 0 var(--spacing-sm) 0',
              background:
                'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Hồ sơ cá nhân
          </h1>
          <p
            style={{
              margin: 0,
              color: 'var(--color-neutral-600)',
              fontSize: '1rem',
            }}
          >
            Quản lý thông tin cá nhân và theo dõi tiến trình học tập của bạn
          </p>
        </div>

        {/* Tab Navigation */}
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Content */}
        <div style={{ minHeight: '400px' }}>{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default UserProfile;
