import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Form,
  Input,
  Button,
  Space,
  message,
  Switch,
  Select,
} from 'antd';
import {
  Post,
  User,
} from '@abc-interview-support-frontend/types';

const { TextArea } = Input;
const { Option } = Select;

interface FormDrawerProps {
  open: boolean;
  onClose: () => void;
  data: Post | null;
  onSuccess?: () => void;
}

const CommunityFormDrawer: React.FC<FormDrawerProps> = ({
  open,
  onClose,
  data,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  // Form data states
  const [formData, setFormData] = useState({
    userId: data?.userId || undefined,
    title: data?.title || '',
    content: data?.content || '',
    isLocked: !!data?.lockTime,
    lockTime: data?.lockTime || '',
  });

  // Load users for selection
  useEffect(() => {
    const loadUsers = async () => {
      try {
        // TODO: Implement API to get all users or search users
        // For now, we'll use mock users
        const mockUsers: User[] = [
          { id: 1, roleId: 1, roleName: 'User', email: 'user1@example.com', fullName: 'Nguyễn Văn A', dateOfBirth: '1990-01-01', address: 'Hà Nội', status: 'ACTIVE', isStudying: true, eloScore: 1200, eloRank: 'Learner', createdAt: '2025-01-01T00:00:00.000000' },
          { id: 2, roleId: 1, roleName: 'User', email: 'user2@example.com', fullName: 'Trần Thị B', dateOfBirth: '1992-05-15', address: 'Hồ Chí Minh', status: 'ACTIVE', isStudying: false, eloScore: 1500, eloRank: 'Intermediate', createdAt: '2025-01-01T00:00:00.000000' },
          { id: 3, roleId: 1, roleName: 'User', email: 'user3@example.com', fullName: 'Lê Văn C', dateOfBirth: '1988-12-20', address: 'Đà Nẵng', status: 'ACTIVE', isStudying: true, eloScore: 1800, eloRank: 'Advanced', createdAt: '2025-01-01T00:00:00.000000' },
        ];
        setUsers(mockUsers);
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };

    if (open) {
      loadUsers();
    }
  }, [open]);

  // Reset/initialize form when data changes
  useEffect(() => {
    if (open) {
      if (data) {
        // Editing existing post
        const initialData = {
          userId: data.userId,
          title: data.title,
          content: data.content,
          isLocked: !!data.lockTime,
          lockTime: data.lockTime || '',
        };
        form.setFieldsValue({
          userId: data.userId,
          title: data.title,
          content: data.content,
          isLocked: !!data.lockTime,
          lockTime: data.lockTime || '',
        });
        setFormData(initialData);
      } else {
        // Creating new post
        const initialData = {
          userId: undefined,
          title: '',
          content: '',
          isLocked: false,
          lockTime: '',
        };
        form.resetFields();
        setFormData(initialData);
      }
    }
  }, [data, open, form]);

  const handleUserChange = (value: number) => {
    setFormData(prev => ({ ...prev, userId: value }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, title: e.target.value }));
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, content: e.target.value }));
  };

  const handleLockChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isLocked: checked,
      lockTime: checked ? (prev.lockTime || new Date().toISOString()) : ''
    }));
  };

  const handleLockTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, lockTime: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validate form
      await form.validateFields();

      if (!formData.userId) {
        message.error('Vui lòng chọn người dùng');
        return;
      }

      const postData = {
        userId: formData.userId,
        title: formData.title,
        content: formData.content,
        lockTime: formData.isLocked && formData.lockTime ? formData.lockTime : null,
      };

      console.log('Form values:', formData);
      console.log('Complete post data:', postData);

      // TODO: Implement actual API calls
      if (data) {
        // Update existing post
        console.log('Update post:', data.id, postData);
        message.success('Cập nhật bài viết thành công!');
      } else {
        // Create new post
        console.log('Create post:', postData);
        message.success('Tạo bài viết thành công!');
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
        message.error('Có lỗi xảy ra khi lưu bài viết. Vui lòng thử lại.');
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
      title={data ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
      width={900}
      open={open}
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
          userId: data?.userId,
          title: data?.title,
          content: data?.content,
          isLocked: !!data?.lockTime,
          lockTime: data?.lockTime || '',
        }}
      >
        <Form.Item
          label="Người tạo"
          name="userId"
          rules={[
            { required: true, message: 'Vui lòng chọn người tạo bài viết' },
          ]}
        >
          <Select
            placeholder="Chọn người dùng..."
            onChange={handleUserChange}
            showSearch
            filterOption={(input, option) =>
              (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
            }
          >
            {users.map(user => (
              <Option key={user.id} value={user.id}>
                {user.fullName} ({user.email})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[
            { required: true, message: 'Vui lòng nhập tiêu đề bài viết' },
            { min: 1, message: 'Tiêu đề không được để trống' },
            { max: 200, message: 'Tiêu đề không được vượt quá 200 ký tự' },
          ]}
        >
          <Input
            placeholder="Nhập tiêu đề bài viết..."
            onChange={handleTitleChange}
          />
        </Form.Item>

        <Form.Item
          label="Nội dung"
          name="content"
          rules={[
            { required: true, message: 'Vui lòng nhập nội dung bài viết' },
            { min: 1, message: 'Nội dung không được để trống' },
          ]}
        >
          <TextArea
            rows={8}
            placeholder="Nhập nội dung bài viết..."
            onChange={handleContentChange}
          />
        </Form.Item>

        <Form.Item label="Cài đặt khóa bài viết">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div>
              <span style={{ marginRight: '8px' }}>Khóa bài viết:</span>
              <Switch
                checked={formData.isLocked}
                onChange={handleLockChange}
              />
            </div>

            {formData.isLocked && (
              <Form.Item
                name="lockTime"
                rules={[
                  { required: true, message: 'Vui lòng chọn thời gian khóa' },
                ]}
                style={{ marginBottom: 0 }}
              >
                <Input
                  type="datetime-local"
                  placeholder="Chọn thời gian khóa"
                  onChange={handleLockTimeChange}
                  value={formData.lockTime}
                />
              </Form.Item>
            )}
          </div>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default CommunityFormDrawer;
