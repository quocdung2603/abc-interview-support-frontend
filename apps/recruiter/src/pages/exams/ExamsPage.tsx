import React, { useEffect, useState, useMemo } from 'react';
import { message } from 'antd';
import type { Dayjs } from 'dayjs';
import {
  ExamFormPreview,
  ExamsTable,
  EmptyState,
  NotVerifiedState,
  ExamToolbar,
} from './components';
import ExamPageHeader from './components/ExamPageHeader';
import ExamFormDrawer from './components/ExamFormDrawer';
import { Exam, Field, Topic, Level, QuestionType, Question } from '@abc-interview-support-frontend/types';
import { examService, questionService } from '@abc-interview-support-frontend/services';
import { useAuth } from '@abc-interview-support-frontend/sso-utils';

// Extended interface for form fields
interface CreateFormFields extends Exam {
  totalQuestions: number;
  candidates: number;
  startTime: string;
  endTime: string;
  examPeriod?: [string, string];
  difficulty?: {
    easy: boolean;
    medium: boolean;
    hard: boolean;
  };
  selectedQuestions: number[]; // Add selected questions
  selectedQuestionsData?: Question[]; // Add selected questions objects
  // Override to use correct field names
  topics?: number[];
  questionTypes?: number[];
}

const ExamsPage: React.FC = () => {
  // Mock verification state
  const isVerified = true;
  const { user } = useAuth();

  const [openForm, setOpenForm] = useState(false);

  const [editingExam, setEditingExam] = useState<CreateFormFields | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [examList, setExamList] = useState<Exam[]>([]);

  // Mock data for question filters
  const [fields, setFields] = useState<Field[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([]);
  const [filters, setFilters] = useState<{
    searchText?: string;
    status?: string;
    position?: string;
    fieldId?: number;
    topicIds?: number[];
    levelId?: number;
    dateRange?: [Dayjs, Dayjs];
  }>({});

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    setOpenForm(false);
    setCurrentStep(0);
  };

  const handlePreview = (exam: Exam) => {
    setSelectedExam(exam);
    setPreviewVisible(true);
  };

  const handleCreateExam = () => {
    setEditingExam(null); // <- tạo mới => form rỗng
    setCurrentStep(0); // Reset về bước đầu tiên
    setOpenForm(true);
  };

  const handleEditExam = async (exam: Exam) => {
    try {
      // Fetch full exam details from API
      const fullExam = await examService.getExamById(exam.id.toString());
      console.log('Full exam data for edit:', fullExam);

      // Get question IDs
      const questionIds = fullExam.questions?.map((q: any) => Number(q.id)) || [];

      // Fetch full question details
      let selectedQuestionsData: Question[] = [];
      if (questionIds.length > 0) {
        try {
          const questionPromises = questionIds.map((id: number) => questionService.getQuestionById(id));
          const questionsData = await Promise.all(questionPromises);
          console.log('Raw questions data from API:', questionsData);
          selectedQuestionsData = questionsData.map(data => {
            console.log('Processing question data:', data);
            // Handle different response formats
            const question = data.content || data;
            console.log('Extracted question:', question);
            return question;
          });
          console.log('Final selectedQuestionsData:', selectedQuestionsData);
        } catch (error) {
          console.error('Error fetching questions:', error);
          selectedQuestionsData = [];
        }
      }

      // Convert Exam to CreateFormFields for the form
      const formData: CreateFormFields = {
        ...fullExam,
        totalQuestions: fullExam.questionCount,
        candidates: 1, // Default value
        startTime: '',
        endTime: '',
        examPeriod: undefined,
        difficulty: {
          easy: true,
          medium: true,
          hard: false,
        },
        selectedQuestions: questionIds, // Keep IDs for form
        selectedQuestionsData: selectedQuestionsData, // Add Question objects
        // Legacy fields for backward compatibility
        topics: fullExam.topicIds || [],
        questionTypes: fullExam.questionTypeIds || [],
      };

      setEditingExam(formData); // <- sửa => đổ dữ liệu
      setCurrentStep(0); // Reset về bước đầu tiên khi edit
      setOpenForm(true);
    } catch (error) {
      console.error('Error fetching exam details:', error);
      message.error('Không thể tải thông tin bài kiểm tra để chỉnh sửa');
    }
  };

  const handleDelete = async (examId: number) => {
    try {
      // Call API to delete exam
      await examService.deleteExam(examId.toString());

      // Remove exam from the list
      setExamList((prev) => prev.filter((exam) => exam.id !== examId));

      // Show success message
      message.success('Xóa bài kiểm tra thành công!');
    } catch (error) {
      console.error('Error deleting exam:', error);
      message.error(`Lỗi khi xóa bài kiểm tra: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    }
  };

  const handleSaveJob = async (payload: CreateFormFields, mode: 'create' | 'update') => {
    try {
      if (mode === 'create') {
        // Mock user data - in real app, get from auth context
        const userId = user ? Number.parseInt(user.userId) : 1;

        // Prepare API data according to the required format
        const apiData = {
          examType: "RECRUITER",
          title: payload.title || '',
          position: payload.position || '',
          fieldId: payload.fieldId,
          levelId: payload.levelId,
          topicIds: payload.topicIds || [], // Already an array of numbers
          questionTypeIds: payload.questionTypeIds || [], // Already an array of numbers
          questionCount: payload.questionCount,
          duration: payload.duration,
          userId: userId
        };

        console.log('Creating exam with API data:', apiData);

        // Call API to create exam
        const response = await examService.createExam(apiData);
        console.log('Exam created successfully:', response);

        // Get the created exam ID
        const examId = response.id;

        // Add selected questions to the exam
        if (payload.selectedQuestions && payload.selectedQuestions.length > 0) {
          for (let i = 0; i < payload.selectedQuestions.length; i++) {
            const questionId = payload.selectedQuestions[i];
            const orderNumber = i + 1;
            try {
              await examService.addQuestionToExam(examId.toString(), questionId, orderNumber);
              console.log(`Added question ${questionId} to exam ${examId} with order ${orderNumber}`);
            } catch (addError) {
              console.error(`Error adding question ${questionId} to exam:`, addError);
              // Continue with other questions or handle error
            }
          }
        }

        // Add the created exam to the list
        const createdExam: Exam = {
          ...response, // Use response from API
          id: response.id || Date.now(), // Fallback ID if not provided
          status: response.status || 'DRAFT',
          createdAt: response.createdAt || new Date().toISOString(),
          createdBy: response.createdBy || userId,
        };

        setExamList((prev) => [createdExam, ...prev]);

        // Show success message
        message.success('Tạo bài kiểm tra thành công!');

      } else {
        // Update exam
        const userId = user ? Number.parseInt(user.userId) : 1;

        // Prepare API data for update
        const apiData = {
          userId: userId,
          examType: "RECRUITER",
          title: payload.title || '',
          position: payload.position || '',
          fieldId: payload.fieldId,
          topicId: payload.topicIds?.[0] || 0, // Use first topic as primary
          levelId: payload.levelId,
          topics: payload.topicIds || [],
          questionTypes: payload.questionTypeIds || [],
          questionCount: payload.questionCount,
          duration: payload.duration,
          language: "en"
        };

        console.log('Updating exam with API data:', apiData);

        // 1. Call API to update exam
        const response = await examService.updateExam(payload.id.toString(), apiData);
        console.log('Exam updated successfully:', response);

        // 2. Remove all existing questions
        try {
          await examService.removeQuestionFromExam(payload.id.toString());
          console.log('Removed all questions from exam');
        } catch (removeError) {
          console.error('Error removing questions:', removeError);
          // Continue even if remove fails
        }

        // 3. Add selected questions to the exam
        if (payload.selectedQuestions && payload.selectedQuestions.length > 0) {
          for (let i = 0; i < payload.selectedQuestions.length; i++) {
            const questionId = payload.selectedQuestions[i];
            const orderNumber = i + 1;
            try {
              await examService.addQuestionToExam(payload.id.toString(), questionId, orderNumber);
              console.log(`Added question ${questionId} to exam ${payload.id} with order ${orderNumber}`);
            } catch (addError) {
              console.error(`Error adding question ${questionId} to exam:`, addError);
              // Continue with other questions or handle error
            }
          }
        }

        // Update the exam in the list
        const updatedExam: Exam = {
          ...payload,
          ...response, // Use response from API to update any changed fields
        };

        setExamList((prev) =>
          prev.map((exam) =>
            exam.id === payload.id ? updatedExam : exam
          )
        );

        // Show success message
        message.success('Cập nhật bài kiểm tra thành công!');
      }

      // Close form and reset
      setOpenForm(false);
      setCurrentStep(0);

    } catch (error) {
      console.error('Error creating exam:', error);
      message.error(`Lỗi khi tạo bài kiểm tra: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
    }
  };

  const getAllExams = async () => {
    try {
      const res = await examService.getAllExams();
      console.log('Exams:', res.content);
      setExamList(res.content || []);
    } catch (error) {
      console.log('Error fetching exams:', error);
      setExamList([]);
    }
  };

  const loadQuestionFilters = async () => {
    try {
      const [fieldsRes, topicsRes, levelsRes, questionTypesRes] = await Promise.all([
        questionService.getAllFields(),
        questionService.getAllTopics(),
        questionService.getAllLevels(),
        questionService.getAllQuestionTypes(),
      ]);

      setFields(fieldsRes.content || []);
      setTopics(topicsRes.content || []);
      setLevels(levelsRes.content || []);
      setQuestionTypes(questionTypesRes.content || []);
    } catch (error) {
      console.log('Error loading question filters:', error);
      // Set empty arrays as fallback
      setFields([]);
      setTopics([]);
      setLevels([]);
      setQuestionTypes([]);
    }
  };

  const handleFilterChange = (newFilters: {
    searchText?: string;
    status?: string;
    position?: string;
    fieldId?: number;
    topicIds?: number[];
    levelId?: number;
    dateRange?: [Dayjs, Dayjs];
  }) => {
    setFilters(newFilters);
  };

  const filteredExams = useMemo(() => {
    let filtered = examList;

    if (filters.searchText) {
      filtered = filtered.filter((exam) =>
        exam.title.toLowerCase().includes(filters.searchText?.toLowerCase() || '')
      );
    }

    if (filters.status) {
      filtered = filtered.filter((exam) => exam.status === filters.status);
    }

    if (filters.position) {
      filtered = filtered.filter((exam) => exam.position === filters.position);
    }

    if (filters.fieldId) {
      filtered = filtered.filter((exam) => exam.fieldId === filters.fieldId);
    }

    if (filters.topicIds && filters.topicIds.length > 0) {
      filtered = filtered.filter((exam) => {
        const examTopicIds = exam.topicIds || [];
        const filterTopicIds = filters.topicIds || [];
        return examTopicIds.some(topicId => filterTopicIds.includes(topicId));
      });
    }

    if (filters.levelId) {
      filtered = filtered.filter((exam) => exam.levelId === filters.levelId);
    }

    if (filters.dateRange) {
      const [startDate, endDate] = filters.dateRange;
      filtered = filtered.filter((exam) => {
        const examDate = new Date(exam.createdAt);
        return examDate >= startDate.toDate() && examDate <= endDate.toDate();
      });
    }

    return filtered;
  }, [examList, filters]);

  useEffect(() => {
    getAllExams();
    loadQuestionFilters();
  }, []);

  // Show not verified state
  if (!isVerified) {
    return <NotVerifiedState />;
  }

  return (
    <div className="container-center animate-fade-in-up">
      <ExamPageHeader onCreateExam={handleCreateExam} />

      <div className="page-content">
        <ExamToolbar
          onFilterChange={handleFilterChange}
          fields={fields}
          topics={topics}
          levels={levels}
        />
        <div className="content-card">
          {filteredExams.length > 0 ? (
            <ExamsTable
              examList={filteredExams}
              onEdit={handleEditExam}
              onPreview={handlePreview}
              onDelete={handleDelete}
            />
          ) : (
            <EmptyState onCreateExam={handleCreateExam} />
          )}
        </div>
      </div>

      <ExamFormPreview
        visible={previewVisible}
        onClose={() => setPreviewVisible(false)}
        exam={selectedExam}
        questionTypes={questionTypes}
      />

      <ExamFormDrawer
        visible={openForm}
        onClose={() => setOpenForm(false)}
        onSave={handleSaveJob}
        initForm={editingExam || undefined}
        currentStep={currentStep}
        onNextStep={handleNextStep}
        onPrevStep={handlePrevStep}
        onFinish={handleFinish}
        fields={fields}
        topics={topics}
        levels={levels}
        questionTypes={questionTypes}
      />
    </div>
  );
};

export default ExamsPage;
