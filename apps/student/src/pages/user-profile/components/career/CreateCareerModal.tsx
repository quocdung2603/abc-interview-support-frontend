import React from 'react';
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
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          animation: 'fadeIn 0.2s ease-in-out',
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="card-elevated"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          padding: 'var(--spacing-lg)',
          width: '90%',
          maxWidth: '500px',
          backgroundColor: 'white',
          maxHeight: '90vh',
          overflowY: 'auto',
          animation: 'slideIn 0.3s ease-out',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--spacing-md)',
          }}
        >
          <h3
            style={{
              margin: 0,
              color: 'var(--color-primary)',
              fontSize: '1.5rem',
            }}
          >
            ➕ Thêm định hướng nghề nghiệp mới
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'var(--color-neutral-500)',
              padding: '0.25rem',
              lineHeight: 1,
            }}
            aria-label="Đóng"
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: 'var(--spacing-md)' }}>
          <label
            htmlFor="create-field-select"
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-sm)',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'var(--color-neutral-700)',
            }}
          >
            Lĩnh vực <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <select
            id="create-field-select"
            value={selectedFieldId}
            onChange={(e) => onFieldChange(e.target.value)}
            className="input-field"
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '0.875rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-neutral-300)',
            }}
          >
            <option value="">-- Chọn lĩnh vực --</option>
            {fields.map((field) => (
              <option key={field.id} value={field.id}>
                {field.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <label
            htmlFor="create-topic-select"
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-sm)',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'var(--color-neutral-700)',
            }}
          >
            Chủ đề (tùy chọn)
          </label>
          <select
            id="create-topic-select"
            value={selectedTopicId}
            onChange={(e) => onTopicChange(e.target.value)}
            className="input-field"
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '0.875rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-neutral-300)',
            }}
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
            <p
              style={{
                fontSize: '0.75rem',
                color: 'var(--color-neutral-500)',
                margin: '0.25rem 0 0 0',
                fontStyle: 'italic',
              }}
            >
              💡 Vui lòng chọn lĩnh vực trước
            </p>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            gap: 'var(--spacing-sm)',
            justifyContent: 'flex-end',
            paddingTop: 'var(--spacing-md)',
            borderTop: '1px solid var(--color-neutral-200)',
          }}
        >
          <button className="btn-outline" onClick={onClose}>
            Hủy
          </button>
          <button
            className="btn-accent"
            onClick={onCreate}
            disabled={!selectedFieldId}
            style={{
              opacity: !selectedFieldId ? 0.5 : 1,
              cursor: !selectedFieldId ? 'not-allowed' : 'pointer',
            }}
          >
            ✓ Tạo mới
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateCareerModal;
