import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { InterviewRevisionFilter } from './components/InterviewRevisionFilter';
import { QuestionsList } from './components/QuestionsList';
import {
  Answer,
  Field,
  Level,
  Question,
  Topic,
} from '@abc-interview-support-frontend/types';

/**
 * TRANG ÔN TẬP PHỎNG VẤN
 *
 * Features:
 * - Ngân hàng câu hỏi phỏng vấn theo lĩnh vực
 * - Lọc theo Field (Frontend, Backend, BA, Tester)
 * - Lọc theo Topic (React, Angular, Node.js, etc.)
 * - Lọc theo Level (Fresher, Junior, Middle, Senior)
 * - Hiển thị câu hỏi và câu trả lời mẫu
 * - Vote system cho câu hỏi và câu trả lời
 * - Pagination
 */

// Mock data cho demo
const mockFields: Field[] = [
  {
    fieldId: 'frontend',
    fieldName: 'Frontend',
    description: 'Phát triển giao diện người dùng',
  },
  {
    fieldId: 'backend',
    fieldName: 'Backend',
    description: 'Phát triển server và API',
  },
  {
    fieldId: 'ba',
    fieldName: 'Business Analyst',
    description: 'Phân tích nghiệp vụ',
  },
  {
    fieldId: 'tester',
    fieldName: 'Tester',
    description: 'Kiểm thử phần mềm',
  },
];

const mockTopics: Topic[] = [
  // Frontend Topics
  {
    topicId: 'react',
    fieldId: 'frontend',
    topicName: 'React',
    description: 'React.js framework',
  },
  {
    topicId: 'angular',
    fieldId: 'frontend',
    topicName: 'Angular',
    description: 'Angular framework',
  },
  {
    topicId: 'vue',
    fieldId: 'frontend',
    topicName: 'Vue.js',
    description: 'Vue.js framework',
  },
  {
    topicId: 'javascript',
    fieldId: 'frontend',
    topicName: 'JavaScript',
    description: 'JavaScript language',
  },
  {
    topicId: 'css',
    fieldId: 'frontend',
    topicName: 'CSS',
    description: 'CSS styling',
  },

  // Backend Topics
  {
    topicId: 'nodejs',
    fieldId: 'backend',
    topicName: 'Node.js',
    description: 'Node.js runtime',
  },
  {
    topicId: 'java',
    fieldId: 'backend',
    topicName: 'Java',
    description: 'Java programming',
  },
  {
    topicId: 'python',
    fieldId: 'backend',
    topicName: 'Python',
    description: 'Python programming',
  },
  {
    topicId: 'database',
    fieldId: 'backend',
    topicName: 'Database',
    description: 'Database design',
  },
  {
    topicId: 'api',
    fieldId: 'backend',
    topicName: 'API Design',
    description: 'REST API design',
  },

  // BA Topics
  {
    topicId: 'requirements',
    fieldId: 'ba',
    topicName: 'Requirements Analysis',
    description: 'Phân tích yêu cầu',
  },
  {
    topicId: 'modeling',
    fieldId: 'ba',
    topicName: 'Business Modeling',
    description: 'Mô hình hóa nghiệp vụ',
  },
  {
    topicId: 'documentation',
    fieldId: 'ba',
    topicName: 'Documentation',
    description: 'Tài liệu hóa',
  },

  // Tester Topics
  {
    topicId: 'manual-testing',
    fieldId: 'tester',
    topicName: 'Manual Testing',
    description: 'Kiểm thử thủ công',
  },
  {
    topicId: 'automation',
    fieldId: 'tester',
    topicName: 'Test Automation',
    description: 'Tự động hóa kiểm thử',
  },
  {
    topicId: 'api-testing',
    fieldId: 'tester',
    topicName: 'API Testing',
    description: 'Kiểm thử API',
  },
];

const mockLevels: Level[] = [
  {
    levelId: 'fresher',
    levelName: 'Fresher',
    description: '0-1 năm kinh nghiệm',
  },
  {
    levelId: 'junior',
    levelName: 'Junior',
    description: '1-3 năm kinh nghiệm',
  },
  {
    levelId: 'middle',
    levelName: 'Middle',
    description: '3-5 năm kinh nghiệm',
  },
  { levelId: 'senior', levelName: 'Senior', description: '5+ năm kinh nghiệm' },
];

