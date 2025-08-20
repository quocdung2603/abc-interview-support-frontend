import { useState } from 'react';
import TabNavigation from '../TabNavigation';
import {
  Exam,
  ExamRegistration,
  Result,
} from '@abc-interview-support-frontend/types';
import ScreeningExamTab from './ScreeningExamTab';
import VirtualInterviewTab from './VirtualInterviewTab';

interface ExamTabsProps {
  completedExams: (Exam & { result: Result })[];
  registeredExams: (Exam & { registration: ExamRegistration })[];
  upcomingExams: (Exam & { registration: ExamRegistration })[];
}

const ExamTabs: React.FC<ExamTabsProps> = ({
  completedExams,
  registeredExams,
  upcomingExams,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<string>('mock-exam');

  const subTabs = [
    {
      id: 'mock-exam',
      label: 'Phỏng vấn ảo',
      icon: '',
      description: 'Quản lý bài kiểm tra ảo',
      badge: undefined,
    },
    {
      id: 'base-exam',
      label: 'Kiểm tra sơ loại',
      icon: '',
      description: 'Các bài kiểm tra đầu vào sơ loại',
      badge: undefined,
    },
  ];

  const renderMockExam = () => {
    return (
      <VirtualInterviewTab
        exams={
          [...completedExams, ...registeredExams, ...upcomingExams] as Exam[]
        }
        onDetails={(id) => console.log('details', id)}
        onJoin={(id) => console.log('join', id)}
        onOpen={(id) => console.log('open', id)}
      />
    );
  };

  const renderBaseExam = () => {
    return (
      <ScreeningExamTab
        exams={
          [...completedExams, ...registeredExams, ...upcomingExams] as Exam[]
        }
        onDetails={(id) => console.log('details', id)}
        onEnter={(id: string) => console.log('join', id)}
        onResult={(id: string) => console.log('open', id)}
        onInfo={(id: string) => console.log('open', id)}
      />
    );
  };

  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case 'mock-exam':
        return renderMockExam();
      case 'base-exam':
        return renderBaseExam();
      default:
        return null;
    }
  };

  return (
    <div>
      <TabNavigation
        tabs={subTabs}
        activeTab={activeSubTab}
        onTabChange={setActiveSubTab}
      />
      <div style={{ minHeight: '400px' }}>{renderSubTabContent()}</div>
    </div>
  );
};

export default ExamTabs;
