import { Field, Level, Topic } from '@abc-interview-support-frontend/types';
import React from 'react';

interface InterviewRevisionFilterProps {
  selectedField: number;
  onFieldChange: (fieldId: number) => void;
  selectedTopic: number;
  onTopicChange: (topicId: number) => void;
  selectedLevel: number;
  onLevelChange: (levelId: number) => void;
  fields: Field[];
  topics: Topic[];
  levels: Level[];
  questionsCount: number;
}

export const InterviewRevisionFilter: React.FC<
  InterviewRevisionFilterProps
> = ({
  selectedField,
  onFieldChange,
  selectedTopic,
  onTopicChange,
  selectedLevel,
  onLevelChange,
  fields,
  topics,
  levels,
  questionsCount,
}) => {
    return (
      <div className="card-elevated p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-1">
              Bộ lọc câu hỏi
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Field Selection */}
          <div className="space-y-1">
            <label
              htmlFor="field"
              className="block text-xs font-medium text-neutral-700"
            >
              Lĩnh vực
            </label>
            <select
              id="field"
              className="select-field text-xs py-2"
              value={selectedField}
              onChange={(e) => onFieldChange(Number(e.target.value))}
            >
              <option value={0}>Chọn lĩnh vực</option>
              {fields.map((field) => (
                <option key={field.id} value={field.id}>
                  {field.name}
                </option>
              ))}
            </select>
          </div>

          {/* Topic Selection */}
          <div className="space-y-1">
            <label
              htmlFor="topic"
              className="block text-xs font-medium text-neutral-700"
            >
              Chủ đề
            </label>
            <select
              id="topic"
              className="select-field text-xs py-2"
              value={selectedTopic}
              onChange={(e) => onTopicChange(Number(e.target.value))}
              disabled={!selectedField}
            >
              <option value={0}>
                {selectedField ? 'Chọn chủ đề' : 'Vui lòng chọn lĩnh vực trước'}
              </option>
              {topics
                .filter((topic) => topic.fieldId === selectedField)
                .map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Level Selection */}
          <div className="space-y-1">
            <label
              htmlFor="level"
              className="block text-xs font-medium text-neutral-700"
            >
              Cấp độ
            </label>
            <select
              id="level"
              className="select-field text-xs py-2"
              value={selectedLevel}
              onChange={(e) => onLevelChange(Number(e.target.value))}
            >
              <option value={0}>Tất cả cấp độ</option>
              {levels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons - Compact */}
        <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t border-neutral-200">
          <div className="flex flex-wrap gap-2">
            {selectedField > 0 && (
              <span className="badge-primary text-xs px-2 py-1">
                {fields.find((f) => f.id === selectedField)?.name}
              </span>
            )}
            {selectedTopic > 0 && (
              <span className="badge-secondary text-xs px-2 py-1">
                {topics.find((t) => t.id === selectedTopic)?.name}
              </span>
            )}
            {selectedLevel > 0 && (
              <span className="badge-accent text-xs px-2 py-1">
                {levels.find((l) => l.id === selectedLevel)?.name}
              </span>
            )}
          </div>

          <div className="flex gap-2 mt-3 md:mt-0">
            <button
              onClick={() => {
                onFieldChange(0);
                onTopicChange(0);
                onLevelChange(0);
              }}
              className="btn-outline btn-sm text-xs px-3 py-1"
              disabled={!selectedField && !selectedTopic && !selectedLevel}
            >
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Đặt lại
            </button>
          </div>
        </div>
      </div>
    );
  };
