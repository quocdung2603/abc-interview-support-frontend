import { useState, useEffect, useMemo } from 'react';
import { examService, questionService } from '@abc-interview-support-frontend/services';
import { Exam, Field, Topic, Level, QuestionType } from '@abc-interview-support-frontend/types';
import MockInterviewDetail from './MockInterviewDetail';
import { BaseExamList, BaseInterviewHeader, ExamFilterForm } from './components/base-interview';
import { useAuth } from '@abc-interview-support-frontend/sso-utils';
import { useNavigate } from 'react-router-dom';

interface Registration {
  id: number;
  examId: number;
  userId: number;
  registrationStatus: string;
  registeredAt: string;
}

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

const BaseInterview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [availableExams, setAvailableExams] = useState<Exam[]>([]);
  const [registeredExams, setRegisteredExams] = useState<Exam[]>([]);
  const [registrations, setRegistrations] = useState<Map<number, Registration>>(new Map());
  const [searchCriteria, setSearchCriteria] = useState<Partial<ExamFormData>>(
    {}
  );
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [registerLoading, setRegisterLoading] = useState<Set<string>>(new Set());
  const [unregisterLoading, setUnregisterLoading] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'available' | 'registered'>('available');

  // Filter data states
  const [fieldData, setFieldData] = useState<Field[]>([]);
  const [topicData, setTopicData] = useState<Topic[]>([]);
  const [levelData, setLevelData] = useState<Level[]>([]);
  const [questionTypeData, setQuestionTypeData] = useState<QuestionType[]>([]);

  const getAllExams = async () => {
    try {
      const res = await examService.getAllExams();
      let exams = res.content || [];
      // Filter for RECRUITER exams that are PUBLISHED or DRAFT
      exams = exams.filter((exam: Exam) => exam.examType === 'RECRUITER' && exam.status === 'PUBLISHED');
      console.log('Fetched available exams:', exams);
      setAvailableExams(exams);
    } catch (error) {
      setAvailableExams([]);
      console.error('Error fetching available exams:', error);
    }
  }

  const getRegisteredExams = async () => {
    if (!user?.userId) return;

    try {
      const res = await examService.getRegistrationByUser(user.userId.toString());
      const allRegistrations: Registration[] = res.content || [];

      // Filter only REGISTERED status (not CANCELLED)
      const activeRegistrations = allRegistrations.filter(
        (reg: Registration) => reg.registrationStatus === 'REGISTERED'
      );

      // Create map of examId -> registration for quick lookup
      const registrationsMap = new Map<number, Registration>();
      activeRegistrations.forEach((reg: Registration) => {
        registrationsMap.set(reg.examId, reg);
      });
      setRegistrations(registrationsMap);

      // Get registered exams from available exams
      const registered = availableExams.filter(exam => registrationsMap.has(exam.id));
      setRegisteredExams(registered);
    } catch (error) {
      setRegistrations(new Map());
      setRegisteredExams([]);
      console.error('Error fetching registered exams:', error);
    }
  }

  const loadFilterData = async () => {
    try {
      const [fieldsRes, topicsRes, levelsRes, typesRes] = await Promise.all([
        questionService.getAllFields(),
        questionService.getAllTopics(),
        questionService.getAllLevels(),
        questionService.getAllQuestionTypes(),
      ]);

      setFieldData(fieldsRes.content || []);
      setTopicData(topicsRes.content || []);
      setLevelData(levelsRes.content || []);
      setQuestionTypeData(typesRes.content || []);
    } catch (error) {
      console.error('Error loading filter data:', error);
      setFieldData([]);
      setTopicData([]);
      setLevelData([]);
      setQuestionTypeData([]);
    }
  }

  // Filter available exams based on criteria and exclude registered ones
  const filteredAvailableExams = useMemo(() => {
    let exams = availableExams.filter(exam => !registrations.has(exam.id));

    if (
      searchCriteria.fieldId ||
      searchCriteria.topic ||
      searchCriteria.levelId ||
      searchCriteria.questionTypes?.length
    ) {
      exams = exams.filter((exam) => {
        // Check field
        if (searchCriteria.fieldId) {
          if (exam.fieldId !== searchCriteria.fieldId) return false;
        }

        // Check topic
        if (searchCriteria.topic) {
          const hasMatchingTopic = exam.topicIds?.includes(Number(searchCriteria.topic));
          if (!hasMatchingTopic) return false;
        }

        // Check level
        if (searchCriteria.levelId) {
          if (exam.levelId !== searchCriteria.levelId) return false;
        }

        // Check question types
        if (searchCriteria.questionTypes?.length) {
          const hasMatchingType = searchCriteria.questionTypes.some((type) =>
            exam.questionTypeIds?.includes(Number(type))
          );
          if (!hasMatchingType) return false;
        }

        return true;
      });
    }
    return exams;
  }, [availableExams, searchCriteria, registrations]);

  useEffect(() => {
    getAllExams();
    loadFilterData();
  }, []);

  useEffect(() => {
    if (availableExams.length > 0 && user?.userId) {
      getRegisteredExams();
    }
  }, [availableExams, user?.userId]);

  const handleRegister = async (examId: string) => {
    if (!user?.userId) {
      console.error('User not authenticated');
      return;
    }

    setRegisterLoading(prev => new Set(prev).add(examId));

    try {
      await examService.registerForExam(examId, user.userId.toString());
      // Refresh registered exams after successful registration
      await getRegisteredExams();
    } catch (error) {
      console.error('Error registering for exam:', error);
      // TODO: Show error message to user
    } finally {
      setRegisterLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(examId);
        return newSet;
      });
    }
  };

  const handleUnregister = async (examId: string) => {
    setUnregisterLoading(prev => new Set(prev).add(examId));

    try {
      // Find registration by examId to get registration id
      const registration = registrations.get(Number(examId));
      if (!registration) {
        console.error('Registration not found for exam:', examId);
        return;
      }

      // Call API with registration id (not examId)
      await examService.CancelRegistration(registration.id.toString());
      // Refresh registered exams after successful unregistration
      await getRegisteredExams();
    } catch (error) {
      console.error('Error unregistering from exam:', error);
      // TODO: Show error message to user
    } finally {
      setUnregisterLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(examId);
        return newSet;
      });
    }
  };

  const handleCriteriaChange = (criteria: Partial<ExamFormData>) => {
    setSearchCriteria(criteria);
  };

  const handleBackToList = () => {
    setSelectedExamId(null);
  };

  const handleStartExam = (examId: string): void => {
    navigate(`/mock-interview-detail/${examId}`);
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <BaseInterviewHeader />
      {selectedExamId ? (
        <MockInterviewDetail examId={selectedExamId} onBack={handleBackToList} />
      ) : (
        <div className="container-center py-8 px-4">
          <div className="max-w-5xl mx-auto">
            {/* Tabs */}
            <div className="mb-6 animate-fade-in">
              <div className="flex border-b border-neutral-200">
                <button
                  onClick={() => setActiveTab('available')}
                  className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === 'available'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-neutral-600 hover:text-primary'
                    }`}
                >
                  Các Bài Kiểm Tra Tuyển Dụng
                  <span className="ml-2 bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full text-xs">
                    {filteredAvailableExams.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('registered')}
                  className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === 'registered'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-neutral-600 hover:text-primary'
                    }`}
                >
                  Danh Sách Đã Đăng Ký
                  <span className="ml-2 bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full text-xs">
                    {registeredExams.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Exam Filter Form - only show for available exams */}
            {activeTab === 'available' && (
              <div className="animate-fade-in">
                <ExamFilterForm
                  fieldData={fieldData}
                  topicData={topicData}
                  levelData={levelData}
                  questionTypeData={questionTypeData}
                  onCriteriaChange={handleCriteriaChange}
                />
              </div>
            )}

            {/* Available Exams */}
            <div className="animate-fade-in-up">
              {activeTab === 'available' ? (
                <BaseExamList
                  title="📚 Các Bài Kiểm Tra Tuyển Dụng"
                  exams={filteredAvailableExams}
                  emptyMessage="Không tìm thấy bài kiểm tra phù hợp với tiêu chí đã chọn."
                  onStartExam={handleStartExam}
                  onRegister={handleRegister}
                  isRegistered={false}
                  registerLoading={registerLoading}
                />
              ) : (
                <BaseExamList
                  title="📝 Danh Sách Đã Đăng Ký"
                  exams={registeredExams}
                  emptyMessage="Bạn chưa đăng ký bài kiểm tra nào."
                  onStartExam={handleStartExam}
                  onUnregister={handleUnregister}
                  isRegistered={true}
                  unregisterLoading={unregisterLoading}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BaseInterview;
