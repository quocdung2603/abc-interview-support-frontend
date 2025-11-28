import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Form,
  Input,
  Button,
  Space,
  message,
} from 'antd';
import {
  Field,
} from '@abc-interview-support-frontend/types';
import { questionService } from '@abc-interview-support-frontend/services';

const { TextArea } = Input;

interface FormDrawerProps {
  visible: boolean;
  onClose: () => void;
  data: Field | null;
  onSuccess?: () => void;
}

const FieldFormDrawer: React.FC<FormDrawerProps> = ({
  visible,
  onClose,
  data,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Form data states
  const [formData, setFormData] = useState({
    name: data?.name || '',
    description: data?.description || '',
  });

  // Reset/initialize form when data changes
  useEffect(() => {
    if (visible) {
      if (data) {
        // Editing existing field
        const initialData = {
          name: data.name,
          description: data.description || '',
        };
        form.setFieldsValue(initialData);
        setFormData(initialData);
      } else {
        // Creating new field
        const initialData = {
          name: '',
          description: '',
        };
        form.resetFields();
        setFormData(initialData);
      }
    }
  }, [data, visible, form]);

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

      const fieldData = {
        name: formData.name,
        description: formData.description,
      };

      console.log('Form values:', formData);
      console.log('Complete field data:', fieldData);

      let response;
      if (data) {
        // Update existing field
        response = await questionService.updateField(data.id, fieldData);
        console.log('Update field response:', response);
        message.success('Cập nhật lĩnh vực thành công!');
      } else {
        // Create new field
        response = await questionService.createField(fieldData);
        console.log('Create field response:', response);
        message.success('Tạo lĩnh vực thành công!');
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
        message.error('Có lỗi xảy ra khi tạo lĩnh vực. Vui lòng thử lại.');
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
      title={data ? 'Chỉnh sửa lĩnh vực' : 'Tạo lĩnh vực mới'}
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
          name: data?.name,
          description: data?.description,
        }}
      >
        <Form.Item
          label="Tên lĩnh vực"
          name="name"
          rules={[
            { required: true, message: 'Vui lòng nhập tên lĩnh vực' },
            { min: 1, message: 'Tên lĩnh vực không được để trống' },
          ]}
        >
          <Input
            placeholder="Nhập tên lĩnh vực..."
            onChange={handleNameChange}
          />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
        >
          <TextArea
            rows={4}
            placeholder="Nhập mô tả cho lĩnh vực..."
            onChange={handleDescriptionChange}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default FieldFormDrawer;
