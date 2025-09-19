import React, { useState, useEffect } from 'react';
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

  // Mock data for exams
  useEffect(() => {
    const mockExams: Exam[] = Array.from({ length: 20 }, (_, i) => ({
      examId: `exam${i + 1}`,
      title: `Bài kiểm tra ${i + 1}: ${
        [
          'Frontend Developer',
          'Backend Developer',
          'Fullstack Developer',
          'DevOps Engineer',
          'Mobile Developer',
        ][i % 5]
      }`,
      examType: i % 2 === 0 ? 'Virtual' : 'Recruiter',
      position: [
        'Frontend Developer',
        'Backend Developer',
        'Fullstack Developer',
        'DevOps Engineer',
        'Mobile Developer',
      ][i % 5],
      questionCount: Math.floor(Math.random() * 20) + 5,
      duration: Math.floor(Math.random() * 120) + 30,
      language: 'Vietnamese',
      status: ['Active', 'Inactive', 'Completed'][i % 3],
      topics: 'React, JavaScript, HTML/CSS',
      questionTypes: 'Trắc nghiệm, Tự luận',
      startTime:
        i % 3 === 0
          ? new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000)
          : undefined,
      endTime:
        i % 3 === 0
          ? new Date(Date.now() + (Math.random() * 7 + 1) * 24 * 60 * 60 * 1000)
          : undefined,
      createdBy: 'Admin',
      createdAt: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ),
    }));
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
        topics: examData.topics,
        questionTypes: examData.questionTypes,
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
    examType?: string;
    status?: string;
    dateRange?: [Date, Date];
  }) => {
    let filtered = exams;

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
      <MockExamPageHeader />
      <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
        <MockExamToolbar
          onCreateExam={handleCreateExam}
          onFilterChange={handleFilterChange}
        />
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