const mockQuestions: Question[] = [
  {
    questionId: 'q1',
    userId: 'system',
    topicId: 'react',
    fieldId: 'frontend',
    levelId: 'junior',
    questionTypeId: 'References',
    questionContent: 'State và Props trong React khác nhau như thế nào?',
    questionAnswer:
      'State là dữ liệu nội bộ của component, có thể thay đổi. Props là dữ liệu truyền từ component cha xuống component con, chỉ đọc.',
    status: 'Approved',
    language: 'vi',
    createdAt: new Date('2025-01-10'),
    usefulVote: 15,
    unusefulVote: 2,
  },
  {
    questionId: 'q2',
    userId: 'system',
    topicId: 'react',
    fieldId: 'frontend',
    levelId: 'middle',
    questionTypeId: 'References',
    questionContent:
      'Hooks trong React là gì? Giải thích useEffect và useState.',
    status: 'Approved',
    language: 'vi',
    createdAt: new Date('2025-01-09'),
    usefulVote: 22,
    unusefulVote: 1,
  },
  {
    questionId: 'q3',
    userId: 'system',
    topicId: 'javascript',
    fieldId: 'frontend',
    levelId: 'junior',
    questionTypeId: 'References',
    questionContent:
      'Var, let và const khác nhau như thế nào trong JavaScript?',
    status: 'Approved',
    language: 'vi',
    createdAt: new Date('2025-01-08'),
    usefulVote: 18,
    unusefulVote: 3,
  },
  {
    questionId: 'q4',
    userId: 'system',
    topicId: 'nodejs',
    fieldId: 'backend',
    levelId: 'middle',
    questionTypeId: 'References',
    questionContent: 'Event Loop trong Node.js hoạt động như thế nào?',
    status: 'Approved',
    language: 'vi',
    createdAt: new Date('2025-01-07'),
    usefulVote: 25,
    unusefulVote: 2,
  },
  {
    questionId: 'q5',
    userId: 'system',
    topicId: 'database',
    fieldId: 'backend',
    levelId: 'senior',
    questionTypeId: 'References',
    questionContent: 'Indexing trong database là gì? Khi nào nên sử dụng?',
    status: 'Approved',
    language: 'vi',
    createdAt: new Date('2025-01-06'),
    usefulVote: 30,
    unusefulVote: 1,
  },
  {
    questionId: 'q6',
    userId: 'system',
    topicId: 'requirements',
    fieldId: 'ba',
    levelId: 'junior',
    questionTypeId: 'References',
    questionContent:
      'Functional requirements và Non-functional requirements khác nhau như thế nào?',
    status: 'Approved',
    language: 'vi',
    createdAt: new Date('2025-01-05'),
    usefulVote: 12,
    unusefulVote: 1,
  },
  {
    questionId: 'q7',
    userId: 'system',
    topicId: 'manual-testing',
    fieldId: 'tester',
    levelId: 'fresher',
    questionTypeId: 'References',
    questionContent:
      'Test case là gì? Một test case tốt cần có những yếu tố gì?',
    status: 'Approved',
    language: 'vi',
    createdAt: new Date('2025-01-04'),
    usefulVote: 14,
    unusefulVote: 2,
  },
];

const mockAnswers: Answer[] = [
  {
    answerId: 'a1',
    userId: 'system',
    questionId: 'q1',
    questionTypeId: 'References',
    answerContent:
      'State và Props là hai khái niệm quan trọng trong React:\n\n**State:**\n- Là dữ liệu nội bộ của component\n- Có thể thay đổi thông qua setState() hoặc useState()\n- Khi state thay đổi, component sẽ re-render\n- Chỉ component sở hữu mới có thể thay đổi state\n\n**Props:**\n- Là dữ liệu được truyền từ component cha xuống component con\n- Chỉ đọc (read-only), component con không thể thay đổi props\n- Được sử dụng để truyền dữ liệu và callbacks giữa các components\n- Giúp components có thể tái sử dụng',
    isSampleAnswer: true,
    usefulVote: 12,
    unusefulVote: 0,
    createdAt: new Date('2025-01-10'),
  },
  {
    answerId: 'a2',
    userId: 'system',
    questionId: 'q2',
    questionTypeId: 'References',
    answerContent:
      'React Hooks là các functions đặc biệt cho phép sử dụng state và các tính năng khác của React trong functional components.\n\n**useState:**\n```javascript\nconst [count, setCount] = useState(0);\n```\n- Quản lý state trong functional component\n- Trả về array gồm 2 phần tử: giá trị state hiện tại và function để update state\n\n**useEffect:**\n```javascript\nuseEffect(() => {\n  // Side effect\n  return () => {\n    // Cleanup\n  };\n}, [dependencies]);\n```\n- Xử lý side effects như API calls, subscriptions, DOM manipulation\n- Chạy sau mỗi render (hoặc chỉ khi dependencies thay đổi)\n- Có thể return cleanup function',
    isSampleAnswer: true,
    usefulVote: 18,
    unusefulVote: 1,
    createdAt: new Date('2025-01-09'),
  },
  {
    answerId: 'a3',
    userId: 'user1',
    questionId: 'q1',
    questionTypeId: 'References',
    answerContent:
      'Thêm vào đó, state còn có thể là object hoặc array phức tạp, và khi update cần spread operator để tránh mutate trực tiếp.',
    isSampleAnswer: false,
    usefulVote: 5,
    unusefulVote: 1,
    createdAt: new Date('2025-01-11'),
  },
];

