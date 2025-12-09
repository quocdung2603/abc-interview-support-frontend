import React, { useEffect, useState } from 'react';
import { Modal, Tag } from 'antd';
import { examService } from '@abc-interview-support-frontend/services';
import {
  Field,
  Topic,
  Level,
  QuestionType
} from '@abc-interview-support-frontend/types';
import { WarningOutlined, FileSearchOutlined } from '@ant-design/icons';

interface ExamDetailModalProps {
  visible: boolean;
  examId: number | null;
  onClose: () => void;
  fields?: Field[];
  levels?: Level[];
  topics?: Topic[];
  questionTypes?: QuestionType[];
}

interface ExamDetail {
  id: number;
  title: string;
  description?: string;
  examType: string;
  status: string;
  duration?: number;
  totalQuestions?: number;
  questionCount?: number;
  passingScore?: number;
  startTime?: string;
  endTime?: string;
  position?: string;
  language?: string;
  fieldId?: number;
  levelId?: number;
  topicIds?: string | number[];
  questionTypeIds?: string | number[];
  createdAt?: string;
}

const ExamDetailModal: React.FC<ExamDetailModalProps> = ({
  visible,
  examId,
  onClose,
  fields,
  levels,
  topics,
  questionTypes,
}) => {
  const [examDetail, setExamDetail] = useState<ExamDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (visible && examId) {
      fetchExamDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, examId]);

  const fetchExamDetail = async () => {
    if (!examId) return;

    setLoading(true);
    setError('');

    try {
      const response = await examService.getExamById(examId.toString());
      console.log('Exam detail response:', response);
      setExamDetail(response);
    } catch (err: any) {
      console.error('Error fetching exam detail:', err);
      setError('Không thể tải thông tin bài kiểm tra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes && minutes !== 0) return '—';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h} giờ ${m} phút` : `${m} phút`;
  };

  const formatDateTime = (dateTime?: string) => {
    if (!dateTime) return '—';
    try {
      return new Date(dateTime).toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateTime;
    }
  };

  const getExamTypeLabel = (type: string) => {
    switch (type) {
      case 'VIRTUAL':
        return 'Phỏng vấn ảo';
      case 'PRACTICE':
        return 'Luyện tập';
      case 'RECRUITER':
        return 'Kiểm tra sơ loại';
      default:
        return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'Nháp';
      case 'PUBLISHED':
        return 'Đã công bố';
      case 'ONGOING':
        return 'Đang diễn ra';
      case 'COMPLETED':
        return 'Đã hoàn thành';
      default:
        return status;
    }
  };

  const parseArray = (value?: string | number[]): string => {
    if (!value) return '—';
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.join(', ');
      return String(parsed);
    } catch {
      return String(value);
    }
  };

  // Get field name by ID
  const getFieldName = (fieldId?: number): string => {
    if (!fieldId) return '—';
    const field = fields.find((f: Field) => f.id === fieldId);
    return field?.name ;
  };

  // Get level name by ID
  const getLevelName = (levelId?: number): string => {
    if (!levelId) return '—';
    const level = levels.find((l: Level) => l.id === levelId);
    return level?.name ;
  };

  // Get topic names by IDs
  const getTopicNames = (topicIds?: string | number[]): string => {
    if (!topicIds) return '—';
    const ids = Array.isArray(topicIds) ? topicIds : JSON.parse(topicIds);
    const names = ids.map((id: number) => {
      const topic = topics.find((t: Topic) => t.id === id);
      return topic?.name;
    });
    return names.join(', ');
  };

  // Get question type names by IDs
  const getQuestionTypeNames = (typeIds?: string | number[]): string => {
    if (!typeIds) return '—';
    const ids = Array.isArray(typeIds) ? typeIds : JSON.parse(typeIds);
    const names = ids.map((id: number) => {
      const type = questionTypes.find((qt: QuestionType) => qt.id === id);
      return  type?.name;
    });
    return names.join(', ');
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}><FileSearchOutlined /></span>
          <span>Chi tiết bài kiểm tra</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <button
          key="close"
          onClick={onClose}
          className="btn-primary"
          style={{ width: '100%' }}
        >
          Đóng
        </button>,
      ]}
      width={700}
      styles={{
        body: {
          maxHeight: '70vh',
          overflow: 'auto',
          padding: '1.5rem',
        },
      }}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div
            style={{
              width: '3rem',
              height: '3rem',
              border: '3px solid #f3f4f6',
              borderTop: '3px solid #0ea5e9',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem',
            }}
          />
          <div style={{ color: '#64748b' }}>Đang tải thông tin...</div>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}><WarningOutlined /></div>
          <div style={{ color: '#dc2626', marginBottom: '1rem' }}>
            {error}
          </div>
          <button
            onClick={() => {
              setError('');
              fetchExamDetail();
            }}
            className="btn-secondary"
          >
            Thử lại
          </button>
        </div>
      ) : examDetail ? (
        <div className="space-y-4">
          {/* Title */}
          <div className="border-b border-gray-200 pb-3">
            <h2 className="text-xl font-bold text-gray-900 m-0">
              {examDetail.title}
            </h2>
            <div className="text-sm text-gray-500 mt-1">ID: {examDetail.id}</div>
          </div>

          {/* Description */}
          {examDetail.description && (
            <div>
              <div className="text-sm font-semibold text-gray-600 mb-1">
                Mô tả
              </div>
              <div className="text-sm text-gray-800 bg-gray-50 p-3 rounded-md">
                {examDetail.description}
              </div>
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-semibold text-gray-600 mb-1">
                Loại bài kiểm tra
              </div>
              <div className="text-sm text-gray-800">
                {getExamTypeLabel(examDetail.examType)}
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600 mb-1">
                Trạng thái
              </div>
              <div className="text-sm text-gray-800">
                {getStatusLabel(examDetail.status)}
              </div>
            </div>
          </div>

          {/* Position and Language */}
          <div className="grid grid-cols-2 gap-4">
            {examDetail.position && (
              <div>
                <div className="text-sm font-semibold text-gray-600 mb-1">
                  Vị trí tuyển dụng
                </div>
                <div className="text-sm text-gray-800">
                  {examDetail.position}
                </div>
              </div>
            )}
            {examDetail.language && (
              <div>
                <div className="text-sm font-semibold text-gray-600 mb-1">
                  Ngôn ngữ
                </div>
                <div className="text-sm text-gray-800">
                  {examDetail.language}
                </div>
              </div>
            )}
          </div>

          {/* Exam Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-semibold text-gray-600 mb-1">
                Thời gian làm bài
              </div>
              <div className="text-sm text-gray-800">
                {formatDuration(examDetail.duration)}
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600 mb-1">
                Số lượng câu hỏi
              </div>
              <div className="text-sm text-gray-800">
                {examDetail.questionCount || examDetail.totalQuestions || '—'}
              </div>
            </div>
          </div>

          {/* Field and Level */}
          <div className="grid grid-cols-2 gap-4">
            {examDetail.fieldId && (
              <div>
                <div className="text-sm font-semibold text-gray-600 mb-1">
                  Lĩnh vực
                </div>
                  <Tag color="blue">{getFieldName(examDetail.fieldId)}</Tag>
              </div>
            )}
            {examDetail.levelId && (
              <div>
                <div className="text-sm font-semibold text-gray-600 mb-1">
                  Cấp độ
                </div>
                  <Tag color="green">{getLevelName(examDetail.levelId)}</Tag>
              </div>
            )}
          </div>

          {/* Topics */}
          {examDetail.topicIds && (
            <div>
              <div className="text-sm font-semibold text-gray-600 mb-1">
                Chủ đề
              </div>
              <Tag color="blue">{getTopicNames(examDetail.topicIds)}</Tag>
            </div>
          )}

          {/* Question Types */}
          {examDetail.questionTypeIds && (
            <div>
              <div className="text-sm font-semibold text-gray-600 mb-1">
                Loại câu hỏi
              </div>
              <Tag color="purple">{getQuestionTypeNames(examDetail.questionTypeIds)}</Tag>
            </div>
          )}

          {/* Time Range */}
          {(examDetail.startTime || examDetail.endTime) && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-semibold text-gray-600 mb-1">
                  Thời gian bắt đầu
                </div>
                <div className="text-sm text-gray-800">
                  {formatDateTime(examDetail.startTime)}
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-600 mb-1">
                  Thời gian kết thúc
                </div>
                <div className="text-sm text-gray-800">
                  {formatDateTime(examDetail.endTime)}
                </div>
              </div>
            </div>
          )}

          {/* Created At */}
          {examDetail.createdAt && (
            <div>
              <div className="text-sm font-semibold text-gray-600 mb-1">
                Ngày tạo
              </div>
              <div className="text-sm text-gray-800">
                {formatDateTime(examDetail.createdAt)}
              </div>
            </div>
          )}
        </div>
      ) : null}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </Modal>
  );
};

export default ExamDetailModal;
