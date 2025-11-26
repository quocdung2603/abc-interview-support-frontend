import { useState, useEffect } from 'react';
import {
  ExamApprovalFormDrawer,
  ExamApprovalPageHeader,
  ExamApprovalTable,
  ExamApprovalToolbar,
} from './components/exam-approval';
import { Exam, Field, Topic, Level, QuestionType } from '@abc-interview-support-frontend/types';

const ExamApproval = () => {
  const [formDrawerVisible, setFormDrawerVisible] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([]);

  // Load exams and reference data
  useEffect(() => {
    // TODO: Replace with actual API calls
    // Mock data for now
    setFields([
      { id: 1, name: 'Frontend' },
      { id: 2, name: 'Backend' },
      { id: 3, name: 'DevOps' },
    ]);
    setTopics([
      { id: 1, fieldId: 1, fieldName: 'Frontend', name: 'React' },
      { id: 2, fieldId: 1, fieldName: 'Frontend', name: 'Vue' },
      { id: 3, fieldId: 2, fieldName: 'Backend', name: 'Node.js' },
    ]);
    setLevels([
      { id: 1, name: 'Junior' },
      { id: 2, name: 'Mid' },
      { id: 3, name: 'Senior' },
    ]);
    setQuestionTypes([
      { id: 1, name: 'Multiple Choice' },
      { id: 2, name: 'Essay' },
      { id: 3, name: 'Fill in the Blank' },
    ]);

    setExams([]);
    setFilteredExams([]);
  }, []);

  const handleViewExam = (exam: Exam) => {
    console.log('Opening approval form for exam:', exam);
    setSelectedExam(exam);
    setFormDrawerVisible(true);
  };

  const handleApproveExam = (exam: Exam) => {
    console.log('Approving exam:', exam);
    setSelectedExam(exam);
    setFormDrawerVisible(true);
  };

  const handleRejectExam = (exam: Exam) => {
    console.log('Rejecting exam:', exam);
    setSelectedExam(exam);
    setFormDrawerVisible(true);
  };

  const handleSubmitApprove = (examId: number) => {
    setExams((prev) => prev.filter((exam) => exam.id !== examId));
    setFilteredExams((prev) => prev.filter((exam) => exam.id !== examId));
  };

  const handleSubmitReject = (examId: number, reason: string) => {
    console.log('Rejecting exam:', examId, 'Reason:', reason);
    setExams((prev) => prev.filter((exam) => exam.id !== examId));
    setFilteredExams((prev) => prev.filter((exam) => exam.id !== examId));
  };

  const handleFilterChange = (filters: {
    searchText?: string;
    examType?: string;
    status?: string;
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

    if (filters.dateRange) {
      const [startDate, endDate] = filters.dateRange;
      filtered = filtered.filter((exam) => {
        const examDate = new Date(exam.createdAt);
        return examDate >= startDate && examDate <= endDate;
      });
    }

    setFilteredExams(filtered);
  };

  return (
    <div className="container-center animate-fade-in-up">
      <ExamApprovalPageHeader />
      <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
        <ExamApprovalToolbar onFilterChange={handleFilterChange} />
        <ExamApprovalTable
          data={filteredExams}
          onView={handleViewExam}
          onApprove={handleApproveExam}
          onReject={handleRejectExam}
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
