import { useState, useEffect } from 'react';
import ExamCreationForm from './components/ExamCreationForm';
import ExamList from './components/ExamList';

interface ExamFormData {
  field: string;
  topic: string;
  level: string;
  questionTypes: string[];
  questionCount: number;
  duration: number;
}

interface Exam {
  examId: string;
  userId?: string;
  examType: 'Virtual' | 'Recruiter';
  title: string;
  position?: string;
  topics: string;
  questionTypes: string;
  questionCount: number;
  duration: number;
  startTime?: Date;
  endTime?: Date;
  status: 'Active' | 'Inactive' | 'Completed';
  language: string;
  createdAt: Date;
  createdBy: string;
}

const MockInterview = () => {
  const [createdExams, setCreatedExams] = useState<Exam[]>([]);
  const [availableExams, setAvailableExams] = useState<Exam[]>([]);
  const [searchCriteria, setSearchCriteria] = useState<Partial<ExamFormData>>(
    {}
  );

  // Mock data cho available exams
  const mockAvailableExams: Exam[] = [
    {
      examId: 'exam-1',
      examType: 'Virtual',
      title: 'Frontend Developer Assessment',
      position: 'Frontend Developer',
      topics: JSON.stringify(['React', 'JavaScript']),
      questionTypes: JSON.stringify(['SingleChoice', 'MultipleChoice']),
      questionCount: 15,
      duration: 45,
      status: 'Active',
      language: 'vi',
      createdAt: new Date(),
      createdBy: 'system',
    },
    {
      examId: 'exam-2',
      examType: 'Virtual',
      title: 'Backend Node.js Test',
      position: 'Backend Developer',
      topics: JSON.stringify(['Node.js', 'Database']),
      questionTypes: JSON.stringify(['OpenEnded', 'FillInTheBlank']),
      questionCount: 12,
      duration: 60,
      status: 'Active',
      language: 'vi',
      createdAt: new Date(),
      createdBy: 'system',
    },
    {
      examId: 'exam-3',
      examType: 'Virtual',
      title: 'Full Stack Developer Challenge',
      position: 'Full Stack Developer',
      topics: JSON.stringify(['React', 'Node.js', 'Database']),
      questionTypes: JSON.stringify([
        'SingleChoice',
        'MultipleChoice',
        'OpenEnded',
      ]),
      questionCount: 20,
      duration: 90,
      status: 'Active',
      language: 'vi',
      createdAt: new Date(),
      createdBy: 'system',
    },
  ];

  // Filter available exams based on criteria
  useEffect(() => {
    let filtered = mockAvailableExams;

    if (
      searchCriteria.field ||
      searchCriteria.topic ||
      searchCriteria.level ||
      searchCriteria.questionTypes?.length
    ) {
      filtered = mockAvailableExams.filter((exam) => {
        // Simple filtering logic - in real app, this would be more sophisticated
        if (searchCriteria.field && searchCriteria.topic) {
          try {
            const examTopics = JSON.parse(exam.topics);
            const hasMatchingTopic = examTopics.some((topic: string) =>
              topic
                .toLowerCase()
                .includes(searchCriteria.topic?.toLowerCase() || '')
            );
            if (!hasMatchingTopic) return false;
          } catch {
            return false;
          }
        }

        if (searchCriteria.questionTypes?.length) {
          try {
            const examQuestionTypes = JSON.parse(exam.questionTypes);
            const hasMatchingType = searchCriteria.questionTypes.some((type) =>
              examQuestionTypes.includes(type)
            );
            if (!hasMatchingType) return false;
          } catch {
            return false;
          }
        }

        return true;
      });
    }

    setAvailableExams(filtered);
  }, [searchCriteria]);

  const handleCreateExam = (examData: ExamFormData) => {
    const fieldNames: Record<string, string> = {
      frontend: 'Frontend',
      backend: 'Backend',
      ba: 'Business Analysis',
      devops: 'DevOps',
      qa: 'Quality Assurance',
    };

    const topicNames: Record<string, string> = {
      react: 'React',
      angular: 'Angular',
      vue: 'Vue.js',
      javascript: 'JavaScript',
      typescript: 'TypeScript',
      nodejs: 'Node.js',
      java: 'Java',
      python: 'Python',
      csharp: 'C#',
      database: 'Database',
      requirements: 'Requirements Analysis',
      modeling: 'Process Modeling',
      documentation: 'Documentation',
      docker: 'Docker',
      kubernetes: 'Kubernetes',
      'ci-cd': 'CI/CD',
      'manual-testing': 'Manual Testing',
      automation: 'Test Automation',
      performance: 'Performance Testing',
    };

    const newExam: Exam = {
      examId: `exam-created-${Date.now()}`,
      examType: 'Virtual',
      title: `${fieldNames[examData.field]} - ${topicNames[examData.topic]} (${
        examData.level
      })`,
      position: `${fieldNames[examData.field]} ${examData.level}`,
      topics: JSON.stringify([topicNames[examData.topic]]),
      questionTypes: JSON.stringify(examData.questionTypes),
      questionCount: examData.questionCount,
      duration: examData.duration,
      status: 'Active',
      language: 'vi',
      createdAt: new Date(),
      createdBy: 'current-user',
    };

    setCreatedExams((prev) => [newExam, ...prev]);

    // Show success message
    alert('Bài kiểm tra đã được tạo thành công!');
  };

  const handleStartExam = (examId: string) => {
    // In real app, this would navigate to exam taking page
    alert(`Bắt đầu làm bài kiểm tra: ${examId}`);
    console.log('Starting exam:', examId);
  };

  const handleCriteriaChange = (criteria: Partial<ExamFormData>) => {
    setSearchCriteria(criteria);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      }}
    >
      <div className="container-center section-padding">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8 animate-fade-in-up">
            <h1 className="text-display text-gradient-primary mb-4">
              🎯 Phỏng Vấn Giả Lập
            </h1>
            <p className="text-body-large text-neutral-600 max-w-2xl mx-auto">
              Tạo và thực hiện các bài kiểm tra phỏng vấn để chuẩn bị tốt nhất
              cho cuộc phỏng vấn thực tế của bạn
            </p>
          </div>

          {/* Exam Creation Form */}
          <div className="animate-fade-in">
            <ExamCreationForm
              onCreateExam={handleCreateExam}
              onCriteriaChange={handleCriteriaChange}
            />
          </div>

          {/* Created Exams */}
          {createdExams.length > 0 && (
            <div className="animate-fade-in-up">
              <ExamList
                title="🆕 Bài Kiểm Tra Được Tạo"
                exams={createdExams}
                onStartExam={handleStartExam}
                showCreatedBadge={true}
              />
            </div>
          )}

          {/* Available Exams */}
          <div className="animate-fade-in-up">
            <ExamList
              title="📚 Các Bài Kiểm Tra Có Sẵn"
              exams={availableExams}
              emptyMessage="Không tìm thấy bài kiểm tra phù hợp với tiêu chí đã chọn."
              onStartExam={handleStartExam}
            />
          </div>

          {/* Floating Stats */}
          {(createdExams.length > 0 || availableExams.length > 0) && (
            <div
              className="fixed bottom-8 right-8 w-12 h-12 bg-accent text-white border-0 rounded-full shadow-lg cursor-pointer flex items-center justify-center text-xl transition-all duration-300 hover:bg-accent-dark hover:scale-110 hover:shadow-xl z-50"
              title="Tổng số bài kiểm tra"
            >
              {createdExams.length + availableExams.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MockInterview;
