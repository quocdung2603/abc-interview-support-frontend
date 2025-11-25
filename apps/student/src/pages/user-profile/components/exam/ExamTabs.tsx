import {
  Exam,
  ExamRegistration,
  ExamResult,
} from '@abc-interview-support-frontend/types';
import ExamTable from './ExamTable';

interface ExamTabsProps {
  completedExams: (Exam & { result: ExamResult })[];
}

const ExamTabs: React.FC<ExamTabsProps> = ({
  completedExams,
}) => {
  const renderExamTable = () => {
    return (
      <ExamTable
        exams={[
          ...completedExams,
        ]}
        onDetails={(id) => console.log('details', id)}
        onJoin={(id) => console.log('join', id)}
        onOpen={(id) => console.log('open', id)}
        onEnter={(id) => console.log('enter', id)}
        onInfo={(id) => console.log('info', id)}
        onResult={(id) => console.log('result', id)}
      />
    );
  };

  return (
    <div>
      <div style={{ minHeight: '400px' }}>{renderExamTable()}</div>
    </div>
  );
};

export default ExamTabs;
