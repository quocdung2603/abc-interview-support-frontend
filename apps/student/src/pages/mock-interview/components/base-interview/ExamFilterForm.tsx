import { useState } from 'react';
import { Field, Topic, Level, QuestionType } from '@abc-interview-support-frontend/types';

interface ExamFormData {
  field: string;
  topic: string;
  level: string;
  questionTypes: string[];
  questionCount: number;
  duration: number;
  title?: string;
  position?: string;
  description?: string;
  fieldId: number;
  levelId: number;
}

interface ExamFilterFormProps {
  fieldData: Field[];
  topicData: Topic[];
  levelData: Level[];
  questionTypeData: QuestionType[];
  onCriteriaChange: (criteria: Partial<ExamFormData>) => void;
}

const ExamFilterForm: React.FC<ExamFilterFormProps> = ({
  fieldData,
  topicData,
  levelData,
  questionTypeData,
  onCriteriaChange,
}) => {
  const [formData, setFormData] = useState<ExamFormData>({
    field: '',
    topic: '',
    level: '',
    questionTypes: [],
    questionCount: 10,
    duration: 30,
    fieldId: 0,
    levelId: 0,
  });

  const [isCollapsed, setIsCollapsed] = useState(false);


  const handleFieldChange = (fieldId: string) => {
    const fieldIdNum = Number.parseInt(fieldId);
    const updatedData = { ...formData, field: fieldId, fieldId: fieldIdNum, topic: '' };
    setFormData(updatedData);
    onCriteriaChange(updatedData);
  };

  const handleTopicChange = (topicId: string) => {
    const updatedData = { ...formData, topic: topicId };
    setFormData(updatedData);
    onCriteriaChange(updatedData);
  };

  const handleLevelChange = (levelId: string) => {
    const levelIdNum = Number.parseInt(levelId);
    const updatedData = { ...formData, level: levelId, levelId: levelIdNum };
    setFormData(updatedData);
    onCriteriaChange(updatedData);
  };

  const handleQuestionTypeChange = (typeId: string) => {
    const updatedTypes = formData.questionTypes.includes(typeId)
      ? formData.questionTypes.filter((t) => t !== typeId)
      : [...formData.questionTypes, typeId];

    const updatedData = { ...formData, questionTypes: updatedTypes };
    setFormData(updatedData);
    onCriteriaChange(updatedData);
  };

  const handleNumberChange = (
    field: 'questionCount' | 'duration',
    value: number
  ) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onCriteriaChange(updatedData);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleReset = () => {
    const resetData = {
      field: '',
      topic: '',
      level: '',
      questionTypes: [],
      questionCount: 10,
      duration: 30,
      fieldId: 0,
      levelId: 0,
    };
    setFormData(resetData);
    onCriteriaChange(resetData);
  };

  return (
    <div
      className="p-3 mb-3 bg-white border border-neutral-200 rounded-lg shadow-sm transition-all duration-300 relative overflow-hidden hover:border-accent-light hover:shadow-md"
      style={{
        position: 'relative',
      }}
    >
      {/* Top border gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{
          background:
            'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
        }}
      />

      {/* Header with toggle */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-bold text-primary">
          Lọc Bài Phỏng Vấn Tuyển Dụng
        </h2>
        <button
          type="button"
          onClick={toggleCollapse}
          className="p-1 text-neutral-500 hover:text-primary transition-colors"
          title={isCollapsed ? "Mở rộng form" : "Thu gọn form"}
        >
          {isCollapsed ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          )}
        </button>
      </div>

      {/* Form Content - only show when not collapsed */}
      {!isCollapsed && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Field Selection */}
            <div className="space-y-1">
              <label
                htmlFor="field-select"
                className="block text-xs font-medium text-neutral-600"
              >
                Lĩnh vực
              </label>
              <select
                id="field-select"
                className="w-full px-3 py-1.5 text-sm border border-neutral-300 rounded-md focus:border-accent focus:outline-none bg-white"
                value={formData.field}
                onChange={(e) => handleFieldChange(e.target.value)}
              >
                <option value="">Tất cả lĩnh vực</option>
                {fieldData.map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Topic Selection */}
            <div className="space-y-1">
              <label
                htmlFor="topic-select"
                className="block text-xs font-medium text-neutral-600"
              >
                Chủ đề
              </label>
              <select
                id="topic-select"
                className="w-full px-3 py-1.5 text-sm border border-neutral-300 rounded-md focus:border-accent focus:outline-none bg-white disabled:bg-neutral-50"
                value={formData.topic}
                onChange={(e) => handleTopicChange(e.target.value)}
                disabled={!formData.field}
              >
                <option value="">Tất cả chủ đề</option>
                {formData.field &&
                  topicData
                    .filter((topic) => topic.fieldId === Number(formData.field))
                    .map((topic) => (
                      <option key={topic.id} value={topic.id.toString()}>
                        {topic.name}
                      </option>
                    ))}
              </select>
            </div>

            {/* Level Selection */}
            <div className="space-y-1">
              <label
                htmlFor="level-select"
                className="block text-xs font-medium text-neutral-600"
              >
                Cấp độ
              </label>
              <select
                id="level-select"
                className="w-full px-3 py-1.5 text-sm border border-neutral-300 rounded-md focus:border-accent focus:outline-none bg-white"
                value={formData.level}
                onChange={(e) => handleLevelChange(e.target.value)}
              >
                <option value="">Tất cả cấp độ</option>
                {levelData.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Question Count & Duration in one row */}
            <div className="md:col-span-2 lg:col-span-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label
                    htmlFor="question-count"
                    className="block text-xs font-medium text-neutral-600"
                  >
                    Số câu hỏi tối thiểu
                  </label>
                  <input
                    id="question-count"
                    type="number"
                    className="w-full px-3 py-1.5 text-sm border border-neutral-300 rounded-md focus:border-accent focus:outline-none"
                    min="1"
                    max="100"
                    value={formData.questionCount}
                    onChange={(e) =>
                      handleNumberChange(
                        'questionCount',
                        Number(e.target.value) || 1
                      )
                    }
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="duration"
                    className="block text-xs font-medium text-neutral-600"
                  >
                    Thời gian tối thiểu (phút)
                  </label>
                  <input
                    id="duration"
                    type="number"
                    className="w-full px-3 py-1.5 text-sm border border-neutral-300 rounded-md focus:border-accent focus:outline-none"
                    min="1"
                    max="300"
                    value={formData.duration}
                    onChange={(e) =>
                      handleNumberChange('duration', Number(e.target.value) || 1)
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Question Types */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-neutral-600">
              Loại câu hỏi
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 overflow-y-auto max-h-20">
              {questionTypeData.map((type) => (
                <label
                  key={type.id}
                  className={`flex items-center p-2 border rounded-md cursor-pointer transition-all text-xs ${formData.questionTypes.includes(type.id.toString())
                    ? 'border-accent bg-accent-10'
                    : 'border-neutral-200 hover:border-accent-light hover:bg-accent/5'
                    }`}
                >
                  <input
                    type="checkbox"
                    className="mr-2 w-3 h-3 text-accent bg-gray-100 border-gray-300 rounded focus:ring-accent"
                    style={{
                      accentColor: 'var(--color-accent)',
                    }}
                    checked={formData.questionTypes.includes(type.id.toString())}
                    onChange={() => handleQuestionTypeChange(type.id.toString())}
                  />
                  <span className="text-xs font-medium truncate">{type.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 text-sm rounded-md font-medium transition-all duration-200 bg-neutral-200 text-neutral-700 hover:bg-neutral-300 hover:scale-105"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamFilterForm;
