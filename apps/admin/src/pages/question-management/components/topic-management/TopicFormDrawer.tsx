import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Form,
  Input,
  Select,
  Button,
  Space,
  message,
} from 'antd';
import {
  Topic,
  Field,
} from '@abc-interview-support-frontend/types';
import { questionService } from '@abc-interview-support-frontend/services';

const { Option } = Select;
const { TextArea } = Input;

interface FormDrawerProps {
  visible: boolean;
  onClose: () => void;
  data: Topic | null;
  onSuccess?: () => void;
}

const TopicFormDrawer: React.FC<FormDrawerProps> = ({
  visible,
  onClose,
  data,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState<Field[]>([]);

  // Form data states
  const [formData, setFormData] = useState({
    fieldId: data?.fieldId || undefined,
    name: data?.name || '',
    description: data?.description || '',
  });

  // Fetch fields on mount
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const res = await questionService.getAllFields();
        setFields(res.content || []);
      } catch (error) {
        console.error('Error fetching fields:', error);
      }
    };
    if (visible) {
      fetchFields();
    }
  }, [visible]);

  // Reset/initialize form when data changes
  useEffect(() => {
    if (visible) {
      if (data) {
        // Editing existing topic
        const initialData = {
          fieldId: data.fieldId,
          name: data.name,
          description: data.description || '',
        };
        form.setFieldsValue(initialData);
        setFormData(initialData);
      } else {
        // Creating new topic
        const initialData = {
          fieldId: undefined,
          name: '',
          description: '',
        };
        form.resetFields();
        form.setFieldsValue({ fieldId: undefined });
        setFormData(initialData);
      }
    }
  }, [data, visible, form]);

  const handleFieldChange = (value: number) => {
    setFormData(prev => ({ ...prev, fieldId: value }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, name: e.target.value }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, description: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validate form
      await form.validateFields();

      const topicData = {
        fieldId: formData.fieldId!,
        name: formData.name,
        description: formData.description,
      };

      console.log('Form values:', formData);
      console.log('Complete topic data:', topicData);

      let response;
      if (data) {
        // Update existing topic
        response = await questionService.updateTopic(data.id, topicData);
        console.log('Update topic response:', response);
        message.success('Cập nhật chủ đề thành công!');
      } else {
        // Create new topic
        response = await questionService.createTopic(topicData);
        console.log('Create topic response:', response);
        message.success('Tạo chủ đề thành công!');
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
        message.error('Có lỗi xảy ra khi tạo chủ đề. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Drawer
      title={data ? 'Chỉnh sửa chủ đề' : 'Tạo chủ đề mới'}
      width={800}
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
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          fieldId: data?.fieldId,
          name: data?.name,
          description: data?.description,
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
          label="Tên chủ đề"
          name="name"
          rules={[
            { required: true, message: 'Vui lòng nhập tên chủ đề' },
            { min: 1, message: 'Tên chủ đề không được để trống' },
          ]}
        >
          <Input
            placeholder="Nhập tên chủ đề..."
            onChange={handleNameChange}
          />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
        >
          <TextArea
            rows={4}
            placeholder="Nhập mô tả cho chủ đề..."
            onChange={handleDescriptionChange}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default TopicFormDrawer;