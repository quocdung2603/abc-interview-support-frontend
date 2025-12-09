import React from 'react';

export interface ExamControlsProps {
  // Filters
  examType: string;
  onExamTypeChange: (v: string) => void;
  examTypeOptions: { value: string; label: string }[];

  field: string;
  onFieldChange: (v: string) => void;
  fieldOptions: string[];

  topic: string;
  onTopicChange: (v: string) => void;
  topicOptions: string[];

  // Optional: free-text search
  search?: string;
  onSearchChange?: (v: string) => void;

  // Optional: extra action (e.g., Reset)
  onReset?: () => void;
}

const controlRow: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  alignItems: 'center',
  marginBottom: '0.5rem',
};

const selectStyle: React.CSSProperties = {
  padding: '8px 10px',
  border: '1px solid #d1d5db',
  borderRadius: 8,
  background: 'white',
  minWidth: 160,
  fontSize: '0.875rem',
};

const inputStyle: React.CSSProperties = {
  padding: '8px 10px',
  border: '1px solid #d1d5db',
  borderRadius: 8,
  background: 'white',
  minWidth: 220,
  fontSize: '0.875rem',
};

const ExamFilter: React.FC<ExamControlsProps> = ({
  examType,
  onExamTypeChange,
  examTypeOptions,
  field,
  onFieldChange,
  fieldOptions,
  topic,
  onTopicChange,
  topicOptions,
  search,
  onSearchChange,
  onReset,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center mb-2">
        <select
          className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm min-w-[160px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={examType}
          onChange={(e) => onExamTypeChange(e.target.value)}
        >
          {examTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm min-w-[160px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm min-w-[160px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm min-w-[220px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Tìm theo tên/ID…"
            value={search || ''}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        )}

        {onReset && (
          <button
            className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors ml-auto"
            onClick={onReset}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default ExamFilter;
