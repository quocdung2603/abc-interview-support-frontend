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
  Steps,
  Card,
  Typography,
  Tag,
  DatePicker,
} from 'antd';
import dayjs from 'dayjs';
import {
  Post,
  Field,
  Topic,
  Level,
} from '@abc-interview-support-frontend/types';
import { communityService } from '@abc-interview-support-frontend/services';

const { TextArea } = Input;
const { Option } = Select;
const { Step } = Steps;
const { Text } = Typography;

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
  const [currentStep, setCurrentStep] = useState(0);

  // Check if this is a published post (only lockTime can be edited)
  const isPublishedPost = data?.status === 'PUBLISHED';

  // Helper functions to get names from IDs
  const getFieldName = (fieldId: number) => {
    const field = fields.find(f => f.id === fieldId);
    return field ? field.name : 'N/A';
  };

  const getTopicName = (topicId: number) => {
    const topic = topics.find(t => t.id === topicId);
    return topic ? topic.name : 'N/A';
  };

  const getLevelName = (levelId: number) => {
    const level = levels.find(l => l.id === levelId);
    return level ? level.name : 'N/A';
  };

  const getPostTypeText = (postType: string) => {
    switch (postType) {
      case 'DISCUSSION':
        return 'Thảo luận';
      case 'QUESTION':
        return 'Câu hỏi';
      default:
        return postType;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'Nháp';
      case 'PUBLISHED':
        return 'Đã xuất bản';
      case 'LOCKED':
        return 'Đã khóa';
      default:
        return status;
    }
  };

  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                disabled={isPublishedPost}
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
                disabled={!formData.fieldId || isPublishedPost}
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
                disabled={isPublishedPost}
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
                disabled={isPublishedPost}
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
                disabled={isPublishedPost}
              >
                <Option value="DRAFT">Nháp</Option>
                <Option value="PUBLISHED">Đã xuất bản</Option>
                <Option value="LOCKED">Đã khóa</Option>
              </Select>
            </Form.Item>
          </div>
        );

      case 1:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                disabled={isPublishedPost}
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
                disabled={isPublishedPost}
              />
            </Form.Item>

            <Form.Item label="Cài đặt khóa bài viết">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Khóa bài viết:</span>
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
                    <DatePicker
                      showTime={{
                        format: 'HH:mm:ss',
                        defaultValue: dayjs('00:00:00', 'HH:mm:ss'),
                      }}
                      format="DD/MM/YYYY HH:mm:ss"
                      placeholder="Chọn ngày và giờ khóa"
                      style={{ width: '100%' }}
                      onChange={handleLockTimeChange}
                    />
                  </Form.Item>
                )}
              </div>
            </Form.Item>
          </div>
        );

      case 2:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Card title="Xác nhận thông tin bài viết" size="small">
              <div style={{ display: 'grid', gap: '12px' }}>
                <div>
                  <Text strong>Lĩnh vực:</Text> {getFieldName(formData.fieldId || 0)}
                </div>
                <div>
                  <Text strong>Chủ đề:</Text> {getTopicName(formData.topicId || 0)}
                </div>
                {formData.levelId && (
                  <div>
                    <Text strong>Cấp độ:</Text> {getLevelName(formData.levelId)}
                  </div>
                )}
                <div>
                  <Text strong>Loại bài viết:</Text> {getPostTypeText(formData.postType)}
                </div>
                <div>
                  <Text strong>Trạng thái:</Text> {getStatusText(formData.status)}
                </div>
                <div>
                  <Text strong>Tiêu đề:</Text> {formData.title}
                </div>
                <div>
                  <Text strong>Nội dung:</Text>
                  <div style={{
                    marginTop: '8px',
                    padding: '8px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '4px',
                    maxHeight: '100px',
                    overflow: 'hidden'
                  }}>
                    {formData.content}
                  </div>
                </div>
                {formData.isLocked && (
                  <div>
                    <Text strong>Thời gian khóa:</Text> {formData.lockTime ? new Date(formData.lockTime).toLocaleString('vi-VN') : 'N/A'}
                  </div>
                )}
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  // Parse datetime string and return dayjs object for DatePicker
  const parseDateTimeForPicker = (dateTimeString: string | undefined) => {
    if (!dateTimeString) return null;

    try {
      // Parse the date string (assuming it's in format: YYYY-MM-DDTHH:mm:ss)
      const dayjsObj = dayjs(dateTimeString, 'YYYY-MM-DDTHH:mm:ss');

      // Check if date is valid
      if (!dayjsObj.isValid()) {
        console.warn('Invalid date:', dateTimeString);
        return null;
      }

      return dayjsObj;
    } catch (error) {
      console.warn('Error parsing datetime:', error);
      return null;
    }
  };

  // Convert dayjs object to local time string for API (format: YYYY-MM-DDTHH:mm:ss)
  const convertToAPIFormat = (dayjsObj: dayjs.Dayjs | null): string => {
    if (!dayjsObj || !dayjsObj.isValid()) return '';

    try {
      // Format: YYYY-MM-DDTHH:mm:ss (local time, no timezone conversion)
      return dayjsObj.format('YYYY-MM-DDTHH:mm:ss');
    } catch (error) {
      console.error('Error converting to API format:', error);
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
    lockTime: data?.lockTime || '',
  });

  // Reset/initialize form when data changes
  useEffect(() => {
    if (open) {
      setCurrentStep(0); // Reset to first step when opening
      if (data) {
        // Editing existing post
        const lockTimeValue = data.lockTime || '';
        const lockTimeDayjs = parseDateTimeForPicker(lockTimeValue);

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
          lockTime: lockTimeValue,
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
          lockTime: lockTimeDayjs,
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

    if (checked) {
      // When enabling lock, set default time to current local time if not already set
      const currentLockTime = form.getFieldValue('lockTime');
      const defaultTime = currentLockTime || dayjs();
      const defaultTimeString = defaultTime ? convertToAPIFormat(defaultTime) : '';

      form.setFieldsValue({ lockTime: defaultTime });
      setFormData(prev => ({
        ...prev,
        isLocked: checked,
        lockTime: defaultTimeString
      }));
    } else {
      // When disabling lock, clear the time
      form.setFieldsValue({ lockTime: null });
      setFormData(prev => ({
        ...prev,
        isLocked: checked,
        lockTime: ''
      }));
    }
  };

  const handleLockTimeChange = (value: dayjs.Dayjs | null) => {
    const timeString = value ? convertToAPIFormat(value) : '';
    console.log('Lock time changed:', timeString);
    setFormData(prev => ({
      ...prev,
      lockTime: timeString
    }));
  };

  // Step navigation functions
  const nextStep = async () => {
    try {
      // Validate current step before proceeding
      if (currentStep === 0) {
        // Validate basic information
        await form.validateFields(['fieldId', 'topicId', 'postType', 'status']);
        if (!formData.fieldId) {
          message.error('Vui lòng chọn lĩnh vực');
          return;
        }
        if (!formData.topicId) {
          message.error('Vui lòng chọn chủ đề');
          return;
        }
      } else if (currentStep === 1) {
        // Validate detail information
        await form.validateFields(['title', 'content']);
        if (formData.isLocked && !form.getFieldValue('lockTime')) {
          message.error('Vui lòng chọn thời gian khóa');
          return;
        }
      }

      setCurrentStep(currentStep + 1);
    } catch (error) {
      // Validation failed, stay on current step
      console.log('Validation failed:', error);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validate form
      await form.validateFields();

      if (!formData.fieldId) {
        message.error('Vui lòng chọn lĩnh vực');
        setCurrentStep(0);
        return;
      }

      if (!formData.topicId) {
        message.error('Vui lòng chọn chủ đề');
        setCurrentStep(0);
        return;
      }

      // Get lockTime from formData state (already in correct format)
      const lockTimeValue = formData.isLocked && formData.lockTime ? formData.lockTime : '';

      const postData = {
        userId: formData.userId,
        fieldId: formData.fieldId,
        topicId: formData.topicId,
        levelId: formData.levelId || levels[0]?.id || 1, // Default to first level or 1
        postType: formData.postType,
        title: formData.title,
        content: formData.content,
        lockTime: lockTimeValue,
      };

      console.log('Form values:', formData);
      console.log('Complete post data:', postData);

      try {
        if (data) {
          // Check if this is a published post and only lockTime is being changed
          const isPublishedPost = data.status === 'PUBLISHED';
          const originalLockTime = data.lockTime || '';
          const newLockTime = lockTimeValue;

          // Check if only lockTime has changed for published posts
          const hasOtherChanges = (
            formData.fieldId !== data.fieldId ||
            formData.topicId !== data.topicId ||
            formData.levelId !== data.levelId ||
            formData.postType !== data.postType ||
            formData.title !== data.title ||
            formData.content !== data.content ||
            formData.status !== data.status
          );

          if (isPublishedPost && !hasOtherChanges && originalLockTime !== newLockTime) {
            // Only lockTime changed for published post - use setLockTime API
            console.log('Update lockTime for published post:', data.id, { lockTime: newLockTime });
            await communityService.setLockTime(data.id, newLockTime);
            message.success('Cập nhật thời gian khóa thành công!');
          } else if (!isPublishedPost) {
            // Regular update for non-published posts - TODO: Implement update API when available
            console.log('Update post:', data.id, postData);
            message.success('Cập nhật bài viết thành công!');
          } else {
            // No changes or invalid operation for published post
            message.info('Không có thay đổi nào được thực hiện.');
          }
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
            setCurrentStep(0);
          } else if (hasDetailErrors) {
            setCurrentStep(1);
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
    setCurrentStep(0); // Reset to first step
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
            {currentStep > 0 && (
              <Button onClick={prevStep} disabled={loading}>
                Quay lại
              </Button>
            )}
            {currentStep < 2 ? (
              <Button type="primary" onClick={nextStep} disabled={loading}>
                Tiếp theo
              </Button>
            ) : (
              <Button type="primary" onClick={handleSubmit} loading={loading}>
                {data ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            )}
          </Space>
        </div>
      }
    >
      <div style={{ padding: '20px 0' }}>
        <Steps current={currentStep} style={{ marginBottom: '24px' }}>
          <Step title="Thông tin cơ bản" />
          <Step title="Thông tin chi tiết" />
          <Step title="Xác nhận" />
        </Steps>

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
          {renderStepContent()}
        </Form>
      </div>
    </Drawer>
  );
};

export default CommunityFormDrawer;
