import { useState } from 'react';
import { Modal } from 'antd';
import { Exam } from '@abc-interview-support-frontend/types';

interface ExamCardProps {
  exam: Exam;
  onStartExam?: (examId: string) => void;
  onRegister?: (examId: string) => void;
  onUnregister?: (examId: string) => void;
  isCreated?: boolean;
  isRegistered?: boolean;
  registerLoading?: boolean;
  unregisterLoading?: boolean;
}

const BaseExamCard: React.FC<ExamCardProps> = ({
  exam,
  onStartExam,
  onRegister,
  onUnregister,
  isCreated = false,
  isRegistered = false,
  registerLoading = false,
  unregisterLoading = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isUnregisterModalOpen, setIsUnregisterModalOpen] = useState(false);

  const handleRegister = () => {
    setIsRegisterModalOpen(true);
  };

  const handleUnregister = () => {
    setIsUnregisterModalOpen(true);
  };

  const handleConfirmRegister = () => {
    if (onRegister) {
      onRegister(exam.id.toString());
    }
    setIsRegisterModalOpen(false);
  };

  const handleConfirmUnregister = () => {
    if (onUnregister) {
      onUnregister(exam.id.toString());
    }
    setIsUnregisterModalOpen(false);
  };

  const handleCancelRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const handleCancelUnregisterModal = () => {
    setIsUnregisterModalOpen(false);
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
            #{exam.id}: {exam.title}
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
              {exam.questions?.length}
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
      <div className="flex justify-end pt-1 gap-2">
        {(() => {
          if (exam.status === 'PUBLISHED') {
            if (isRegistered) {
              return (
                <>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center gap-1 px-3 py-1 text-xs"
                  >
                    Bắt Đầu
                  </button>
                  <button
                    onClick={handleUnregister}
                    className="btn-outline flex items-center gap-1 px-3 py-1 text-xs border-red-300 text-red-600 hover:bg-red-50"
                    disabled={unregisterLoading}
                  >
                    {unregisterLoading ? 'Đang xử lý...' : 'Hủy Đăng Ký'}
                  </button>
                </>
              );
            } else {
              return (
                <button
                  onClick={handleRegister}
                  className="btn-secondary flex items-center gap-1 px-3 py-1 text-xs"
                  disabled={registerLoading}
                >
                  {registerLoading ? 'Đang xử lý...' : 'Đăng Ký'}
                </button>
              );
            }
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
      <Modal
        title="Xác Nhận Bắt Đầu Bài Kiểm Tra"
        open={isModalOpen}
        onCancel={handleCancelModal}
        onOk={handleConfirmStart}
        okText="Xác Nhận Bắt Đầu"
        cancelText="Hủy"
        width={600}
        centered
        okButtonProps={{
          className: "bg-accent hover:bg-accent-dark border-accent"
        }}
      >
        {/* Exam Details */}
        <div className="space-y-3">
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
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Register Confirmation Modal */}
      <Modal
        title="Xác Nhận Đăng Ký Bài Kiểm Tra"
        open={isRegisterModalOpen}
        onCancel={handleCancelRegisterModal}
        onOk={handleConfirmRegister}
        okText="Xác Nhận Đăng Ký"
        cancelText="Hủy"
        width={600}
        centered
        confirmLoading={registerLoading}
        okButtonProps={{
          className: "bg-accent hover:bg-accent-dark border-accent",
          disabled: registerLoading
        }}
      >
        <div className="space-y-3">
          <div className="p-4 bg-neutral-50 rounded-lg">
            <h4 className="font-semibold text-sm text-neutral-700 mb-3">
              Bạn có muốn đăng ký bài kiểm tra này không?
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
            </div>
          </div>
        </div>
      </Modal>

      {/* Unregister Confirmation Modal */}
      <Modal
        title="Xác Nhận Hủy Đăng Ký"
        open={isUnregisterModalOpen}
        onCancel={handleCancelUnregisterModal}
        onOk={handleConfirmUnregister}
        okText="Xác Nhận Hủy"
        cancelText="Giữ Đăng Ký"
        width={600}
        centered
        confirmLoading={unregisterLoading}
        okButtonProps={{
          className: "bg-red-600 hover:bg-red-700 border-red-600",
          disabled: unregisterLoading
        }}
      >
        <div className="space-y-3">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h4 className="font-semibold text-sm text-red-700 mb-3">
              Bạn có chắc chắn muốn hủy đăng ký bài kiểm tra này không?
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-red-600">Tiêu đề:</span>
                <span className="font-medium text-red-800">{exam.title}</span>
              </div>
              {exam.position && (
                <div className="flex justify-between">
                  <span className="text-red-600">Vị trí:</span>
                  <span className="font-medium text-red-800">{exam.position}</span>
                </div>
              )}
            </div>
          </div>

          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
            <div className="flex items-start gap-2">
              <div className="text-red-600 text-lg">⚠</div>
              <div>
                <p className="font-medium text-red-800 mb-1">Lưu ý:</p>
                <ul className="text-red-700 space-y-1">
                  <li>• Bạn sẽ mất quyền truy cập vào bài kiểm tra này</li>
                  <li>• Không thể hoàn tác hành động này</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BaseExamCard;
