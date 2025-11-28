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
  Level,
} from '@abc-interview-support-frontend/types';
import { questionService } from '@abc-interview-support-frontend/services';

const { TextArea } = Input;

interface FormDrawerProps {
  visible: boolean;
  onClose: () => void;
  data: Level | null;
  onSuccess?: () => void;
}

const LevelFormDrawer: React.FC<FormDrawerProps> = ({
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
        // Editing existing level
        const initialData = {
          name: data.name,
          description: data.description || '',
        };
        form.setFieldsValue(initialData);
        setFormData(initialData);
      } else {
        // Creating new level
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

      const levelData = {
        name: formData.name,
        description: formData.description,
      };

      console.log('Form values:', formData);
      console.log('Complete level data:', levelData);

      let response;
      if (data) {
        // Update existing level
        response = await questionService.updateLevel(data.id, levelData);
        console.log('Update level response:', response);
        message.success('Cập nhật mức độ thành công!');
      } else {
        // Create new level
        response = await questionService.createLevel(levelData);
        console.log('Create level response:', response);
        message.success('Tạo mức độ thành công!');
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
        message.error('Có lỗi xảy ra khi tạo mức độ. Vui lòng thử lại.');
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
      title={data ? 'Chỉnh sửa mức độ' : 'Tạo mức độ mới'}
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
          label="Tên mức độ"
          name="name"
          rules={[
            { required: true, message: 'Vui lòng nhập tên mức độ' },
            { min: 1, message: 'Tên mức độ không được để trống' },
          ]}
        >
          <Input
            placeholder="Nhập tên mức độ..."
            onChange={handleNameChange}
          />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
        >
          <TextArea
            rows={4}
            placeholder="Nhập mô tả cho mức độ..."
            onChange={handleDescriptionChange}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default LevelFormDrawer;