import React from 'react';
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
    return field ? field.fieldName : 'Không xác định';
  };

  const getTopicName = (topicId: string | number | undefined): string => {
    if (!topicId) return 'Chưa chọn';
    // Convert to string for comparison since backend might return number
    const topicIdStr = String(topicId);
    const topic = topics.find((t) => String(t.id) === topicIdStr);
    return topic ? topic.topicName : 'Không xác định';
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
          maxWidth: '600px',
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
            marginBottom: 'var(--spacing-lg)',
          }}
        >
          <h3
            style={{
              margin: 0,
              color: 'var(--color-primary)',
              fontSize: '1.5rem',
            }}
          >
            👁️ Chi tiết định hướng nghề nghiệp
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

        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              marginBottom: 'var(--spacing-sm)',
            }}
          >
            <span
              style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'var(--color-neutral-600)',
                minWidth: '120px',
              }}
            >
              🎯 Lĩnh vực:
            </span>
            <span
              style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: 'var(--color-primary)',
              }}
            >
              {getFieldName(career.fieldId)}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              marginBottom: 'var(--spacing-sm)',
            }}
          >
            <span
              style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'var(--color-neutral-600)',
                minWidth: '120px',
              }}
            >
              📚 Chủ đề:
            </span>
            <span
              className="badge-accent"
              style={{
                fontSize: '0.875rem',
                fontWeight: '500',
              }}
            >
              {getTopicName(career.topicId)}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              marginBottom: 'var(--spacing-md)',
            }}
          >
            <span
              style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'var(--color-neutral-600)',
                minWidth: '120px',
              }}
            >
              📅 Ngày tạo:
            </span>
            <span
              style={{
                fontSize: '0.875rem',
                color: 'var(--color-neutral-700)',
              }}
            >
              {formatDate(career.createdAt.toString())}
            </span>
          </div>

          <div
            style={{
              paddingTop: 'var(--spacing-md)',
              borderTop: '1px solid var(--color-neutral-200)',
            }}
          >
            <h4
              style={{
                margin: '0 0 var(--spacing-sm) 0',
                fontSize: '1rem',
                fontWeight: '600',
                color: 'var(--color-neutral-700)',
              }}
            >
              📝 Mô tả lĩnh vực:
            </h4>
            <p
              style={{
                margin: 0,
                fontSize: '0.875rem',
                color: 'var(--color-neutral-600)',
                lineHeight: '1.6',
              }}
            >
              {getFieldDescription(career.fieldId)}
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingTop: 'var(--spacing-md)',
            borderTop: '1px solid var(--color-neutral-200)',
          }}
        >
          <button className="btn-accent" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </>
  );
};

export default DetailCareerModal;
