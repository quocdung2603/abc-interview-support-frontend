import { useState, useEffect } from 'react';
import {
  MockExamFormDrawer,
  MockExamPageHeader,
  MockExamPreviewDrawer,
  MockExamTable,
  MockExamToolbar,
} from './components/mock-exam';
import { Exam } from '@abc-interview-support-frontend/types';

const MockExamManagement = () => {
  const [previewDrawerVisible, setPreviewDrawerVisible] = useState(false);
  const [formDrawerVisible, setFormDrawerVisible] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);

  // Mock data for virtual exams only
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
      'UI/UX Designer',
    ] as const;
    const mockExams: Exam[] = Array.from({ length: 20 }, (_, i) => {
      const startOffset =
        Math.floor(Math.random() * 7 + 1) * 24 * 60 * 60 * 1000;
      const endOffset = Math.floor(Math.random() * 7 + 8) * 24 * 60 * 60 * 1000;
      return {
        examId: `virtual-exam${i + 1}`,
        title: `Bài kiểm tra ảo ${i + 1}: ${positions[i % 8] || 'Unknown'}`, // Ensure string
        examType: 'Virtual' as const, // Only virtual exams
        position: positions[i % 8] || 'Unknown', // Fallback to avoid undefined
        questionCount: Math.floor(Math.random() * 20) + 5,
        duration: Math.floor(Math.random() * 120) + 30,
        language: 'Vietnamese',
        status: statusOptions[i % 3],
        topics: 'React, JavaScript, HTML/CSS, Node.js, Database',
        questionTypes: 'Trắc nghiệm, Tự luận, Coding',
        startTime: new Date(Date.now() + startOffset), // Ensure Date is always created
        endTime: new Date(Date.now() + endOffset),
        createdBy: 'Admin',
        createdAt: new Date(
          Date.now() - Math.floor(Math.random() * 30 + 1) * 24 * 60 * 60 * 1000
        ),
      };
    });
    setExams(mockExams);
    setFilteredExams(mockExams);
  }, []);

  const handleViewExam = (exam: Exam) => {
    console.log('Opening preview for exam:', exam);
    setSelectedExam(exam);
    setPreviewDrawerVisible(true);
  };

  const handleEditExam = (exam: Exam) => {
    setSelectedExam(exam);
    setFormDrawerVisible(true);
  };

  const handleCreateExam = () => {
    setSelectedExam(null);
    setFormDrawerVisible(true);
  };

  const handleDeleteExam = (examId: string) => {
    setExams((prev) => prev.filter((exam) => exam.examId !== examId));
    setFilteredExams((prev) => prev.filter((exam) => exam.examId !== examId));
  };

  const handleSubmitExam = (examData: Partial<Exam>) => {
    if (selectedExam) {
      // Update existing exam
      const updatedExams = exams.map((exam) =>
        exam.examId === selectedExam.examId ? { ...exam, ...examData } : exam
      );
      setExams(updatedExams);
      setFilteredExams(updatedExams);
    } else {
      // Create new exam
      const newExam: Exam = {
        examId: `exam${Date.now()}`,
        title: examData.title || '',
        examType: examData.examType || 'Virtual',
        position: examData.position || '',
        questionCount: examData.questionCount || 0,
        duration: examData.duration || 60,
        language: examData.language || 'Vietnamese',
        status: examData.status || 'Active',
        topics: examData.topics || '',
        questionTypes: examData.questionTypes || '',
        startTime: examData.startTime,
        endTime: examData.endTime,
        createdBy: 'Admin',
        createdAt: new Date(),
      };
      const updatedExams = [...exams, newExam];
      setExams(updatedExams);
      setFilteredExams(updatedExams);
    }
  };

  const handleFilterChange = (filters: {
    searchText?: string;
    status?: string;
    position?: string;
    dateRange?: [Date, Date];
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
        return examDate >= startDate && examDate <= endDate;
      });
    }

    setFilteredExams(filtered);
  };

  return (
    <div className="container-center animate-fade-in-up">
      <MockExamPageHeader onCreate={handleCreateExam} />
      <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
        <MockExamToolbar onFilterChange={handleFilterChange} />
        <MockExamTable
          data={filteredExams}
          onView={handleViewExam}
          onEdit={handleEditExam}
          onDelete={handleDeleteExam}
        />
      </div>
      <MockExamPreviewDrawer
        visible={previewDrawerVisible}
        onClose={() => setPreviewDrawerVisible(false)}
        data={selectedExam}
      />
      <MockExamFormDrawer
        visible={formDrawerVisible}
        onClose={() => setFormDrawerVisible(false)}
        data={selectedExam}
        onSubmit={handleSubmitExam}
      />
    </div>
  );
};

export default MockExamManagement;
