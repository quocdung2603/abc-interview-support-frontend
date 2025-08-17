interface Exam {
  examId: string;
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
  status: 'Active' | 'Inactive' | 'Completed';
  language: string;
  createdAt: Date;
  createdBy: string;
}

interface ExamCardProps {
  exam: Exam;
  onStartExam?: (examId: string) => void;
  isCreated?: boolean;
}

const ExamCard: React.FC<ExamCardProps> = ({
  exam,
  onStartExam,
  isCreated = false,
}) => {
  const handleStartExam = () => {
    if (onStartExam) {
      onStartExam(exam.examId);
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} phút`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const minutesPart = remainingMinutes > 0 ? ` ${remainingMinutes}m` : '';
    return `${hours}h${minutesPart}`;
  };

  const getQuestionTypeNames = (questionTypes: string) => {
    try {
      const types = JSON.parse(questionTypes) as string[];
      const typeMap: Record<string, string> = {
        SingleChoice: 'Một lựa chọn',
        MultipleChoice: 'Nhiều lựa chọn',
        FillInTheBlank: 'Điền khuyết',
        OpenEnded: 'Tự luận',
      };
      return types.map((type) => typeMap[type] || type).join(', ');
    } catch {
      return questionTypes;
    }
  };

  const getTopicNames = (topics: string) => {
    try {
      const topicArray = JSON.parse(topics) as string[];
      return topicArray.join(', ');
    } catch {
      return topics;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Active':
        return 'badge-success';
      case 'Completed':
        return 'badge-secondary';
      case 'Inactive':
        return 'badge-warning';
      default:
        return 'badge-neutral';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Active':
        return 'Đang hoạt động';
      case 'Completed':
        return 'Đã hoàn thành';
      case 'Inactive':
        return 'Không hoạt động';
      default:
        return status;
    }
  };

  return (
    <div
      className={`card-interactive p-4 relative animate-fade-in-up ${
        isCreated ? 'border-2 border-accent ' : ''
      }`}
      style={{
        background: isCreated
          ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.02) 0%, rgba(14, 165, 233, 0.05) 100%)'
          : 'white',
        ...(isCreated && {
          position: 'relative',
        }),
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-primary mb-1">
            {exam.title}
          </h3>
          {exam.position && (
            <p className="text-xs text-neutral-600 mb-1">💼 {exam.position}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(
              exam.status
            )}`}
          >
            {getStatusText(exam.status)}
          </span>
          {isCreated && (
            <span className="text-xs px-2 py-1 rounded-full badge-accent">
              ✨ Mới tạo
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2 mb-4">
        {/* Topics */}
        <div className="flex items-start gap-2">
          <span className="text-xs font-semibold text-neutral-700 min-w-[60px] flex items-center">
            🎯 Chủ đề:
          </span>
          <span className="text-xs text-neutral-600 flex-1">
            {getTopicNames(exam.topics)}
          </span>
        </div>

        {/* Question Types */}
        <div className="flex items-start gap-2">
          <span className="text-xs font-semibold text-neutral-700 min-w-[60px] flex items-center">
            📝 Câu hỏi:
          </span>
          <span className="text-xs text-neutral-600 flex-1">
            {getQuestionTypeNames(exam.questionTypes)}
          </span>
        </div>

        {/* Stats Grid - More compact */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="text-center p-2 bg-neutral-50 rounded-md border">
            <div className="text-sm font-bold text-primary">
              {exam.questionCount}
            </div>
            <div className="text-xs text-neutral-500">Câu hỏi</div>
          </div>

          <div className="text-center p-2 bg-neutral-50 rounded-md border">
            <div className="text-sm font-bold text-accent">
              {formatDuration(exam.duration)}
            </div>
            <div className="text-xs text-neutral-500">Thời gian</div>
          </div>

          <div className="text-center p-2 bg-neutral-50 rounded-md border">
            <div className="text-sm">
              {exam.language === 'vi' ? '🇻🇳' : '🇺🇸'}
            </div>
            <div className="text-xs text-neutral-500">Ngôn ngữ</div>
          </div>
        </div>

        {/* Dates - More compact */}
        {(exam.startTime || exam.endTime) && (
          <div className="pt-2 mt-2 border-t border-neutral-200">
            {exam.startTime && (
              <div className="text-xs text-neutral-600 mb-1 flex items-center gap-1">
                <span>🕒</span>
                <span className="font-semibold">Bắt đầu:</span>
                <span>{new Date(exam.startTime).toLocaleString('vi-VN')}</span>
              </div>
            )}
            {exam.endTime && (
              <div className="text-xs text-neutral-600 flex items-center gap-1">
                <span>⏰</span>
                <span className="font-semibold">Kết thúc:</span>
                <span>{new Date(exam.endTime).toLocaleString('vi-VN')}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        {(() => {
          if (exam.status === 'Active') {
            return (
              <button
                onClick={handleStartExam}
                className="btn-primary flex items-center gap-1 px-4 py-2 text-sm"
              >
                <span>🚀</span> Bắt Đầu
              </button>
            );
          }

          if (exam.status === 'Completed') {
            return (
              <button
                className="btn-secondary flex items-center gap-1 px-4 py-2 text-sm"
                disabled
              >
                <span>✅</span> Hoàn Thành
              </button>
            );
          }

          return (
            <button
              className="btn-outline flex items-center gap-1 px-4 py-2 text-sm"
              disabled
            >
              <span>⏸️</span> Không Khả Dụng
            </button>
          );
        })()}
      </div>
    </div>
  );
};

export default ExamCard;
