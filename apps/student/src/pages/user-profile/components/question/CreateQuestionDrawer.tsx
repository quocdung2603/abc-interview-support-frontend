import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Steps,
  Form,
  Select,
  Input,
  Button,
  message,
} from 'antd';
import { Field, Topic, Level, QuestionType } from '@abc-interview-support-frontend/types';
import { useAuth } from '@abc-interview-support-frontend/sso-utils';

const { TextArea } = Input;

interface CreateQuestionDrawerProps {
  open: boolean;
  onClose: () => void;
  fields: Field[];
  topics: Topic[];
  levels: Level[];
  questionTypes: QuestionType[];
  onSubmit: (data: CreateQuestionData) => Promise<void>;
  editMode?: boolean;
  editData?: EditQuestionData;
}

export interface CreateQuestionData {
  userId: number;
  topicId: number;
  fieldId: number;
  levelId: number;
  questionTypeId: number;
  content: string;
  answer: string;
  language: string;
}

export interface EditQuestionData {
  questionId?: number;
  userId: number;
  topicId: number;
  fieldId: number;
  levelId: number;
  questionTypeId: number;
  content: string;
  answer: string;
  language: string;
}

const CreateQuestionDrawer: React.FC<CreateQuestionDrawerProps> = ({
  open,
  onClose,
  fields,
  topics,
  levels,
  questionTypes,
  onSubmit,
  editMode = false,
  editData,
}) => {
  const { user: authUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState<number | undefined>();
  const [selectedQuestionType, setSelectedQuestionType] = useState<string>('');

  // Load edit data when in edit mode
  useEffect(() => {
    if (editMode && editData && open) {
      form.setFieldsValue({
        content: editData.content,
        answer: editData.answer,
        fieldId: editData.fieldId,
        topicId: editData.topicId,
        levelId: editData.levelId,
        questionTypeId: editData.questionTypeId,
      });
      setSelectedFieldId(editData.fieldId);
      const questionType = questionTypes.find(qt => qt.id === editData.questionTypeId);
      setSelectedQuestionType(questionType?.name || '');
    } else if (!open) {
      form.resetFields();
      setSelectedFieldId(undefined);
      setSelectedQuestionType('');
    }
  }, [editMode, editData, open, form, questionTypes]);

  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        // Validate step 1
        await form.validateFields(['fieldId', 'topicId', 'levelId', 'questionTypeId']);
        setCurrentStep(1);
      }
    } catch {
      message.error('Vui lòng điền đầy đủ thông tin');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(0);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      if (!authUser?.userId) {
        message.error('Không thể xác định người dùng. Vui lòng đăng nhập lại!');
        return;
      }

      const questionData: CreateQuestionData = {
        userId: Number(authUser.userId),
        topicId: values.topicId,
        fieldId: values.fieldId,
        levelId: values.levelId,
        questionTypeId: values.questionTypeId,
        content: values.content,
        answer: values.answer || '', // Get answer from form, default to empty string
        language: 'Vietnamese',
      };

      await onSubmit(questionData);
      message.success(editMode ? 'Cập nhật câu hỏi thành công!' : 'Tạo câu hỏi thành công!');
      handleClose();
    } catch (error) {
      console.error('Error creating question:', error);
      message.error('Không thể tạo câu hỏi. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setCurrentStep(0);
    setSelectedFieldId(undefined);
    setSelectedQuestionType('');
    onClose();
  };

  const handleFieldChange = (fieldId: number) => {
    setSelectedFieldId(fieldId);
    form.setFieldsValue({ topicId: undefined }); // Reset topic when field changes
  };

  const handleQuestionTypeChange = (questionTypeId: number) => {
    const questionType = questionTypes.find(qt => qt.id === questionTypeId);
    setSelectedQuestionType(questionType?.name || '');
  };

  // Filter topics by selected field
  const filteredTopics = selectedFieldId
    ? topics.filter(topic => topic.fieldId === selectedFieldId)
    : topics;

  const steps = [
    {
      title: 'Thông tin cơ bản',
      icon: '📋',
    },
    {
      title: 'Nội dung & đáp án',
      icon: '❓',
    },
  ];

  return (
    <Drawer
      title={
        <div className="flex items-center gap-2">
          <span className="text-xl">❓</span>
          <span>{editMode ? 'Chỉnh sửa câu hỏi' : 'Tạo câu hỏi mới'}</span>
        </div>
      }
      placement="right"
      width={800}
      open={open}
      onClose={handleClose}
      footer={
        <div className="flex justify-between">
          <div>
            {currentStep > 0 && (
              <Button onClick={handlePrevious} disabled={loading}>
                ← Quay lại
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={handleClose} disabled={loading}>
              Hủy
            </Button>
            {currentStep === 0 ? (
              <Button type="primary" onClick={handleNext}>
                Tiếp theo →
              </Button>
            ) : (
              <Button type="primary" onClick={handleSubmit} loading={loading}>
                {editMode ? 'Cập nhật' : 'Tạo câu hỏi'}
              </Button>
            )}
          </div>
        </div>
      }
    >
      {/* Steps indicator */}
      <div className="mb-6">
        <Steps
          current={currentStep}
          items={steps.map((step) => ({
            title: (
              <span className="text-sm">
                {step.icon} {step.title}
              </span>
            ),
          }))}
        />
      </div>

      {/* Form */}
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          questionTypeId: undefined,
        }}
      >
        {/* Step 1: Basic Info */}
        <div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <span className="text-xl">📚</span>
              <div>
                <h4 className="text-sm font-semibold text-blue-900 m-0 mb-1">
                  Thông tin câu hỏi
                </h4>
                <p className="text-xs text-blue-700 m-0">
                  Điền thông tin cơ bản về câu hỏi
                </p>
              </div>
            </div>
          </div>

          <Form.Item
            label={
              <span className="font-semibold">
                <span className="text-red-500">* </span>Lĩnh vực
              </span>
            }
            name="fieldId"
            rules={[{ required: true, message: 'Vui lòng chọn lĩnh vực!' }]}
          >
            <Select
              placeholder="Chọn lĩnh vực"
              size="large"
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              onChange={handleFieldChange}
              options={fields.map((field) => ({
                label: field.name,
                value: field.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-semibold">
                <span className="text-red-500">* </span>Chủ đề
              </span>
            }
            name="topicId"
            rules={[{ required: true, message: 'Vui lòng chọn chủ đề!' }]}
          >
            <Select
              placeholder="Chọn chủ đề"
              size="large"
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              disabled={!selectedFieldId}
              options={filteredTopics.map((topic) => ({
                label: topic.name,
                value: topic.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-semibold">
                <span className="text-red-500">* </span>Cấp độ
              </span>
            }
            name="levelId"
            rules={[{ required: true, message: 'Vui lòng chọn cấp độ!' }]}
          >
            <Select
              placeholder="Chọn cấp độ"
              size="large"
              options={levels.map((level) => ({
                label: level.name,
                value: level.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-semibold">
                <span className="text-red-500">* </span>Loại câu hỏi
              </span>
            }
            name="questionTypeId"
            rules={[{ required: true, message: 'Vui lòng chọn loại câu hỏi!' }]}
          >
            <Select
              placeholder="Chọn loại câu hỏi"
              size="large"
              onChange={handleQuestionTypeChange}
              options={questionTypes.map((type) => ({
                label: type.name,
                value: type.id,
              }))}
            />
          </Form.Item>
        </div>

        {/* Step 2: Question Content */}
        <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <span className="text-xl">❓</span>
              <div>
                <h4 className="text-sm font-semibold text-green-900 m-0 mb-1">
                  Nội dung câu hỏi
                </h4>
                <p className="text-xs text-green-700 m-0">
                  Điền nội dung chi tiết câu hỏi và đáp án mẫu (tùy chọn)
                </p>
              </div>
            </div>
          </div>

          <Form.Item
            label={
              <span className="font-semibold">
                <span className="text-red-500">* </span>Nội dung câu hỏi
              </span>
            }
            name="content"
            rules={[
              { required: true, message: 'Vui lòng nhập nội dung câu hỏi!' },
              { min: 10, message: 'Nội dung phải có ít nhất 10 ký tự!' },
              { max: 2000, message: 'Nội dung không được quá 2000 ký tự!' },
            ]}
          >
            <TextArea
              placeholder="Viết nội dung chi tiết câu hỏi..."
              rows={6}
              showCount
              maxLength={2000}
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-semibold">
                Đáp án mẫu
              </span>
            }
            name="answer"
            rules={[
              { max: 2000, message: 'Đáp án không được quá 2000 ký tự!' },
            ]}
          >
            <TextArea
              placeholder="Viết đáp án mẫu cho câu hỏi (tùy chọn)..."
              rows={4}
              showCount
              maxLength={2000}
            />
          </Form.Item>

          {selectedQuestionType === 'MULTIPLE_CHOICE' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <div className="flex items-start gap-2">
                <span className="text-xl">⚠️</span>
                <div>
                  <h4 className="text-sm font-semibold text-yellow-900 m-0 mb-1">
                    Lưu ý cho câu hỏi trắc nghiệm
                  </h4>
                  <p className="text-xs text-yellow-700 m-0">
                    Bạn sẽ cần thêm các phương án trả lời sau khi tạo câu hỏi.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Form>
    </Drawer>
  );
};

export default CreateQuestionDrawer;