const InterviewRevision: React.FC = () => {
  const navigate = useNavigate();
  const [selectedField, setSelectedField] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [loading] = useState(false);

  // Reset topic khi field thay đổi
  useEffect(() => {
    if (selectedField && selectedTopic) {
      const topicExists = mockTopics.some(
        (topic) =>
          topic.topicId === selectedTopic && topic.fieldId === selectedField
      );
      if (!topicExists) {
        setSelectedTopic('');
      }
    }
  }, [selectedField, selectedTopic]);

  // Filter questions dựa trên selection
  const filteredQuestions = useMemo(() => {
    return mockQuestions
      .filter((question) => {
        const matchesField =
          !selectedField || question.fieldId === selectedField;
        const matchesTopic =
          !selectedTopic || question.topicId === selectedTopic;
        const matchesLevel =
          !selectedLevel || question.levelId === selectedLevel;

        return (
          matchesField &&
          matchesTopic &&
          matchesLevel &&
          question.status === 'Approved' &&
          question.questionTypeId === 'References' // Chỉ lấy câu hỏi tham khảo
        );
      })
      .sort((a, b) => b.usefulVote - a.usefulVote); // Sort by usefulness
  }, [selectedField, selectedTopic, selectedLevel]);

  const handleFieldChange = (fieldId: string) => {
    setSelectedField(fieldId);
    if (fieldId !== selectedField) {
      setSelectedTopic(''); // Reset topic khi đổi field
    }
  };

  const handleVote = (questionId: string, vote: 'useful' | 'unuseful') => {
    // Trong thực tế sẽ call API để vote
    console.log(`Vote ${vote} for question ${questionId}`);
  };

  const handleAnswerVote = (answerId: string, vote: 'useful' | 'unuseful') => {
    // Trong thực tế sẽ call API để vote answer
    console.log(`Vote ${vote} for answer ${answerId}`);
  };

  const handleQuestionClick = (questionId: string) => {
    // Navigate to question detail page
    navigate(`/interview-question-detail/${questionId}`);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container-center section-padding">
        {/* Filter Section */}
        <InterviewRevisionFilter
          selectedField={selectedField}
          onFieldChange={handleFieldChange}
          selectedTopic={selectedTopic}
          onTopicChange={setSelectedTopic}
          selectedLevel={selectedLevel}
          onLevelChange={setSelectedLevel}
          fields={mockFields}
          topics={mockTopics}
          levels={mockLevels}
          questionsCount={filteredQuestions.length}
        />

        {/* Questions List - Chỉ hiển thị sau khi đã lọc */}
        {selectedField || selectedTopic || selectedLevel ? (
          <QuestionsList
            questions={filteredQuestions}
            answers={mockAnswers}
            fields={mockFields}
            topics={mockTopics}
            levels={mockLevels}
            loading={loading}
            onVote={handleVote}
            onAnswerVote={handleAnswerVote}
            onQuestionClick={handleQuestionClick}
          />
        ) : (
          <div className="text-center py-12">
            <div className="text-neutral-500 text-lg mb-2">
              📚 Chọn lĩnh vực, chủ đề hoặc cấp độ để xem câu hỏi ôn tập
            </div>
            <div className="text-neutral-400">
              Hệ thống sẽ hiển thị câu hỏi phỏng vấn tham khảo phù hợp với lựa
              chọn của bạn
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewRevision;
