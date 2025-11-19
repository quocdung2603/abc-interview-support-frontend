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
    <div className="card-elevated p-6 mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-heading-2 text-neutral-900 mb-2">
            Ôn tập phỏng vấn
          </h2>
          <p className="text-body text-neutral-600">
            Chọn lĩnh vực, chủ đề và cấp độ để bắt đầu ôn tập
          </p>
        </div>
        <div className="text-right">
          <div className="text-heading-3 text-primary font-bold">
            {questionsCount}
          </div>
          <div className="text-caption text-neutral-600">câu hỏi</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Field Selection */}
        <div className="space-y-2">
          <label
            htmlFor="field"
            className="block text-caption font-semibold text-neutral-700"
          >
            Lĩnh vực
          </label>
          <select
            id="field"
            className="select-field"
            value={selectedField}
            onChange={(e) => onFieldChange(Number(e.target.value))}
          >
            <option value={0}>Chọn lĩnh vực</option>
            {fields.map((field) => (
              <option key={field.id} value={field.id}>
                {field.fieldName}
              </option>
            ))}
          </select>
          <p className="text-small text-neutral-500">
            {selectedField > 0 &&
              fields.find((f) => f.id === selectedField)?.description}
          </p>
        </div>

        {/* Topic Selection */}
        <div className="space-y-2">
          <label
            htmlFor="topic"
            className="block text-caption font-semibold text-neutral-700"
          >
            Chủ đề
          </label>
          <select
            id="topic"
            className="select-field"
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
                  {topic.topicName}
                </option>
              ))}
          </select>
          <p className="text-small text-neutral-500">
            {selectedTopic > 0 &&
              topics.find((t) => t.id === selectedTopic)?.description}
          </p>
        </div>

        {/* Level Selection */}
        <div className="space-y-2">
          <label
            htmlFor="level"
            className="block text-caption font-semibold text-neutral-700"
          >
            Cấp độ
          </label>
          <select
            id="level"
            className="select-field"
            value={selectedLevel}
            onChange={(e) => onLevelChange(Number(e.target.value))}
          >
            <option value={0}>Tất cả cấp độ</option>
            {levels.map((level) => (
              <option key={level.id} value={level.id}>
                {level.levelName}
              </option>
            ))}
          </select>
          <p className="text-small text-neutral-500">
            {selectedLevel > 0 &&
              levels.find((l) => l.id === selectedLevel)?.description}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between mt-6 pt-6 border-t border-neutral-200">
        <div className="flex flex-wrap gap-3">
          {selectedField > 0 && (
            <span className="badge-primary">
              {fields.find((f) => f.id === selectedField)?.fieldName}
            </span>
          )}
          {selectedTopic > 0 && (
            <span className="badge-secondary">
              {topics.find((t) => t.id === selectedTopic)?.topicName}
            </span>
          )}
          {selectedLevel > 0 && (
            <span className="badge-accent">
              {levels.find((l) => l.id === selectedLevel)?.levelName}
            </span>
          )}
        </div>

        <div className="flex gap-3 mt-4 md:mt-0">
          <button
            onClick={() => {
              onFieldChange(0);
              onTopicChange(0);
              onLevelChange(0);
            }}
            className="btn-outline"
            disabled={!selectedField && !selectedTopic && !selectedLevel}
          >
            <svg
              className="w-4 h-4 mr-2"
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
