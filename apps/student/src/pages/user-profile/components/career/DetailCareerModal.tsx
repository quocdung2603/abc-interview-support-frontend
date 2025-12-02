import React from 'react';
import { Modal } from 'antd';
import {
  Field,
  Topic,
  CareerPreference,
} from '@abc-interview-support-frontend/types';

interface DetailCareerModalProps {
  isOpen: boolean;
  career: CareerPreference | null;
  fields: Field[];
  topics: Topic[];
  onClose: () => void;
}

const DetailCareerModal: React.FC<DetailCareerModalProps> = ({
  isOpen,
  career,
  fields,
  topics,
  onClose,
}) => {
  if (!isOpen || !career) return null;

  const getFieldName = (fieldId: string | number | undefined): string => {
    if (!fieldId) return 'Không xác định';
    // Convert to string for comparison since backend might return number
    const fieldIdStr = String(fieldId);
    const field = fields.find((f) => String(f.id) === fieldIdStr);
    return field ? field.name : 'Không xác định';
  };

  const getTopicName = (topicId: string | number | undefined): string => {
    if (!topicId) return 'Chưa chọn';
    // Convert to string for comparison since backend might return number
    const topicIdStr = String(topicId);
    const topic = topics.find((t) => String(t.id) === topicIdStr);
    return topic ? topic.name : 'Không xác định';
  };

  const getFieldDescription = (
    fieldId: string | number | undefined
  ): string => {
    if (!fieldId) return '';
    // Convert to string for comparison since backend might return number
    const fieldIdStr = String(fieldId);
    const field = fields.find((f) => String(f.id) === fieldIdStr);
    return field?.description || 'Không có mô tả';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <span className="text-lg">👁️</span>
          <span className="text-lg font-semibold text-blue-600">Chi tiết định hướng nghề nghiệp</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={[
        <button
          key="close"
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
          onClick={onClose}
        >
          Đóng
        </button>
      ]}
      width={800}
      centered
      destroyOnClose
    >
      <div className="py-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-600 min-w-[120px]">
              🎯 Lĩnh vực:
            </span>
            <span className="text-lg font-semibold text-blue-600">
              {getFieldName(career.fieldId)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-600 min-w-[120px]">
              📚 Chủ đề:
            </span>
            <span className="inline-flex px-2 py-1 text-sm font-medium bg-purple-100 text-purple-800 rounded-full">
              {getTopicName(career.topicId)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-600 min-w-[120px]">
              📅 Ngày tạo:
            </span>
            <span className="text-sm text-gray-700">
              {formatDate(career.createdAt.toString())}
            </span>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-base font-semibold text-gray-700 mb-2">
              📝 Mô tả lĩnh vực:
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {getFieldDescription(career.fieldId)}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DetailCareerModal;
