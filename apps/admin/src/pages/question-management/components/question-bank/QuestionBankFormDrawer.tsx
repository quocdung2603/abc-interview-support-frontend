import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Form,
  Input,
  Select,
  Button,
  Space,
  message,
  Card,
  Tabs,
  Typography,
  Descriptions,
} from 'antd';
import {
  Question,
  Field,
  Topic,
  Level,
  QuestionType,
} from '@abc-interview-support-frontend/types';
import { useAuth } from '@abc-interview-support-frontend/sso-utils';
import { questionService } from '@abc-interview-support-frontend/services';
import type { TabsProps } from 'antd';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

interface FormDrawerProps {
  visible: boolean;
  onClose: () => void;
  data: Question | null;
  fields: Field[];
  topics: Topic[];
  levels: Level[];
  questionTypes: QuestionType[];
  onSuccess?: () => void;
}

const QuestionBankFormDrawer: React.FC<FormDrawerProps> = ({
  visible,
  onClose,
  data,
  fields,
  topics,
  levels,
  questionTypes,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const [selectedField, setSelectedField] = useState<number | undefined>(
    data?.fieldId
  );
  const [loading, setLoading] = useState(false);

  // Form data states for confirmation tab
  const [formData, setFormData] = useState({
    fieldId: data?.fieldId,
    topicId: data?.topicId,
    levelId: data?.levelId,
    questionTypeId: data?.questionTypeId,
    language: 'Vietnamese',
    content: data?.questionContent || '',
    answer: data?.questionAnswer || '',
  });

  // Reset/initialize form when data changes
  useEffect(() => {
    if (visible) {
      if (data) {
        // Editing existing question
        const initialData = {
          fieldId: data.fieldId,
          topicId: data.topicId,
          levelId: data.levelId,
          questionTypeId: data.questionTypeId,
          language: 'Vietnamese',
          content: data.questionContent,
          answer: data.questionAnswer,
        };
        form.setFieldsValue(initialData);
        setFormData(initialData);
        setSelectedField(data.fieldId);
      } else {
        // Creating new question
        const initialData = {
          fieldId: undefined,
          topicId: undefined,
          levelId: undefined,
          questionTypeId: undefined,
          language: 'Vietnamese',
          content: '',
          answer: '',
        };
        form.resetFields();
        form.setFieldsValue({ language: 'Vietnamese' });
        setFormData(initialData);
        setSelectedField(undefined);
      }
      // Reset new variants when opening drawer
    }
  }, [data, visible, form]);

  const filteredTopics = topics.filter(
    (topic) => !selectedField || topic.fieldId === selectedField
  );

  const handleFieldChange = (value: number) => {
    setSelectedField(value);
    form.setFieldsValue({ topicId: undefined }); // Reset topic when field changes
    setFormData(prev => ({ ...prev, fieldId: value, topicId: undefined }));
  };

  const handleTopicChange = (value: number) => {
    setFormData(prev => ({ ...prev, topicId: value }));
  };

  const handleLevelChange = (value: number) => {
    setFormData(prev => ({ ...prev, levelId: value }));
  };

  const handleQuestionTypeChange = (value: number) => {
    setFormData(prev => ({ ...prev, questionTypeId: value }));
  };

  const handleLanguageChange = (value: string) => {
    setFormData(prev => ({ ...prev, language: value }));
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, content: e.target.value }));
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, answer: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Check if user is authenticated
      if (!user?.id) {
        message.error('Không thể xác định người dùng. Vui lòng đăng nhập lại.');
        return;
      }

      // Validate form using form.validateFields() but use formData for submission
      await form.validateFields();

      // Prepare the complete question data including userId
      const questionData = {
        userId: user.id,
        topicId: formData.topicId,
        fieldId: formData.fieldId,
        levelId: formData.levelId,
        questionTypeId: formData.questionTypeId,
        content: formData.content,
        answer: formData.answer,
        language: formData.language,
      };

      console.log('Form values:', formData);
      console.log('Complete question data:', questionData);

      let response;
      if (data) {
        // Update existing question
        response = await questionService.updateQuestion(data.id, questionData);
        console.log('Update question response:', response);
        message.success('Cập nhật câu hỏi thành công!');
      } else {
        // Create new question
        response = await questionService.createQuestion(questionData);
        console.log('Create question response:', response);
        message.success('Tạo câu hỏi thành công!');
      }

      // Call onSuccess callback to refresh data
      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error: unknown) {
      console.error('Form submission error:', error);

      // Handle API error
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          message.error(`Lỗi: ${axiosError.response.data.message}`);
          return;
        }
      }

      if (error instanceof Error && error.message) {
        message.error(`Lỗi: ${error.message}`);
      } else {
        message.error('Có lỗi xảy ra khi tạo câu hỏi. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setSelectedField(undefined);
    onClose();
  };

  const FormTabMenu: TabsProps['items'] = [
    {
      key: '1',
      label: 'Thông tin cơ bản',
      children: (
        <div style={{ padding: '16px 0' }}>
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              fieldId: data?.fieldId,
              topicId: data?.topicId,
              levelId: data?.levelId,
              questionTypeId: data?.questionTypeId,
              language: 'Vietnamese',
            }}
          >
            <Form.Item
              label="Lĩnh vực"
              name="fieldId"
              rules={[{ required: true, message: 'Vui lòng chọn lĩnh vực' }]}
            >
              <Select placeholder="Chọn lĩnh vực" onChange={handleFieldChange}>
                {fields.map((field) => (
                  <Option key={field.id} value={field.id}>
                    {field.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Chủ đề"
              name="topicId"
              rules={[{ required: true, message: 'Vui lòng chọn chủ đề' }]}
            >
              <Select placeholder="Chọn chủ đề" disabled={!selectedField} onChange={handleTopicChange}>
                {filteredTopics.map((topic) => (
                  <Option key={topic.id} value={topic.id}>
                    {topic.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Mức độ"
              name="levelId"
              rules={[{ required: true, message: 'Vui lòng chọn mức độ' }]}
            >
              <Select placeholder="Chọn mức độ" onChange={handleLevelChange}>
                {levels.map((level) => (
                  <Option key={level.id} value={level.id}>
                    {level.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Loại câu hỏi"
              name="questionTypeId"
              rules={[{ required: true, message: 'Vui lòng chọn loại câu hỏi' }]}
            >
              <Select placeholder="Chọn loại câu hỏi" onChange={handleQuestionTypeChange}>
                {questionTypes.map((questionType) => (
                  <Option key={questionType.id} value={questionType.id}>
                    {questionType.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Ngôn ngữ"
              name="language"
              rules={[{ required: true, message: 'Vui lòng chọn ngôn ngữ' }]}
            >
              <Select placeholder="Chọn ngôn ngữ" onChange={handleLanguageChange}>
                <Option value="Vietnamese">Tiếng Việt</Option>
                <Option value="English">Tiếng Anh</Option>
              </Select>
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      key: '2',
      label: 'Chi tiết câu hỏi',
      children: (
        <div style={{ padding: '16px 0' }}>
          <Form form={form} layout="vertical">
            <Form.Item
              label="Nội dung câu hỏi"
              name="content"
              rules={[
                { required: true, message: 'Vui lòng nhập nội dung câu hỏi' },
                { min: 10, message: 'Nội dung câu hỏi phải có ít nhất 10 ký tự' },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Nhập nội dung câu hỏi..."
                showCount
                maxLength={500}
                onChange={handleContentChange}
              />
            </Form.Item>

            <Form.Item
              label="Đáp án"
              name="answer"
              rules={[
                { required: true, message: 'Vui lòng nhập đáp án' },
                { min: 1, message: 'Đáp án không được để trống' },
              ]}
            >
              <TextArea
                rows={6}
                placeholder="Nhập đáp án cho câu hỏi..."
                showCount
                maxLength={1000}
                onChange={handleAnswerChange}
              />
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      key: '3',
      label: 'Xác nhận',
      children: (
        <div style={{ padding: '16px 0' }}>
          <Card title="Thông tin câu hỏi" style={{ marginBottom: '16px' }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Lĩnh vực">
                {fields.find(f => f.id === formData.fieldId)?.name || 'Chưa chọn'}
              </Descriptions.Item>
              <Descriptions.Item label="Chủ đề">
                {filteredTopics.find(t => t.id === formData.topicId)?.name || 'Chưa chọn'}
              </Descriptions.Item>
              <Descriptions.Item label="Mức độ">
                {levels.find(l => l.id === formData.levelId)?.name || 'Chưa chọn'}
              </Descriptions.Item>
              <Descriptions.Item label="Loại câu hỏi">
                {questionTypes.find(qt => qt.id === formData.questionTypeId)?.name || 'Chưa chọn'}
              </Descriptions.Item>
              <Descriptions.Item label="Ngôn ngữ">
                {formData.language === 'Vietnamese' ? 'Tiếng Việt' : 'Tiếng Anh'}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Nội dung câu hỏi">
            <div style={{ marginBottom: '16px' }}>
              <Text strong>Nội dung:</Text>
              <div style={{ marginTop: '8px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                {formData.content || 'Chưa nhập nội dung'}
              </div>
            </div>
            <div>
              <Text strong>Đáp án:</Text>
              <div style={{ marginTop: '8px', padding: '12px', backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '4px' }}>
                {formData.answer || 'Chưa nhập đáp án'}
              </div>
            </div>
          </Card>

          <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#fff7e6', border: '1px solid #ffd591', borderRadius: '4px' }}>
            <Text strong style={{ color: '#d46b08' }}>
              <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDMTMuMSAyIDI0IDMuOSA4IDMuOVoiIGZpbGw9IiNkNDZiMDgiLz4KPHJlY3QgeD0iMTEiIHk9IjYiIHdpZHRoPSIyIiBoZWlnaHQ9IjEwIiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB4PSIxMSIgeT0iMTgiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=" alt="warning icon" style={{ width: '16px', height: '16px', verticalAlign: 'middle', marginRight: '8px' }} /> Vui lòng kiểm tra lại thông tin trước khi {data ? 'cập nhật' : 'tạo'} câu hỏi. Sau khi {data ? 'cập nhật' : 'tạo'}, bạn có thể chỉnh sửa câu hỏi này.
            </Text>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Drawer
      title={data ? 'Chỉnh sửa câu hỏi' : 'Tạo câu hỏi mới'}
      width={900}
      open={visible}
      onClose={handleClose}
      footer={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button onClick={handleClose} disabled={loading}>Hủy</Button>
          <Space>
            <Button type="primary" onClick={handleSubmit} loading={loading}>
              {data ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </Space>
        </div>
      }
    >
      <Tabs defaultActiveKey="1" items={FormTabMenu} />
    </Drawer>
  );
};

export default QuestionBankFormDrawer;
