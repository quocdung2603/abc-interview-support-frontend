import React from 'react';

export interface ExamControlsProps {
  // Filters
  field: string;
  onFieldChange: (v: string) => void;
  fieldOptions: string[];

  topic: string;
  onTopicChange: (v: string) => void;
  topicOptions: string[];

  // Pagination
  page: number; // 1-based
  pageSize: number;
  total: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;

  // Optional: free-text search
  search?: string;
  onSearchChange?: (v: string) => void;

  // Optional: extra action (e.g., Reset)
  onReset?: () => void;
}

const controlRow: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--spacing-sm)',
  alignItems: 'center',
  marginBottom: 'var(--spacing-sm)',
};

const selectStyle: React.CSSProperties = {
  padding: '8px 10px',
  border: '1px solid var(--color-neutral-300)',
  borderRadius: 8,
  background: 'white',
  minWidth: 160,
};

const inputStyle: React.CSSProperties = {
  padding: '8px 10px',
  border: '1px solid var(--color-neutral-300)',
  borderRadius: 8,
  background: 'white',
  minWidth: 220,
};

const ExamFilter: React.FC<ExamControlsProps> = ({
  field,
  onFieldChange,
  fieldOptions,
  topic,
  onTopicChange,
  topicOptions,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  search,
  onSearchChange,
  onReset,
}) => {
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));

  const goPrev = () => onPageChange(Math.max(1, page - 1));
  const goNext = () => onPageChange(Math.min(totalPages, page + 1));

  return (
    <div
      className="card-elevated"
      style={{
        padding: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-md)',
      }}
    >
      {/* Filters */}
      <div style={controlRow}>
        <select
          style={selectStyle}
          value={field}
          onChange={(e) => onFieldChange(e.target.value)}
        >
          <option value="">Field (tất cả)</option>
          {fieldOptions.map((opt, index) => (
            <option key={`${opt}-${index}`} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <select
          style={selectStyle}
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
        >
          <option value="">Topic (tất cả)</option>
          {topicOptions.map((opt, index) => (
            <option key={`${opt}-${index}`} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        {onSearchChange && (
          <input
            style={inputStyle}
            placeholder="Tìm theo tên/ID…"
            value={search || ''}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        )}

        {onReset && (
          <button
            className="btn-outline"
            onClick={onReset}
            style={{ marginLeft: 'auto' }}
          >
            Reset
          </button>
        )}
      </div>

      {/* Pagination */}
      <div
        style={{ ...controlRow, justifyContent: 'space-between', margin: 0 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            className="btn-outline btn-sm"
            onClick={goPrev}
            disabled={page <= 1}
          >
            Prev
          </button>
          <div>
            Trang <strong>{page}</strong> / <strong>{totalPages}</strong>
            <span style={{ color: 'var(--color-neutral-500)', marginLeft: 8 }}>
              ({total} mục)
            </span>
          </div>
          <button
            className="btn-outline btn-sm"
            onClick={goNext}
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>

        <div>
          <select
            style={{ ...selectStyle, minWidth: 100 }}
            value={pageSize}
            onChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
          >
            {[5, 10, 20, 50].map((s) => (
              <option key={s} value={s}>
                {s} / trang
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ExamFilter;
