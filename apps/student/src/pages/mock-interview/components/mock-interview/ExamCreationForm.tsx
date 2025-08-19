import { useState } from 'react';

interface ExamFormData {
  field: string;
  topic: string;
  level: string;
  questionTypes: string[];
  questionCount: number;
  duration: number;
}

interface ExamCreationFormProps {
  onCreateExam: (examData: ExamFormData) => void;
  onCriteriaChange: (criteria: Partial<ExamFormData>) => void;
}

const ExamCreationForm: React.FC<ExamCreationFormProps> = ({
  onCreateExam,
  onCriteriaChange,
}) => {
  const [defaultFormValue, setDefaultFormValue] = useState<ExamFormData>({
    field: '',
    topic: '',
    level: '',
    questionTypes: [],
    questionCount: 10,
    duration: 30,
  });

  const [formData, setFormData] = useState<ExamFormData>({
    field: '',
    topic: '',
    level: '',
    questionTypes: [],
    questionCount: 10,
    duration: 30,
  });

  // Mock data - trong thực tế sẽ lấy từ API
  const fields = [
    { id: 'frontend', name: 'Frontend Development' },
    { id: 'backend', name: 'Backend Development' },
    { id: 'ba', name: 'Business Analysis' },
    { id: 'devops', name: 'DevOps' },
    { id: 'qa', name: 'Quality Assurance' },
  ];

  const topicsByField: Record<string, Array<{ id: string; name: string }>> = {
    frontend: [
      { id: 'react', name: 'React' },
      { id: 'angular', name: 'Angular' },
      { id: 'vue', name: 'Vue.js' },
      { id: 'javascript', name: 'JavaScript' },
      { id: 'typescript', name: 'TypeScript' },
    ],
    backend: [
      { id: 'nodejs', name: 'Node.js' },
      { id: 'java', name: 'Java' },
      { id: 'python', name: 'Python' },
      { id: 'csharp', name: 'C#' },
      { id: 'database', name: 'Database' },
    ],
    ba: [
      { id: 'requirements', name: 'Requirements Analysis' },
      { id: 'modeling', name: 'Process Modeling' },
      { id: 'documentation', name: 'Documentation' },
    ],
    devops: [
      { id: 'docker', name: 'Docker' },
      { id: 'kubernetes', name: 'Kubernetes' },
      { id: 'ci-cd', name: 'CI/CD' },
    ],
    qa: [
      { id: 'manual-testing', name: 'Manual Testing' },
      { id: 'automation', name: 'Test Automation' },
      { id: 'performance', name: 'Performance Testing' },
    ],
  };

  const levels = [
    { id: 'Fresher', name: 'Fresher' },
    { id: 'Junior', name: 'Junior' },
    { id: 'Middle', name: 'Middle' },
    { id: 'Senior', name: 'Senior' },
  ];

  const questionTypes = [
    { id: 'SingleChoice', name: 'Một lựa chọn' },
    { id: 'MultipleChoice', name: 'Nhiều lựa chọn' },
    { id: 'FillInTheBlank', name: 'Điền khuyết' },
    { id: 'OpenEnded', name: 'Tự luận' },
  ];

  const handleFieldChange = (fieldId: string) => {
    const updatedData = { ...formData, field: fieldId, topic: '' };
    setFormData(updatedData);
    onCriteriaChange(updatedData);
  };

  const handleTopicChange = (topicId: string) => {
    const updatedData = { ...formData, topic: topicId };
    setFormData(updatedData);
    onCriteriaChange(updatedData);
  };

  const handleLevelChange = (levelId: string) => {
    const updatedData = { ...formData, level: levelId };
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.field &&
      formData.topic &&
      formData.level &&
      formData.questionTypes.length > 0
    ) {
      onCreateExam(formData);
      setFormData(defaultFormValue);
    }
  };

  const isFormValid =
    formData.field &&
    formData.topic &&
    formData.level &&
    formData.questionTypes.length > 0;

  return (
    <div
      className="p-6 mb-6 bg-white border-2 border-neutral-200 rounded-xl shadow-lg transition-all duration-300 relative overflow-hidden hover:border-accent-light hover:shadow-xl hover:-translate-y-0.5"
      style={{
        position: 'relative',
      }}
    >
      {/* Top border gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background:
            'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
        }}
      />

      <h2 className="text-xl font-bold text-primary mb-4">
        Tạo Bài Phỏng Vấn Giả Lập
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Field Selection */}
          <div>
            <label
              htmlFor="field-select"
              className="block text-xs font-semibold text-neutral-700 mb-1"
            >
              Lĩnh vực *
            </label>
            <select
              id="field-select"
              className="select-field text-sm py-2 focus:border-accent focus:shadow-sm focus:shadow-accent/20 focus:outline-none"
              value={formData.field}
              onChange={(e) => handleFieldChange(e.target.value)}
              required
            >
              <option value="">Chọn lĩnh vực</option>
              {fields.map((field) => (
                <option key={field.id} value={field.id}>
                  {field.name}
                </option>
              ))}
            </select>
          </div>

          {/* Topic Selection */}
          <div>
            <label
              htmlFor="topic-select"
              className="block text-xs font-semibold text-neutral-700 mb-1"
            >
              Chủ đề *
            </label>
            <select
              id="topic-select"
              className="select-field text-sm py-2 focus:border-accent focus:shadow-sm focus:shadow-accent/20 focus:outline-none"
              value={formData.topic}
              onChange={(e) => handleTopicChange(e.target.value)}
              disabled={!formData.field}
              required
            >
              <option value="">Chọn chủ đề</option>
              {formData.field &&
                topicsByField[formData.field]?.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Level Selection */}
          <div>
            <label
              htmlFor="level-select"
              className="block text-xs font-semibold text-neutral-700 mb-1"
            >
              Cấp độ *
            </label>
            <select
              id="level-select"
              className="select-field text-sm py-2 focus:border-accent focus:shadow-sm focus:shadow-accent/20 focus:outline-none"
              value={formData.level}
              onChange={(e) => handleLevelChange(e.target.value)}
              required
            >
              <option value="">Chọn cấp độ</option>
              {levels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>

          {/* Question Count */}
          <div>
            <label
              htmlFor="question-count"
              className="block text-xs font-semibold text-neutral-700 mb-1"
            >
              Số câu hỏi
            </label>
            <input
              id="question-count"
              type="number"
              className="input-field text-sm py-2 focus:border-accent focus:shadow-sm focus:shadow-accent/20 focus:outline-none"
              min="5"
              max="50"
              value={formData.questionCount}
              onChange={(e) =>
                handleNumberChange(
                  'questionCount',
                  parseInt(e.target.value) || 10
                )
              }
            />
          </div>

          {/* Duration */}
          <div>
            <label
              htmlFor="duration"
              className="block text-xs font-semibold text-neutral-700 mb-1"
            >
              Thời gian (phút)
            </label>
            <input
              id="duration"
              type="number"
              className="input-field text-sm py-2 focus:border-accent focus:shadow-sm focus:shadow-accent/20 focus:outline-none"
              min="10"
              max="180"
              value={formData.duration}
              onChange={(e) =>
                handleNumberChange('duration', parseInt(e.target.value) || 30)
              }
            />
          </div>
        </div>

        {/* Question Types */}
        <div>
          <div className="block text-xs font-semibold text-neutral-700 mb-2">
            Loại câu hỏi *
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {questionTypes.map((type) => (
              <label
                key={type.id}
                className={`flex items-center p-2 border-2 rounded-md cursor-pointer transition-all text-sm ${
                  formData.questionTypes.includes(type.id)
                    ? 'border-accent bg-accent-10'
                    : 'border-neutral-200 hover:border-accent-light hover:bg-accent/5'
                }`}
              >
                <input
                  type="checkbox"
                  className="mr-2 w-4 h-4 text-accent bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2"
                  style={{
                    accentColor: 'var(--color-accent)',
                  }}
                  checked={formData.questionTypes.includes(type.id)}
                  onChange={() => handleQuestionTypeChange(type.id)}
                />
                <span className="text-xs font-medium">{type.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={!isFormValid}
            className={`btn-primary px-6 py-2 text-sm transition-all duration-200 ${
              !isFormValid ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
            }`}
          >
            🚀 Tạo Bài Phỏng Vấn
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExamCreationForm;
