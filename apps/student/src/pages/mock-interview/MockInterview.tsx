import { useState, useEffect, useMemo } from 'react';
import ExamCreationForm from './components/mock-interview/ExamCreationForm';
import ExamList from './components/mock-interview/ExamList';
import { useNavigate } from 'react-router-dom';
import { examService } from '@abc-interview-support-frontend/services';
import { useAuth } from '@abc-interview-support-frontend/sso-utils';
import { Exam } from '@abc-interview-support-frontend/types';

interface ExamFormData {
  field: string;
  topic: string;
  level: string;
  questionTypes: string[];
  questionCount: number;
  duration: number;
  title?: string;
  position?: string;
  description?: string;
}

const MockInterview = () => {
  const [createdExams, setCreatedExams] = useState<Exam[]>([]);
  const [availableExams, setAvailableExams] = useState<Exam[]>([]);
  const [searchCriteria, setSearchCriteria] = useState<Partial<ExamFormData>>(
    {}
  );

  const navigate = useNavigate();
  const { user } = useAuth();
  // console.log('Authenticated user:', JSON.stringify(user, null, 2));

  const getUserExams = async () => {
    try {
      const res = await examService.getAllExams();
      let exams = res.content || [];
      exams = exams.filter((exam: Exam) => exam.userId === Number(user?.userId));
      setCreatedExams(exams);
    } catch (error) {
      console.error('Error fetching user exams:', error);
      setCreatedExams([]);
    }
  }

  const getAllExams = async () => {
    try {
      const res = await examService.getAllExams();
      let exams = res.content || [];
      exams = exams.filter((exam: Exam) => exam.userId !== Number(user?.userId));
      setAvailableExams(exams);
    } catch (error) {
      setAvailableExams([]);
      console.error('Error fetching available exams:', error);
    }
  }

  // Filter available exams based on criteria
  const filteredAvailableExams = useMemo(() => {
    if (
      searchCriteria.field ||
      searchCriteria.topic ||
      searchCriteria.level ||
      searchCriteria.questionTypes?.length
    ) {
      return availableExams.filter((exam) => {
        // Simple filtering logic - in real app, this would be more sophisticated
        if (searchCriteria.field && searchCriteria.topic) {
          // Check if exam has the selected topic in topicIds array
          const hasMatchingTopic = exam.topicIds?.includes(Number(searchCriteria.topic));
          if (!hasMatchingTopic) return false;
        }

        if (searchCriteria.questionTypes?.length) {
          // Check if exam has any of the selected question types in questionTypeIds array
          const hasMatchingType = searchCriteria.questionTypes.some((type) =>
            exam.questionTypeIds?.includes(Number(type))
          );
          if (!hasMatchingType) return false;
        }

        return true;
      });
    }
    return availableExams;
  }, [availableExams, searchCriteria]);

  useEffect(() => {
    getAllExams();
    getUserExams();
  }, []);

  const handleCreateExam = async (examData: ExamFormData) => {
    try {
      // Transform data to match API format
      const apiData = {
        examType: "RECRUITER",
        title: examData.title || '',
        position: examData.position || '',
        topicIds: [Number.parseInt(examData.topic)], // Convert to array of numbers
        questionTypeIds: examData.questionTypes.map(type => Number.parseInt(type)), // Convert to array of numbers
        questionCount: examData.questionCount,
        duration: examData.duration,
        userId: user?.userId // Add userId from auth
      };
      await examService.createExam(apiData);
      // Refresh the exam lists
      getAllExams();
      getUserExams();
    } catch (error) {
      console.error('Error creating exam:', error);
    }
  };

  const handleStartExam = (examId: string) => {
    navigate(`/mock-interview-detail/${examId}`);
    // In real app, this would navigate to exam taking page
    alert(`Bắt đầu làm bài kiểm tra có ID: ${examId}`);
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
      <div className="container-center py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-6 animate-fade-in-up">
            <h1 className="text-2xl font-bold text-gradient-primary mb-3">
              Phỏng Vấn Giả Lập
            </h1>
            <p className="text-sm text-neutral-600 max-w-xl mx-auto">
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
              exams={filteredAvailableExams}
              emptyMessage="Không tìm thấy bài kiểm tra phù hợp với tiêu chí đã chọn."
              onStartExam={handleStartExam}
            />
          </div>

          {/* Floating Stats */}
          {(createdExams.length > 0 || filteredAvailableExams.length > 0) && (
            <div
              className="fixed bottom-6 right-6 w-10 h-10 bg-accent text-white border-0 rounded-full shadow-lg cursor-pointer flex items-center justify-center text-lg transition-all duration-300 hover:bg-accent-dark hover:scale-110 hover:shadow-xl z-50"
              title="Tổng số bài kiểm tra"
            >
              {createdExams.length + filteredAvailableExams.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MockInterview;
