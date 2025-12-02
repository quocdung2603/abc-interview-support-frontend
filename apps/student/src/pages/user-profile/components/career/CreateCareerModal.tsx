import React from 'react';
import { Modal } from 'antd';
import { Field, Topic } from '@abc-interview-support-frontend/types';

interface CreateCareerModalProps {
  isOpen: boolean;
  fields: Field[];
  selectedFieldId: string;
  selectedTopicId: string;
  filteredTopics: Topic[];
  onClose: () => void;
  onFieldChange: (fieldId: string) => void;
  onTopicChange: (topicId: string) => void;
  onCreate: () => void;
}

const CreateCareerModal: React.FC<CreateCareerModalProps> = ({
  isOpen,
  fields,
  selectedFieldId,
  selectedTopicId,
  filteredTopics,
  onClose,
  onFieldChange,
  onTopicChange,
  onCreate,
}) => {
  if (!isOpen) return null;

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <span className="text-lg">➕</span>
          <span className="text-lg font-semibold text-blue-600">Thêm định hướng nghề nghiệp mới</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={[
        <button
          key="cancel"
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors mr-2"
          onClick={onClose}
        >
          Hủy
        </button>,
        <button
          key="create"
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onCreate}
          disabled={!selectedFieldId}
        >
          ✓ Tạo mới
        </button>
      ]}
      width={800}
      centered
      destroyOnClose
    >
      <div className="py-4">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="create-field-select"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              Lĩnh vực <span className="text-red-500">*</span>
            </label>
            <select
              id="create-field-select"
              value={selectedFieldId}
              onChange={(e) => onFieldChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Chọn lĩnh vực --</option>
              {fields.map((field) => (
                <option key={field.id} value={field.id}>
                  {field.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="create-topic-select"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              Chủ đề (tùy chọn)
            </label>
            <select
              id="create-topic-select"
              value={selectedTopicId}
              onChange={(e) => onTopicChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!selectedFieldId}
            >
              <option value="">-- Chọn chủ đề --</option>
              {filteredTopics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
            {!selectedFieldId && (
              <p className="text-xs text-gray-500 mt-1 italic">
                💡 Vui lòng chọn lĩnh vực trước
              </p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateCareerModal;
