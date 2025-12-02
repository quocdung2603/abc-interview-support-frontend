import React, { useEffect, useState, useCallback } from 'react';

// Import types
import { User, EloHistory, ExamResult } from '@abc-interview-support-frontend/types';

// Import hooks
import { useAuth } from '@abc-interview-support-frontend/sso-utils';

// Import components
import PersonalInfoTabs from './components/personal-info/PersonalInfoTabs';
import CVApplicationTabs from './components/cv-application/CVApplicationTabs';
import CommunityTabs from './components/community/CommunityTabs';
import CareerTabs from './components/career/CareerTabs';
import ExamTabs from './components/exam/ExamTabs';
import Sidebar from './components/Sidebar';
import { userService, examService } from '@abc-interview-support-frontend/services';

const UserProfile: React.FC = () => {
  // Get authenticated user
  const { user: authUser } = useAuth();
  console.log('Authenticated User:', authUser);

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

  // Create completed exams from exam results
  const completedExams = examResults.map(result => ({
    id: result.id, // Use result.id as unique key instead of examId
    userId: result.userId,
    examType: 'VIRTUAL' as const, // Default type
    title: `Exam ${result.examId}`,
    position: 'Unknown Position',
    topics: [],
    questionTypes: [],
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
  }, [loadEloHistory, loadExamResults]);

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

  // Handle section change
  const handleSectionChange = (section: string, subsection?: string) => {
    setActiveSection(section);
    if (subsection) {
      setActiveSubsection(subsection);
    } else {
      // Set default subsection for personal section
      if (section === 'personal') {
        setActiveSubsection('info');
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

      case 'exams':
        return (
          <ExamTabs
            completedExams={completedExams}
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