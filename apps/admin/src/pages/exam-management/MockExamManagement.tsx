import { useState, useEffect, useMemo } from 'react';
import { message } from 'antd';
import {
  MockExamPageHeader,
  MockExamPreviewDrawer,
  MockExamTable,
  MockExamToolbar,
  MockExamFormDrawer,
} from './components/mock-exam';
import { Exam, Field, Level, Topic, QuestionType } from '@abc-interview-support-frontend/types';
import { Dayjs } from 'dayjs';
import { examService, questionService } from '@abc-interview-support-frontend/services';

const MockExamManagement = () => {
  const [dataList, setDataList] = useState<Exam[]>([]);
  const [previewDrawerVisible, setPreviewDrawerVisible] = useState(false);
  const [formDrawerVisible, setFormDrawerVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
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

  const handleViewExam = (exam: Exam) => {
    console.log('Opening preview for mock exam:', exam);
    setSelectedExam(exam);
    setPreviewDrawerVisible(true);
  };

  const handleCreateExam = () => {
    setSelectedExam(null);
    setCurrentStep(0);
    setFormDrawerVisible(true);
  };

  const handleEditExam = async (exam: Exam) => {
    try {
      // Fetch full exam details including questions
      const examDetails = await examService.getExamById(exam.id.toString());
      setSelectedExam(examDetails);
      setCurrentStep(0);
      setFormDrawerVisible(true);
    } catch (error) {
      console.error('Error fetching exam details:', error);
      message.error('Lỗi khi tải thông tin bài kiểm tra. Vui lòng thử lại.');
    }
  };

  const handleSaveExam = async (data: any, mode: 'create' | 'update') => {
    try {
      if (mode === 'create') {
        const response = await examService.createExam(data);
        const examId = response.id;
        console.log('Created exam:', response);

        // Add questions to the exam
        if (data.questions && data.questions.length > 0) {
          for (let i = 0; i < data.questions.length; i++) {
            await examService.addQuestionToExam(examId.toString(), data.questions[i].id, i + 1);
          }
        }
        message.success('Tạo bài kiểm tra thành công!');
      } else {
        // Update mode: update exam -> remove all questions -> add new questions
        await examService.updateExam(data.id, data);
        console.log('Updated exam:', data);

        // Remove all existing questions
        if (selectedExam?.questions && selectedExam.questions.length > 0) {
          await examService.removeQuestionFromExam(data.id.toString());
        }

        // Add new questions
        if (data.questions && data.questions.length > 0) {
          for (let i = 0; i < data.questions.length; i++) {
            await examService.addQuestionToExam(data.id.toString(), data.questions[i].id, i + 1);
          }
        }
        message.success('Cập nhật bài kiểm tra thành công!');
      }
      // Refresh data
      getAllExams("VIRTUAL");
    } catch (error) {
      console.error('Error saving exam:', error);
      message.error('Có lỗi xảy ra. Vui lòng thử lại.');
      throw error;
    }
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 2));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleFinish = () => {
    setFormDrawerVisible(false);
    setCurrentStep(0);
    setSelectedExam(null);
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
    let filtered = dataList;

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
  }, [dataList, filters]);

  const getAllExams = async (examTypes: string) => {
    try {
      const res = await examService.getAllExams();
      console.log(res);
      let exams: Exam[] = (res.content as Exam[]) || [];
      exams = exams.filter((exam) => exam?.examType === examTypes && exam?.status === 'PUBLISHED');
      console.log('All Mock Exams:', exams);
      setDataList(exams);
    } catch (error) {
      console.error('Error fetching mock exams:', error);
      setDataList([]);
    }
  }

  const loadFilterData = async () => {
    try {
      const [fieldsRes, topicsRes, levelsRes, questionTypesRes] = await Promise.all([
        questionService.getAllFields(),
        questionService.getAllTopics(),
        questionService.getAllLevels(),
        questionService.getAllQuestionTypes()
      ]);
      setFields(fieldsRes.content || []);
      setTopics(topicsRes.content || []);
      setLevels(levelsRes.content || []);
      setQuestionTypes(questionTypesRes.content || []);
    } catch (error) {
      console.error('Error loading filter data:', error);
    }
  }

  useEffect(() => {
    getAllExams("VIRTUAL");
    loadFilterData();
  }, [])

  return (
    <div className="container-center animate-fade-in-up">
      <MockExamPageHeader onCreate={handleCreateExam} />
      <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
        <MockExamToolbar
          onFilterChange={handleFilterChange}
          fields={fields}
          topics={topics}
          levels={levels}
        />
        <MockExamTable data={filteredExams} onView={handleViewExam} onEdit={handleEditExam} />
      </div>
      <MockExamPreviewDrawer
        visible={previewDrawerVisible}
        onClose={() => setPreviewDrawerVisible(false)}
        data={selectedExam}
        fields={fields}
        topics={topics}
        levels={levels}
      />
      <MockExamFormDrawer
        currentStep={currentStep}
        onClose={() => setFormDrawerVisible(false)}
        visible={formDrawerVisible}
        initForm={selectedExam ? {
          ...selectedExam,
          candidates: 1,
          startTime: '',
          endTime: '',
          questionSource: 'upload',
        } : undefined}
        onSave={handleSaveExam}
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

export default MockExamManagement;
