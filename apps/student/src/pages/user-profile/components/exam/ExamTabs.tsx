import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Exam,
  ExamResult,
  Field,
  Topic,
  Level,
  QuestionType
} from '@abc-interview-support-frontend/types';
import ExamTable from './ExamTable';
import ExamDetailModal from './ExamDetailModal';

interface ExamTabsProps {
  completedExams: (Exam & { result: ExamResult })[];
  fields?: Field[];
  levels?: Level[];
  topics?: Topic[];
  questionTypes?: QuestionType[];
}

const ExamTabs: React.FC<ExamTabsProps> = ({
  completedExams,
  fields,
  levels,
  topics,
  questionTypes,
}) => {
  const navigate = useNavigate();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);

  const handleDetails = (id: number) => {
    setSelectedExamId(id);
    setDetailModalVisible(true);
  };

  const handleResult = (id: number) => {
    navigate(`/mock-interview-result/${id}`);
  };

  const renderExamTable = () => {
    return (
      <ExamTable
        exams={[
          ...completedExams,
        ]}
        onDetails={handleDetails}
        onJoin={(id) => console.log('join', id)}
        onOpen={(id) => console.log('open', id)}
        onEnter={(id) => console.log('enter', id)}
        onInfo={(id) => console.log('info', id)}
        onResult={handleResult}
      />
    );
  };

  return (
    <div className="min-h-[400px]">
      {renderExamTable()}
      <ExamDetailModal
        visible={detailModalVisible}
        examId={selectedExamId}
        onClose={() => {
          setDetailModalVisible(false);
          setSelectedExamId(null);
        }}
        fields={fields}
        levels={levels}
        topics={topics}
        questionTypes={questionTypes}
      />
    </div>
  );
};

export default ExamTabs;
