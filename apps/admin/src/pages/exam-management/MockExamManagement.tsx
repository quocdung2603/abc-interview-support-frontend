import { useState, useEffect, useMemo } from 'react';
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

  const handleEditExam = (exam: Exam) => {
    setSelectedExam(exam);
    setCurrentStep(0);
    setFormDrawerVisible(true);
  };

  const handleSaveExam = async (data: any, mode: 'create' | 'update') => {
    try {
      if (mode === 'create') {
        await examService.createExam(data);
        console.log('Created exam:', data);
      } else {
        await examService.updateExam(data.id, data);
        console.log('Updated exam:', data);
      }
      // Refresh data
      getAllExams("VIRTUAL");
    } catch (error) {
      console.error('Error saving exam:', error);
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
      exams = exams.filter((exam) => exam?.examType === examTypes);
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
        <MockExamTable data={filteredExams} onView={handleViewExam} />
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
          totalQuestions: selectedExam.questionCount,
          candidates: 1,
          startTime: '',
          endTime: '',
          questionSource: 'upload',
          selectedQuestions: []
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
