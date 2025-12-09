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
  Tabs,
} from 'antd';
import {
  Post,
  Field,
  Topic,
  Level,
} from '@abc-interview-support-frontend/types';
import { communityService } from '@abc-interview-support-frontend/services';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

interface FormDrawerProps {
  open: boolean;
  onClose: () => void;
  data: Post | null;
  onSuccess?: () => void;
  fields: Field[];
  topics: Topic[];
  levels: Level[];
}

const CommunityFormDrawer: React.FC<FormDrawerProps> = ({
  open,
  onClose,
  data,
  onSuccess,
  fields,
  topics,
  levels,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  // Format datetime for datetime-local input (remove seconds)
  const formatDateTimeForInput = (dateTimeString: string | undefined): string => {
    if (!dateTimeString) return '';

    try {
      // If it's already in the right format (without seconds), return as is
      if (dateTimeString.includes('T') && !dateTimeString.includes(':')) {
        return dateTimeString;
      }

      // Parse the datetime string and format for datetime-local input
      const date = new Date(dateTimeString);

      // Format as YYYY-MM-DDTHH:mm (without seconds for datetime-local)
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      console.warn('Error formatting datetime:', error);
      return '';
    }
  };

  // Convert datetime-local format to ISO string for API
  const convertToISOString = (dateTimeLocal: string): string => {
    if (!dateTimeLocal) return '';
    try {
      const date = new Date(dateTimeLocal);
      if (isNaN(date.getTime())) return '';
      return date.toISOString();
    } catch (error) {
      console.error('Error converting to ISO string:', error);
      return '';
    }
  };

  // Form data states
  const [formData, setFormData] = useState({
    userId: 1, // Fixed user ID
    fieldId: data?.fieldId || undefined,
    topicId: data?.topicId || undefined,
    levelId: data?.levelId || undefined,
    postType: data?.postType || 'DISCUSSION',
    status: data?.status || 'DRAFT',
    title: data?.title || '',
    content: data?.content || '',
    isLocked: !!data?.lockTime,
    lockTime: formatDateTimeForInput(data?.lockTime),
  });

  // Reset/initialize form when data changes
  useEffect(() => {
    if (open) {
      setActiveTab('basic'); // Reset to basic tab when opening
      if (data) {
        // Editing existing post
        const initialData = {
          userId: 1, // Fixed user ID
          fieldId: data.fieldId,
          topicId: data.topicId,
          levelId: data.levelId,
          postType: data.postType,
          status: data.status,
          title: data.title,
          content: data.content,
          isLocked: !!data.lockTime,
          lockTime: data.lockTime || '',
        };
        form.setFieldsValue({
          fieldId: data.fieldId,
          topicId: data.topicId,
          levelId: data.levelId,
          postType: data.postType,
          status: data.status,
          title: data.title,
          content: data.content,
          isLocked: !!data.lockTime,
          lockTime: data.lockTime || '',
        });
        setFormData(initialData);
      } else {
        // Creating new post
        const initialData = {
          userId: 1, // Fixed user ID
          fieldId: undefined,
          topicId: undefined,
          levelId: undefined,
          postType: 'DISCUSSION' as const,
          status: 'DRAFT' as const,
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

  const handleFieldChange = (value: number) => {
    setFormData(prev => ({ ...prev, fieldId: value, topicId: undefined })); // Reset topic when field changes
  };

  const handleTopicChange = (value: number) => {
    setFormData(prev => ({ ...prev, topicId: value }));
  };

  const handleLevelChange = (value: number) => {
    setFormData(prev => ({ ...prev, levelId: value }));
  };

  const handlePostTypeChange = (value: 'DISCUSSION' | 'QUESTION') => {
    setFormData(prev => ({ ...prev, postType: value }));
  };

  const handleStatusChange = (value: 'DRAFT' | 'PUBLISHED' | 'LOCKED') => {
    setFormData(prev => ({ ...prev, status: value }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, title: e.target.value }));
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, content: e.target.value }));
  };

  const handleLockChange = (checked: boolean) => {
    console.log('Lock switch changed:', checked);
    setFormData(prev => ({
      ...prev,
      isLocked: checked,
      lockTime: checked ? (prev.lockTime || formatDateTimeForInput(new Date().toISOString())) : ''
    }));
    console.log('New lockTime value:', checked ? (formData.lockTime || formatDateTimeForInput(new Date().toISOString())) : '');
  };

  const handleLockTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = e.target.value;
    console.log('LockTime selected (raw):', selectedValue);

    // Parse the datetime-local value to check if it's correct
    const selectedDate = new Date(selectedValue);
    console.log('Parsed date:', selectedDate);
    console.log('Hours:', selectedDate.getHours());
    console.log('Minutes:', selectedDate.getMinutes());

    setFormData(prev => ({ ...prev, lockTime: selectedValue }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validate form
      await form.validateFields();

      if (!formData.fieldId) {
        message.error('Vui lòng chọn lĩnh vực');
        setActiveTab('basic');
        return;
      }

      if (!formData.topicId) {
        message.error('Vui lòng chọn chủ đề');
        setActiveTab('basic');
        return;
      }

      const postData = {
        userId: formData.userId,
        fieldId: formData.fieldId,
        topicId: formData.topicId,
        levelId: formData.levelId || levels[0]?.id || 1, // Default to first level or 1
        postType: formData.postType,
        title: formData.title,
        content: formData.content,
        lockTime: formData.isLocked && formData.lockTime ? convertToISOString(formData.lockTime) : '',
      };

      console.log('Form values:', formData);
      console.log('Complete post data:', postData);

      try {
        if (data) {
          // Update existing post - TODO: Implement update API when available
          console.log('Update post:', data.id, postData);
          message.success('Cập nhật bài viết thành công!');
        } else {
          // Create new post
          const response = await communityService.createPost(postData);
          console.log('Create post response:', response);
          message.success('Tạo bài viết thành công!');
        }

        // Call onSuccess callback to refresh data
        if (onSuccess) {
          onSuccess();
        }

        onClose();
      } catch (apiError: any) {
        console.error('API Error:', apiError);

        // Handle API error
        if (apiError.response?.data?.message) {
          message.error(`Lỗi: ${apiError.response.data.message}`);
        } else if (apiError.message) {
          message.error(`Lỗi: ${apiError.message}`);
        } else {
          message.error('Có lỗi xảy ra khi lưu bài viết. Vui lòng thử lại.');
        }
      }
    } catch (error: unknown) {
      console.error('Form submission error:', error);

      // Handle validation errors - switch to appropriate tab
      if (error && typeof error === 'object' && 'errorFields' in error) {
        const validationError = error as { errorFields?: Array<{ name: string[] }> };
        if (validationError.errorFields) {
          const errorFields = validationError.errorFields;
          const basicFields = ['userId', 'fieldId', 'topicId', 'levelId', 'postType', 'status'];
          const detailFields = ['title', 'content', 'lockTime'];

          const hasBasicErrors = errorFields.some(field =>
            basicFields.includes(field.name[0])
          );
          const hasDetailErrors = errorFields.some(field =>
            detailFields.includes(field.name[0])
          );

          if (hasBasicErrors) {
            setActiveTab('basic');
          } else if (hasDetailErrors) {
            setActiveTab('detail');
          }
        }
      }

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
    setActiveTab('basic'); // Reset to basic tab
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
          fieldId: data?.fieldId,
          topicId: data?.topicId,
          levelId: data?.levelId,
          postType: data?.postType || 'DISCUSSION',
          status: data?.status || 'DRAFT',
          title: data?.title,
          content: data?.content,
          isLocked: !!data?.lockTime,
          lockTime: data?.lockTime || '',
        }}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Thông tin cơ bản" key="basic">
            <Form.Item
              label="Lĩnh vực"
              name="fieldId"
              rules={[
                { required: true, message: 'Vui lòng chọn lĩnh vực' },
              ]}
            >
              <Select
                placeholder="Chọn lĩnh vực..."
                onChange={handleFieldChange}
              >
                {fields.map(field => (
                  <Option key={field.id} value={field.id}>
                    {field.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Chủ đề"
              name="topicId"
              rules={[
                { required: true, message: 'Vui lòng chọn chủ đề' },
              ]}
            >
              <Select
                placeholder="Chọn chủ đề..."
                onChange={handleTopicChange}
                disabled={!formData.fieldId}
              >
                {topics
                  .filter(topic => topic.fieldId === formData.fieldId)
                  .map(topic => (
                    <Option key={topic.id} value={topic.id}>
                      {topic.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Cấp độ"
              name="levelId"
            >
              <Select
                placeholder="Chọn cấp độ (tùy chọn)..."
                onChange={handleLevelChange}
                allowClear
              >
                {levels.map(level => (
                  <Option key={level.id} value={level.id}>
                    {level.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Loại bài viết"
              name="postType"
              rules={[
                { required: true, message: 'Vui lòng chọn loại bài viết' },
              ]}
            >
              <Select
                placeholder="Chọn loại bài viết..."
                onChange={handlePostTypeChange}
              >
                <Option value="DISCUSSION">Thảo luận</Option>
                <Option value="QUESTION">Câu hỏi</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[
                { required: true, message: 'Vui lòng chọn trạng thái' },
              ]}
            >
              <Select
                placeholder="Chọn trạng thái..."
                onChange={handleStatusChange}
              >
                <Option value="DRAFT">Nháp</Option>
                <Option value="PUBLISHED">Đã xuất bản</Option>
                <Option value="LOCKED">Đã khóa</Option>
              </Select>
            </Form.Item>
          </TabPane>

          <TabPane tab="Thông tin chi tiết" key="detail">
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
          </TabPane>
        </Tabs>
      </Form>
    </Drawer>
  );
};

export default CommunityFormDrawer;
