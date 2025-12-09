import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { examService } from '@abc-interview-support-frontend/services';
import { useAuth } from '@abc-interview-support-frontend/sso-utils';
import { Exam } from '@abc-interview-support-frontend/types';
import { ExamCreationForm, ExamList, MockInterviewHeader } from './components/mock-interview';

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
  fieldId: number;
  levelId: number;
}

const MockInterview = () => {
  const [createdExams, setCreatedExams] = useState<Exam[]>([]);
  const [availableExams, setAvailableExams] = useState<Exam[]>([]);
  const [searchCriteria, setSearchCriteria] = useState<Partial<ExamFormData>>(
    {}
  );
  const { user } = useAuth();
  const navigate = useNavigate();

  const getUserExams = async () => {
    try {
      const res = await examService.getAllExams();
      let exams = res.content || [];
      exams = exams.filter((exam: Exam) => exam.userId === Number(user?.userId) && exam.examType === 'PRACTICE');
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
      exams = exams.filter((exam: Exam) => exam.userId !== 1 && exam.examType === 'VIRTUAL' && exam.status === 'PUBLISHED');
      setAvailableExams(exams);
    } catch (error) {
      setAvailableExams([]);
      console.error('Error fetching available exams:', error);
    }
  }

  // Filter available exams based on criteria
  const filteredAvailableExams = useMemo(() => {
    if (
      searchCriteria.fieldId ||
      searchCriteria.topic ||
      searchCriteria.levelId ||
      searchCriteria.questionTypes?.length
    ) {
      return availableExams.filter((exam) => {
        // Simple filtering logic - in real app, this would be more sophisticated
        if (searchCriteria.fieldId && searchCriteria.topic) {
          // Check if exam has the selected topic in topicIds array
          const hasMatchingTopic = exam.topicIds?.includes(Number(searchCriteria.topic));
          if (!hasMatchingTopic) return false;
        }

        if (searchCriteria.fieldId) {
          // Check if exam has the selected field
          if (exam.fieldId !== searchCriteria.fieldId) return false;
        }

        if (searchCriteria.levelId) {
          // Check if exam has the selected level
          if (exam.levelId !== searchCriteria.levelId) return false;
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
      // Transform data to match API format - only include required fields
      const apiData: any = {
        userId: Number(user?.userId),
        requestData: {
          title: examData.title || '',
          position: examData.position || '',
          duration: examData.duration,
          language: "vi",
          fieldId: Number(examData.fieldId),
          topicIds: [Number.parseInt(examData.topic)],
          levelId: Number(examData.levelId),
          questionTypeId: Number.parseInt(examData.questionTypes[0]),
          numberOfQuestions: Number(examData.questionCount),
        }
      };

      console.log('Creating exam with transformed data:', apiData);

      const response = await examService.createExamWithRandomQuestions(apiData);
      console.log('Exam created successfully:', response);

      // Refresh the exam lists
      getAllExams();
      getUserExams();
    } catch (error: any) {
      console.error('Error creating exam:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config
      });
    }
  };

  const handleStartExam = (examId: string) => {
    navigate(`/mock-interview-detail/${examId}`);
  };

  const handleCriteriaChange = (criteria: Partial<ExamFormData>) => {
    setSearchCriteria(criteria);
  };

  return (
    <div
      className="min-h-screen bg-neutral-50">
      <MockInterviewHeader />
      <div className="container-center py-8 px-4">
        <div className="max-w-5xl mx-auto">
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
