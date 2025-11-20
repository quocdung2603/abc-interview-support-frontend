import ExamCard from './ExamCard';

interface Exam {
  id: number;
  examId?: string;
  userId?: string;
  examType: 'Virtual' | 'Recruiter';
  title: string;
  position?: string;
  topics: string;
  questionTypes: string;
  questionCount: number;
  duration: number;
  startTime?: Date;
  endTime?: Date;
  status: 'Active' | 'Inactive' | 'Completed' | 'DRAFT';
  language: string;
  createdAt: Date;
  createdBy: string;
}

interface ExamListProps {
  title: string;
  exams: Exam[];
  emptyMessage?: string;
  onStartExam?: (examId: string) => void;
  showCreatedBadge?: boolean;
}

const ExamList: React.FC<ExamListProps> = ({
  title,
  exams,
  emptyMessage = 'Không có bài kiểm tra nào.',
  onStartExam,
  showCreatedBadge = false,
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-base text-primary font-semibold">{title}</h2>
        <span className="badge-secondary text-sm">{exams.length}</span>
      </div>

      {exams.length === 0 ? (
        <div className="text-center p-8 bg-neutral-50 border-2 border-dashed border-neutral-300 rounded-lg">
          <div className="text-neutral-400 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-neutral-500 text-body-large font-medium mb-2">
            {emptyMessage}
          </p>
          <p className="text-neutral-400 text-body-small">
            💡 Hãy tạo bài kiểm tra mới hoặc thay đổi tiêu chí tìm kiếm
          </p>
        </div>
      ) : (
        <div
          className="max-h-[70vh] overflow-y-auto"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'var(--color-accent) var(--color-neutral-200)',
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {exams.map((exam, index) => (
              <div
                key={`${exam.id}-${index}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ExamCard
                  exam={exam}
                  onStartExam={onStartExam}
                  isCreated={showCreatedBadge}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamList;
