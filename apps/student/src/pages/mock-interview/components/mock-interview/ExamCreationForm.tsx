import { useState, useEffect } from 'react';
import { Field, Topic, Level, QuestionType } from '@abc-interview-support-frontend/types';
import { questionService } from '@abc-interview-support-frontend/services';

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
}

interface ExamCreationFormProps {
  onCreateExam: (examData: ExamFormData) => void;
  onCriteriaChange: (criteria: Partial<ExamFormData>) => void;
}

const ExamCreationForm: React.FC<ExamCreationFormProps> = ({
  onCreateExam,
  onCriteriaChange,
}) => {
  const [fieldData, setFieldData] = useState<Field[]>([]);
  const [topicData, setTopicData] = useState<Topic[]>([]);
  const [levelData, setLevelData] = useState<Level[]>([]);
  const [questionTypeData, setQuestionTypeData] = useState<QuestionType[]>([]);

  const [formData, setFormData] = useState<ExamFormData>({
    field: '',
    topic: '',
    level: '',
    questionTypes: [],
    questionCount: 10,
    duration: 30,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<ExamFormData | null>(null);


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
      setModalData(formData);
      setIsModalOpen(true);
    }
  };

  const handleConfirmCreate = (confirmedData: ExamFormData) => {
    onCreateExam(confirmedData);
    setFormData({
      field: '',
      topic: '',
      level: '',
      questionTypes: [],
      questionCount: 10,
      duration: 30,
    });
    setIsModalOpen(false);
    setModalData(null);
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  const handleReset = () => {
    const resetData = {
      field: '',
      topic: '',
      level: '',
      questionTypes: [],
      questionCount: 10,
      duration: 30,
    };
    setFormData(resetData);
    onCriteriaChange(resetData);
  };

  const isFormValid =
    formData.field &&
    formData.topic &&
    formData.level &&
    formData.questionTypes.length > 0;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fieldsRes, topicsRes, levelsRes, typesRes] = await Promise.all([
          questionService.getAllFields(),
          questionService.getAllTopics(),
          questionService.getAllLevels(),
          questionService.getAllQuestionTypes(),
        ]);

        // Process fields
        setFieldData(fieldsRes.content || []);

        // Process topics
        setTopicData(topicsRes.content || []);

        // Process levels
        setLevelData(levelsRes.content || []);

        // Process question types
        setQuestionTypeData(typesRes.content || []);
      } catch (error) {
        console.error('Error loading form data:', error);
        setFieldData([]);
        setTopicData([]);
        setLevelData([]);
        setQuestionTypeData([]);
      }
    };

    loadData();
  }, []);

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

      <h2 className="text-base font-bold text-primary mb-2">
        Tạo Bài Phỏng Vấn Giả Lập
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Field Selection */}
          <div className="space-y-1">
            <label
              htmlFor="field-select"
              className="block text-xs font-medium text-neutral-600"
            >
              Lĩnh vực *
            </label>
            <select
              id="field-select"
              className="w-full px-3 py-1.5 text-sm border border-neutral-300 rounded-md focus:border-accent focus:outline-none bg-white"
              value={formData.field}
              onChange={(e) => handleFieldChange(e.target.value)}
              required
            >
              <option value="">Chọn lĩnh vực</option>
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
              Chủ đề *
            </label>
            <select
              id="topic-select"
              className="w-full px-3 py-1.5 text-sm border border-neutral-300 rounded-md focus:border-accent focus:outline-none bg-white disabled:bg-neutral-50"
              value={formData.topic}
              onChange={(e) => handleTopicChange(e.target.value)}
              disabled={!formData.field}
              required
            >
              <option value="">Chọn chủ đề</option>
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
              Cấp độ *
            </label>
            <select
              id="level-select"
              className="w-full px-3 py-1.5 text-sm border border-neutral-300 rounded-md focus:border-accent focus:outline-none bg-white"
              value={formData.level}
              onChange={(e) => handleLevelChange(e.target.value)}
              required
            >
              <option value="">Chọn cấp độ</option>
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
                  Số câu hỏi
                </label>
                <input
                  id="question-count"
                  type="number"
                  className="w-full px-3 py-1.5 text-sm border border-neutral-300 rounded-md focus:border-accent focus:outline-none"
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

              <div className="space-y-1">
                <label
                  htmlFor="duration"
                  className="block text-xs font-medium text-neutral-600"
                >
                  Thời gian (phút)
                </label>
                <input
                  id="duration"
                  type="number"
                  className="w-full px-3 py-1.5 text-sm border border-neutral-300 rounded-md focus:border-accent focus:outline-none"
                  min="10"
                  max="180"
                  value={formData.duration}
                  onChange={(e) =>
                    handleNumberChange('duration', parseInt(e.target.value) || 30)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Question Types */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-neutral-600">
            Loại câu hỏi *
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

        {/* Submit Button */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 text-sm rounded-md font-medium transition-all duration-200 bg-neutral-200 text-neutral-700 hover:bg-neutral-300 hover:scale-105"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={!isFormValid}
            className={`px-3 py-1.5 text-sm rounded-md font-medium transition-all duration-200 ${!isFormValid
                ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                : 'bg-accent text-white hover:bg-accent-dark hover:scale-105'
              }`}
          >
            Tạo Bài Phỏng Vấn
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {isModalOpen && modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-primary mb-4">
              Xác Nhận Tạo Bài Phỏng Vấn
            </h3>

            {/* Exam Details Summary */}
            <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
              <h4 className="font-semibold text-sm text-neutral-700 mb-3">
                Thông tin bài kiểm tra:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-neutral-600">Lĩnh vực:</span>
                  <p className="text-neutral-800">
                    {fieldData.find(f => f.id.toString() === modalData.field)?.name || modalData.field}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-neutral-600">Chủ đề:</span>
                  <p className="text-neutral-800">
                    {topicData.find(t => t.id.toString() === modalData.topic)?.name || modalData.topic}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-neutral-600">Cấp độ:</span>
                  <p className="text-neutral-800">
                    {levelData.find(l => l.id.toString() === modalData.level)?.name || modalData.level}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-neutral-600">Số câu hỏi:</span>
                  <p className="text-neutral-800">{modalData.questionCount}</p>
                </div>
                <div>
                  <span className="font-medium text-neutral-600">Thời gian:</span>
                  <p className="text-neutral-800">{modalData.duration} phút</p>
                </div>
                <div>
                  <span className="font-medium text-neutral-600">Loại câu hỏi:</span>
                  <p className="text-neutral-800">
                    {modalData.questionTypes.map(typeId =>
                      questionTypeData.find(q => q.id.toString() === typeId)?.name
                    ).filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Information Form */}
            <div className="space-y-4">
              <div>
                <label htmlFor="modal-title" className="block text-sm font-medium text-neutral-600 mb-1">
                  Tiêu đề bài kiểm tra *
                </label>
                <input
                  id="modal-title"
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:border-accent focus:outline-none"
                  placeholder="Ví dụ: Java Backend Developer Test"
                  value={modalData.title || ''}
                  onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="modal-position" className="block text-sm font-medium text-neutral-600 mb-1">
                  Vị trí công việc *
                </label>
                <input
                  id="modal-position"
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:border-accent focus:outline-none"
                  placeholder="Ví dụ: Backend Developer"
                  value={modalData.position || ''}
                  onChange={(e) => setModalData({ ...modalData, position: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="modal-description" className="block text-sm font-medium text-neutral-600 mb-1">
                  Mô tả (tùy chọn)
                </label>
                <textarea
                  id="modal-description"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:border-accent focus:outline-none resize-none"
                  rows={3}
                  placeholder="Mô tả chi tiết về bài kiểm tra..."
                  value={modalData.description || ''}
                  onChange={(e) => setModalData({ ...modalData, description: e.target.value })}
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={handleCancelModal}
                className="px-4 py-2 text-sm font-medium text-neutral-600 bg-neutral-200 rounded-md hover:bg-neutral-300 transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => handleConfirmCreate(modalData)}
                disabled={!modalData.title || !modalData.position}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${!modalData.title || !modalData.position
                    ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                    : 'bg-accent text-white hover:bg-accent-dark'
                  }`}
              >
                Xác Nhận Tạo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamCreationForm;
