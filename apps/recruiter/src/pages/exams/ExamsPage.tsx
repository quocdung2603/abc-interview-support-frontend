import React, { useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import {
  ExamWizard,
  ExamDetailModal,
  ExamsTable,
  EmptyState,
  NotVerifiedState,
} from './components';
import ExamPageHeader from './components/ExamPageHeader';

const ExamsPage: React.FC = () => {
  // Mock verification state
  const isVerified = true;

  // State management
  const [examList] = useState([
    {
      id: '1',
      title: 'Tuyển dụng Frontend Developer Q1/2024',
      position: 'Frontend Developer',
      status: 'published',
      totalQuestions: 25,
      duration: 90,
      candidates: 45,
      topics: ['JavaScript', 'React', 'HTML/CSS'],
      createdAt: '2024-01-15',
      startTime: '2024-01-20T09:00:00',
      endTime: '2024-01-25T18:00:00',
    },
    {
      id: '2',
      title: 'Tuyển dụng Backend Developer',
      position: 'Backend Developer',
      status: 'draft',
      totalQuestions: 30,
      duration: 120,
      candidates: 0,
      topics: ['Node.js', 'Database', 'API'],
      createdAt: '2024-01-10',
      startTime: '2024-01-22T09:00:00',
      endTime: '2024-01-27T18:00:00',
    },
  ]);

  const [wizardVisible, setWizardVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  // Handler functions
  const handleStatusChange = (examId: string, newStatus: string) => {
    console.log(`Changing exam ${examId} status to ${newStatus}`);
  };

  const handleEdit = (examId: string) => {
    console.log('Edit exam:', examId);
  };

  const handleView = (exam: any) => {
    setSelectedExam(exam);
    setDetailVisible(true);
  };

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
    console.log('Creating exam...');
    setWizardVisible(false);
    setCurrentStep(0);
  };

  const handleCloseWizard = () => {
    setWizardVisible(false);
    setCurrentStep(0);
  };

  const onCreateExam = () => {};

  // Show not verified state
  if (!isVerified) {
    return <NotVerifiedState />;
  }

  return (
    <div className="container-center animate-fade-in-up">
      <ExamPageHeader onCreateExam={onCreateExam} />

      <div className="page-content">
        <div className="content-card">
          {examList.length > 0 ? (
            <ExamsTable
              examList={examList}
              onEdit={handleEdit}
              onView={handleView}
              onStatusChange={handleStatusChange}
            />
          ) : (
            <EmptyState onCreateExam={() => setWizardVisible(true)} />
          )}
        </div>
      </div>

      <ExamWizard
        visible={wizardVisible}
        onClose={handleCloseWizard}
        onFinish={handleFinish}
        currentStep={currentStep}
        onNextStep={handleNextStep}
        onPrevStep={handlePrevStep}
      />

      <ExamDetailModal
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
        exam={selectedExam}
      />
    </div>
  );
};

export default ExamsPage;
