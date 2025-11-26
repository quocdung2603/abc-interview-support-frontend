import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import {
  ExamFormPreview,
  ExamsTable,
  EmptyState,
  NotVerifiedState,
} from './components';
import ExamPageHeader from './components/ExamPageHeader';
import ExamFormDrawer from './components/ExamFormDrawer';
import { Exam, Field, Topic, Level, QuestionType } from '@abc-interview-support-frontend/types';
import { examService, questionService } from '@abc-interview-support-frontend/services';

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
  // Override to use correct field names
  topics?: number[];
  questionTypes?: number[];
}

const ExamsPage: React.FC = () => {
  // Mock verification state
  const isVerified = true;

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

  const handleEditExam = (exam: Exam) => {
    // Convert Exam to CreateFormFields for the form
    const formData = {
      ...exam,
      totalQuestions: exam.questionCount,
      candidates: 1, // Default value
      startTime: '',
      endTime: '',
      examPeriod: undefined,
      difficulty: {
        easy: true,
        medium: true,
        hard: false,
      },
      selectedQuestions: [], // Initialize empty for edit mode
    };
    setEditingExam(formData); // <- sửa => đổ dữ liệu
    setCurrentStep(0); // Reset về bước đầu tiên khi edit
    setOpenForm(true);
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
        const user = { userId: 1 }; // TODO: Get from auth context

        // Prepare API data according to the required format
        const apiData = {
          examType: "RECRUITER",
          title: payload.title || '',
          position: payload.position || '',
          topics: payload.topicIds || [], // Already an array of numbers
          questionTypes: payload.questionTypeIds || [], // Already an array of numbers
          questionCount: payload.questionCount,
          duration: payload.duration,
          userId: user.userId
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
          createdBy: response.createdBy || user.userId,
        };

        setExamList((prev) => [createdExam, ...prev]);

        // Show success message
        message.success('Tạo bài kiểm tra thành công!');

      } else {
        // Update exam
        const user = { userId: 1 }; // TODO: Get from auth context

        // Prepare API data for update
        const apiData = {
          userId: user.userId,
          examType: "VIRTUAL", // Different from create
          title: payload.title || '',
          position: payload.position || '',
          topics: payload.topicIds || [],
          questionTypes: payload.questionTypeIds || [],
          questionCount: payload.questionCount,
          duration: payload.duration,
          language: "English" // Different from create
        };

        console.log('Updating exam with API data:', apiData);

        // Call API to update exam
        const response = await examService.updateExam(payload.id.toString(), apiData);
        console.log('Exam updated successfully:', response);

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
        <div className="content-card">
          {examList.length > 0 ? (
            <ExamsTable
              examList={examList}
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
