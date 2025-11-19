import React from 'react';
import {
  CareerPreference,
  Field,
  Topic,
} from '@abc-interview-support-frontend/types';

import {
  CalendarOutlined
} from '@ant-design/icons';

interface CareerCardProps {
  career: CareerPreference;
  fields: Field[];
  topics: Topic[];
  onViewDetail: (career: CareerPreference) => void;
  onEdit: (career: CareerPreference) => void;
  onDelete: (careerId: number) => void;
}

const CareerCard: React.FC<CareerCardProps> = ({
  career,
  fields,
  topics,
  onViewDetail,
  onEdit,
  onDelete,
}) => {
  const getFieldName = (fieldId: string | number | undefined) => {
    if (!fieldId) return 'N/A';
    // Convert to string for comparison since backend might return number
    const fieldIdStr = String(fieldId);
    return fields.find((f) => String(f.id) === fieldIdStr)?.fieldName || 'N/A';
  };

  const getTopicName = (topicId?: string | number) => {
    if (!topicId) return 'Chưa chọn';
    // Convert to string for comparison since backend might return number
    const topicIdStr = String(topicId);
    return topics.find((t) => String(t.id) === topicIdStr)?.topicName || 'N/A';
  };

  return (
    <div
      className="card-soft"
      style={{
        padding: 'var(--spacing-md)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      {/* Top gradient line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '4px',
          background:
            'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
        }}
      />

      <div style={{ marginBottom: 'var(--spacing-md)', marginTop: '0.5rem' }}>
        <h4
          style={{
            margin: '0 0 0.5rem 0',
            color: 'var(--color-neutral-800)',
            fontSize: '1.125rem',
            fontWeight: '600',
          }}
        >
          {getFieldName(career.fieldId)}
        </h4>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
            flexWrap: 'wrap',
          }}
        >
          <span
            className="badge-accent"
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
          >
            📚 {getTopicName(career.topicId)}
          </span>
        </div>
      </div>

      <div
        style={{
          fontSize: '0.75rem',
          color: 'var(--color-neutral-500)',
          marginBottom: 'var(--spacing-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
        }}
      >
        <CalendarOutlined  twoToneColor="#52c41a"/>
        <span>
          Tạo ngày: {new Date(career.createdAt).toLocaleDateString('vi-VN')}
        </span>
      </div>

      <div className='w-full flex flex-row justify-between gap-[var(--spacing-xs)]'
      >
        <button
          className="btn-outline btn-sm w-1/3"
          onClick={() => onViewDetail(career)}
        >
          Xem
        </button>
        <button
          className="btn-outline btn-sm w-1/3"
          onClick={() => onEdit(career)}
        >
          Sửa
        </button>
        <button
          className="btn-outline btn-sm w-1/3"
          onClick={() => onDelete(career.id)}
        >
          Xóa
        </button>
      </div>
    </div>
  );
};

export default CareerCard;
