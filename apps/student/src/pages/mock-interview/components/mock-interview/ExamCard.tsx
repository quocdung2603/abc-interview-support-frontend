import { useState } from 'react';
import { Exam } from '@abc-interview-support-frontend/types';

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStartExam = () => {
    setIsModalOpen(true);
  };

  const handleConfirmStart = () => {
    if (onStartExam) {
      onStartExam(exam.id.toString());
    }
    setIsModalOpen(false);
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
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

  return (
    <div
      className={`card-interactive p-2.5 relative animate-fade-in-up ${isCreated ? 'border-2 border-accent ' : ''
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
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-primary mb-1">
            {exam.title}
          </h3>
          {exam.position && (
            <p className="text-xs text-neutral-600 mb-1">{exam.position}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-1 mb-2">
        {/* Stats Grid - More compact */}
        <div className="grid grid-cols-3 gap-1 pt-1">
          <div className="text-center p-1 bg-neutral-50 rounded border">
            <div className="text-xs font-bold text-primary">
              {exam.questionCount}
            </div>
            <div className="text-xs text-neutral-500">Câu hỏi</div>
          </div>

          <div className="text-center p-1 bg-neutral-50 rounded border">
            <div className="text-xs font-bold text-accent">
              {formatDuration(exam.duration)}
            </div>
            <div className="text-xs text-neutral-500">Thời gian</div>
          </div>

          <div className="text-center p-1 bg-neutral-50 rounded border">
            <div className="text-xs">
              {exam.language === 'vi' ? '🇻🇳' : '🇺🇸'}
            </div>
            <div className="text-xs text-neutral-500">Ngôn ngữ</div>
          </div>
        </div>

        {/* Dates - More compact */}
        <div className="pt-1.5 mt-1.5 border-t border-neutral-200">
          <div className="text-xs text-neutral-600 mb-1 flex items-center gap-1">
            <span className="font-semibold">Ngày tạo:</span>
            <span>{new Date(exam.createdAt).toLocaleString('vi-VN')}</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end pt-1">
        {(() => {
          if (exam.status === 'ACTIVE' || exam.status === 'DRAFT') {
            return (
              <button
                onClick={handleStartExam}
                className="btn-primary flex items-center gap-1 px-3 py-1 text-xs"
              >
                Bắt Đầu
              </button>
            );
          }

          if (exam.status === 'COMPLETED') {
            return (
              <button
                className="btn-secondary flex items-center gap-1 px-3 py-1 text-xs"
                disabled
              >
                Hoàn Thành
              </button>
            );
          }

          return (
            <button
              className="btn-outline flex items-center gap-1 px-3 py-1 text-xs"
              disabled
            >
              Không Khả Dụng
            </button>
          );
        })()}
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-base font-bold text-primary mb-4">
              Xác Nhận Bắt Đầu Bài Kiểm Tra
            </h3>

            {/* Exam Details */}
            <div className="space-y-3 mb-6">
              <div className="p-4 bg-neutral-50 rounded-lg">
                <h4 className="font-semibold text-sm text-neutral-700 mb-3">
                  Thông tin bài kiểm tra:
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Tiêu đề:</span>
                    <span className="font-medium text-neutral-800">{exam.title}</span>
                  </div>
                  {exam.position && (
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Vị trí:</span>
                      <span className="font-medium text-neutral-800">{exam.position}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Số câu hỏi:</span>
                    <span className="font-medium text-neutral-800">{exam.questionCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Thời gian:</span>
                    <span className="font-medium text-neutral-800">{formatDuration(exam.duration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Trạng thái:</span>
                    <span className={`font-medium ${exam.status === 'DRAFT' ? 'text-orange-600' : 'text-green-600'}`}>
                      {exam.status === 'DRAFT' ? 'Bản nháp' : exam.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Ngôn ngữ:</span>
                    <span className="font-medium text-neutral-800">
                      {exam.language === 'Vietnamese' ? '🇻🇳 Tiếng Việt' : '🇺🇸 English'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-neutral-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <div className="flex items-start gap-2">
                  <div className="text-yellow-600 text-lg">⚠</div>
                  <div>
                    <p className="font-medium text-yellow-800 mb-1">Lưu ý quan trọng:</p>
                    <ul className="text-yellow-700 space-y-1">
                      <li>• Bài kiểm tra sẽ bắt đầu ngay khi bạn xác nhận</li>
                      <li>• Thời gian sẽ được tính từ lúc bắt đầu</li>
                      <li>• Không thể tạm dừng hoặc quay lại câu hỏi trước</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelModal}
                className="px-4 py-2 text-sm font-medium text-neutral-600 bg-neutral-200 rounded-md hover:bg-neutral-300 transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmStart}
                className="px-4 py-2 text-sm font-medium bg-accent text-white rounded-md hover:bg-accent-dark transition-colors"
              >
                Xác Nhận Bắt Đầu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamCard;
