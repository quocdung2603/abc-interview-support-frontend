import { useState, useEffect } from 'react';
import {
  ExamApprovalFormDrawer,
  ExamApprovalPageHeader,
  ExamApprovalTable,
  ExamApprovalToolbar,
} from './components/exam-approval';
import { Exam, Field, Topic, Level, QuestionType } from '@abc-interview-support-frontend/types';
import { examService, questionService } from '@abc-interview-support-frontend/services';

const ExamApproval = () => {
  const [formDrawerVisible, setFormDrawerVisible] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([]);

  const handleViewExam = (exam: Exam) => {
    console.log('Opening approval form for exam:', exam);
    setSelectedExam(exam);
    setFormDrawerVisible(true);
  };

  const handleSubmitApprove = async (examId: number) => {
    // Refresh data after approval
    await getAllExams();
  };

  const handleSubmitReject = async (examId: number, reason: string) => {
    console.log('Rejecting exam:', examId, 'Reason:', reason);
    // Refresh data after rejection
    await getAllExams();
  };

  const handleFilterChange = (filters: {
    searchText?: string;
    examType?: string;
    status?: string;
    fieldId?: number;
    topicIds?: number[];
    levelId?: number;
    dateRange?: [Date, Date];
  }) => {
    let filtered = exams;

    if (filters.searchText && typeof filters.searchText === 'string') {
      const searchText = filters.searchText;
      filtered = filtered.filter((exam) =>
        exam.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (filters.examType) {
      filtered = filtered.filter((exam) => exam.examType === filters.examType);
    }

    if (filters.status) {
      filtered = filtered.filter((exam) => exam.status === filters.status);
    }

    if (filters.fieldId !== undefined) {
      filtered = filtered.filter((exam) => exam.fieldId === filters.fieldId);
    }

    if (filters.topicIds && filters.topicIds.length > 0) {
      const topicIds = filters.topicIds;
      filtered = filtered.filter((exam) =>
        topicIds.some(topicId => exam.topicIds.includes(topicId))
      );
    }

    if (filters.levelId !== undefined) {
      filtered = filtered.filter((exam) => exam.levelId === filters.levelId);
    }

    if (filters.dateRange) {
      const [startDate, endDate] = filters.dateRange;
      filtered = filtered.filter((exam) => {
        const examDate = new Date(exam.createdAt);
        return examDate >= startDate && examDate <= endDate;
      });
    }

    setFilteredExams(filtered);
  };

  const getAllExams = async () => {
    try {
      const res = await examService.getAllExams();
      console.log(res);
      let exams: Exam[] = (res.content as Exam[]) || [];
      exams = exams.filter((exam) => exam?.status === 'DRAFT');
      console.log('All Mock Exams:', exams);
      setExams(exams);
      setFilteredExams(exams);
    } catch (error) {
      console.error('Error fetching mock exams:', error);
      setExams([]);
      setFilteredExams([]);
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
    getAllExams();
    loadFilterData();
  }, [])


  return (
    <div className="container-center animate-fade-in-up">
      <ExamApprovalPageHeader />
      <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
        <ExamApprovalToolbar
          onFilterChange={handleFilterChange}
          fields={fields}
          topics={topics}
          levels={levels}
        />
        <ExamApprovalTable
          data={filteredExams}
          onView={handleViewExam}
        />
      </div>
      <ExamApprovalFormDrawer
        visible={formDrawerVisible}
        onClose={() => setFormDrawerVisible(false)}
        data={selectedExam}
        onApprove={handleSubmitApprove}
        onReject={handleSubmitReject}
        fields={fields}
        topics={topics}
        levels={levels}
        questionTypes={questionTypes}
      />
    </div>
  );
};

export default ExamApproval;
