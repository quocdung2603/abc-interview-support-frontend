import { useState, useEffect } from 'react';
import {
  ExamApprovalFormDrawer,
  ExamApprovalPageHeader,
  ExamApprovalTable,
  ExamApprovalToolbar,
} from './components/exam-approval';
import { Exam } from '@abc-interview-support-frontend/types';

const ExamApproval = () => {
  const [formDrawerVisible, setFormDrawerVisible] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);

  // Mock data for exams pending approval
  useEffect(() => {
    const statusOptions = ['Active', 'Inactive'] as const;
    const positions = [
      'Frontend Developer',
      'Backend Developer',
      'Fullstack Developer',
      'DevOps Engineer',
      'Mobile Developer',
      'Data Analyst',
      'QA Engineer',
      'Product Manager',
      'Business Analyst',
      'UI/UX Designer',
    ] as const;
    const companies = [
      'TechCorp Vietnam',
      'Innovate Solutions',
      'Digital Dynamics',
      'Future Systems',
      'Smart Tech Co.',
      'Global Solutions',
      'NextGen Tech',
      'Enterprise Solutions',
    ] as const;
    const users = [
      'john.doe@example.com',
      'jane.smith@company.com',
      'mike.wilson@tech.com',
      'sarah.jones@startup.com',
      'david.brown@enterprise.com',
    ] as const;

    const mockExams: Exam[] = Array.from({ length: 15 }, (_, i) => {
      const startOffset =
        Math.floor(Math.random() * 14 + 1) * 24 * 60 * 60 * 1000;
      const endOffset =
        Math.floor(Math.random() * 14 + 15) * 24 * 60 * 60 * 1000;

      return {
        examId: `pending-exam${i + 1}`,
        title: `Bài kiểm tra chờ duyệt ${i + 1}: ${
          positions[i % 10] || 'Unknown'
        } - ${companies[i % 8]}`,
        examType: i % 2 === 0 ? 'Virtual' : 'Recruiter',
        position: positions[i % 10] || 'Unknown',
        questionCount: Math.floor(Math.random() * 15) + 10,
        duration: Math.floor(Math.random() * 90) + 45,
        language: 'Vietnamese',
        status: statusOptions[i % 2],
        topics:
          'JavaScript, React, Node.js, Database, Testing, Problem Solving',
        questionTypes: 'Trắc nghiệm, Tự luận, Coding, Case Study',
        startTime: new Date(Date.now() + startOffset),
        endTime: new Date(Date.now() + endOffset),
        createdBy: i % 3 === 0 ? companies[i % 8] : users[i % 5],
        createdAt: new Date(
          Date.now() - Math.floor(Math.random() * 7 + 1) * 24 * 60 * 60 * 1000
        ),
      };
    });
    setExams(mockExams);
    setFilteredExams(mockExams);
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

  const handleSubmitApprove = (examId: string) => {
    setExams((prev) => prev.filter((exam) => exam.examId !== examId));
    setFilteredExams((prev) => prev.filter((exam) => exam.examId !== examId));
  };

  const handleSubmitReject = (examId: string, reason: string) => {
    console.log('Rejecting exam:', examId, 'Reason:', reason);
    setExams((prev) => prev.filter((exam) => exam.examId !== examId));
    setFilteredExams((prev) => prev.filter((exam) => exam.examId !== examId));
  };

  const handleFilterChange = (filters: {
    searchText?: string;
    examType?: string;
    status?: string;
    dateRange?: [Date, Date];
  }) => {
    let filtered = exams;

    if (filters.searchText) {
      filtered = filtered.filter((exam) =>
        exam.title.toLowerCase().includes(filters.searchText!.toLowerCase())
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
        const examDate = exam.createdAt;
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
      />
    </div>
  );
};

export default ExamApproval;
