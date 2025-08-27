import React, { useState } from 'react';
import {
  ExamFormPreview,
  ExamsTable,
  EmptyState,
  NotVerifiedState,
} from './components';
import ExamPageHeader from './components/ExamPageHeader';
import ExamFormDrawer from './components/ExamFormDrawer';
import { Examss } from './components/types';

const ExamsPage: React.FC = () => {
  // Mock verification state
  const isVerified = true;

  // State management
  const initialExam: Examss[] = [
    {
      id: '1',
      title: 'Tuyển dụng Frontend Developer Q1/2024',
      position: 'Frontend Developer',
      status: 'published',
      totalQuestions: 25,
      duration: 90,
      description: 'a',
      candidates: 45,
      topics: ['JavaScript', 'React', 'HTML/CSS'],
      createdAt: '2024-01-15',
      startTime: '2024-01-20T09:00:00',
      endTime: '2024-01-25T18:00:00',
      examPeriod: ['2024-01-20T09:00:00', '2024-01-25T18:00:00'],
      difficulty: {
        easy: true,
        medium: true,
        hard: false,
      },
    },
    {
      id: '2',
      title: 'Tuyển dụng Backend Developer',
      position: 'Backend Developer',
      status: 'draft',
      totalQuestions: 30,
      duration: 120,
      description: 'b',
      candidates: 0,
      topics: ['Node.js', 'Database', 'API'],
      createdAt: '2024-01-10',
      startTime: '2024-01-22T09:00:00',
      endTime: '2024-01-27T18:00:00',
      examPeriod: ['2024-01-22T09:00:00', '2024-01-27T18:00:00'],
      difficulty: {
        easy: false,
        medium: true,
        hard: true,
      },
    },
  ];

  const [openForm, setOpenForm] = useState(false);

  const [editingExam, setEditingExam] = useState<Examss | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [examList, setExamList] = useState<Examss[]>(initialExam);

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

  const handlePreview = (exam: any) => {
    setSelectedExam(exam);
    setPreviewVisible(true);
  };

  const handleCreateExam = () => {
    setEditingExam(null); // <- tạo mới => form rỗng
    setCurrentStep(0); // Reset về bước đầu tiên
    setOpenForm(true);
  };

  const handleEditExam = (exam: Examss) => {
    setEditingExam(exam); // <- sửa => đổ dữ liệu
    setCurrentStep(0); // Reset về bước đầu tiên khi edit
    setOpenForm(true);
  };

  const handleDelete = (examId: string) => {
    //api delete exam
  };

  const handleSaveJob = (payload: Examss, mode: 'create' | 'update') => {
    const now = new Date().toISOString().slice(0, 10);
    if (mode === 'create') {
      const newExam: Examss = {
        ...payload,
        id: crypto.randomUUID?.() ?? String(Date.now()),
        status: 'draft',
        createdAt: now,
        startTime: payload.examPeriod?.[0] || '',
        endTime: payload.examPeriod?.[1] || '',
      };
      setExamList((prev) => [newExam, ...prev]);
      console.log('Created exam:', newExam);
    } else {
      setExamList((prev) =>
        prev.map((exam) =>
          exam.id === payload.id
            ? {
                ...exam,
                ...payload,
                startTime: payload.examPeriod?.[0] || exam.startTime,
                endTime: payload.examPeriod?.[1] || exam.endTime,
              }
            : exam
        )
      );
      console.log('Updated exam:', payload);
    }
    setOpenForm(false);
    setCurrentStep(0);
  };

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
      />
    </div>
  );
};

export default ExamsPage;
