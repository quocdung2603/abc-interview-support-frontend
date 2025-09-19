import { useState, useEffect } from 'react';
import {
  BaseExamPageHeader,
  BaseExamPreviewDrawer,
  BaseExamTable,
  BaseExamToolbar,
} from './components/base-exam';
import { Exam } from '@abc-interview-support-frontend/types';
import { Dayjs } from 'dayjs';

const BaseExamManagement = () => {
  const [previewDrawerVisible, setPreviewDrawerVisible] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);

  // Mock data for base exams (created by enterprises) - only Recruiter type
  useEffect(() => {
    const statusOptions = ['Active', 'Inactive', 'Completed'] as const;
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
    ] as const;

    const mockExams: Exam[] = Array.from({ length: 25 }, (_, i) => {
      const startOffset =
        Math.floor(Math.random() * 14 + 1) * 24 * 60 * 60 * 1000;
      const endOffset =
        Math.floor(Math.random() * 14 + 15) * 24 * 60 * 60 * 1000;

      return {
        examId: `recruiter-exam${i + 1}`,
        title: `Bài kiểm tra sơ loại ${i + 1}: ${
          positions[i % 10] || 'Unknown'
        } - ${companies[i % 7]}`, // Ensure string
        examType: 'Recruiter' as const, // Only recruiter exams
        position: positions[i % 10] || 'Unknown', // Fallback to avoid undefined
        questionCount: Math.floor(Math.random() * 15) + 10,
        duration: Math.floor(Math.random() * 90) + 45,
        language: 'Vietnamese',
        status: statusOptions[i % 3],
        topics:
          'JavaScript, React, Node.js, Database, Testing, Problem Solving',
        questionTypes: 'Trắc nghiệm, Tự luận, Coding, Case Study',
        startTime: new Date(Date.now() + startOffset), // Ensure Date is always created
        endTime: new Date(Date.now() + endOffset),
        createdBy: companies[i % 7], // Enterprise name as creator
        createdAt: new Date(
          Date.now() - Math.floor(Math.random() * 60 + 1) * 24 * 60 * 60 * 1000
        ),
      };
    });
    setExams(mockExams);
    setFilteredExams(mockExams);
  }, []);

  const handleViewExam = (exam: Exam) => {
    console.log('Opening preview for base exam:', exam);
    setSelectedExam(exam);
    setPreviewDrawerVisible(true);
  };

  const handleFilterChange = (filters: {
    searchText?: string;
    status?: string;
    position?: string;
    dateRange?: [Dayjs, Dayjs];
  }) => {
    let filtered = exams;

    if (filters.searchText) {
      filtered = filtered.filter((exam) =>
        exam.title.toLowerCase().includes(filters.searchText!.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter((exam) => exam.status === filters.status);
    }

    if (filters.position) {
      filtered = filtered.filter((exam) => exam.position === filters.position);
    }

    if (filters.dateRange) {
      const [startDate, endDate] = filters.dateRange;
      filtered = filtered.filter((exam) => {
        const examDate = exam.createdAt;
        return examDate >= startDate.toDate() && examDate <= endDate.toDate();
      });
    }

    setFilteredExams(filtered);
  };

  return (
    <div className="container-center animate-fade-in-up">
      <BaseExamPageHeader />
      <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
        <BaseExamToolbar onFilterChange={handleFilterChange} />
        <BaseExamTable data={filteredExams} onView={handleViewExam} />
      </div>
      <BaseExamPreviewDrawer
        visible={previewDrawerVisible}
        onClose={() => setPreviewDrawerVisible(false)}
        data={selectedExam}
      />
    </div>
  );
};

export default BaseExamManagement;
