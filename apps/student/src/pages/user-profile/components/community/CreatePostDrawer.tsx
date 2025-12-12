import React, { useState, useEffect } from 'react';
import { Drawer, Steps, Form, Select, Input, Button, message } from 'antd';
import { Field, Topic, Level, Post } from '@abc-interview-support-frontend/types';

const { TextArea } = Input;

interface CreatePostDrawerProps {
  open: boolean;
  onClose: () => void;
  fields: Field[];
  topics: Topic[];
  levels: Level[];
  mode: 'create' | 'edit';
  editingPost?: Post;
  onSubmit: (data: CreatePostData) => Promise<void>;
  onUpdate?: (postId: number, data: CreatePostData) => Promise<void>;
}

export interface CreatePostData {
  fieldId: number;
  topicId: number;
  levelId: number;
  postType: 'DISCUSSION' | 'QUESTION';
  title: string;
  content: string;
  lockTime: null;
}

const CreatePostDrawer: React.FC<CreatePostDrawerProps> = ({
  open,
  onClose,
  fields,
  topics,
  levels,
  mode,
  editingPost,
  onSubmit,
  onUpdate,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Step 1 fields
  const [fieldId, setFieldId] = useState<number | undefined>();
  const [topicId, setTopicId] = useState<number | undefined>();
  const [levelId, setLevelId] = useState<number | undefined>();

  // Populate form when editing
  useEffect(() => {
    if (mode === 'edit' && editingPost && open) {
      form.setFieldsValue({
        fieldId: editingPost.fieldId,
        topicId: editingPost.topicId,
        levelId: editingPost.levelId,
        postType: editingPost.postType,
        title: editingPost.title,
        content: editingPost.content,
      });
      setFieldId(editingPost.fieldId);
      setTopicId(editingPost.topicId);
      setLevelId(editingPost.levelId);
    } else if (mode === 'create' && open) {
      // Reset form for create mode
      form.resetFields();
      setFieldId(undefined);
      setTopicId(undefined);
      setLevelId(undefined);
    }
  }, [mode, editingPost, open, form]);

  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        // Validate step 1
        await form.validateFields(['fieldId', 'topicId', 'levelId']);
        setCurrentStep(1);
      }
    } catch (error) {
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

      const postData: CreatePostData = {
        fieldId: values.fieldId,
        topicId: values.topicId,
        levelId: values.levelId,
        postType: 'DISCUSSION',
        title: values.title,
        content: values.content,
        lockTime: null,
      };

      if (mode === 'edit' && editingPost && onUpdate) {
        await onUpdate(editingPost.id, postData);
        message.success('Cập nhật bài thảo luận thành công!');
      } else {
        await onSubmit(postData);
        message.success('Tạo bài thảo luận thành công!');
      }
      handleClose();
    } catch (error) {
      console.error('Error saving post:', error);
      message.error(`Không thể ${mode === 'edit' ? 'cập nhật' : 'tạo'} bài thảo luận. Vui lòng thử lại!`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setCurrentStep(0);
    setFieldId(undefined);
    setTopicId(undefined);
    setLevelId(undefined);
    onClose();
  };

  const steps = [
    {
      title: 'Thông tin cá nhân',
      icon: '👤',
    },
    {
      title: 'Nội dung bài viết',
      icon: '📝',
    },
  ];

  return (
    <Drawer
      title={
        <div className="flex items-center gap-2">
          <span className="text-xl">{mode === 'edit' ? '✏️' : '✍️'}</span>
          <span>{mode === 'edit' ? 'Chỉnh sửa bài thảo luận' : 'Tạo bài thảo luận mới'}</span>
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
                {mode === 'edit' ? 'Cập nhật bài viết' : 'Tạo bài viết'}
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
          postType: 'DISCUSSION',
        }}
      >
        {/* Step 1: Personal Information */}
        <div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <span className="text-xl">ℹ️</span>
              <div>
                <h4 className="text-sm font-semibold text-blue-900 m-0 mb-1">
                  Thông tin cá nhân
                </h4>
                <p className="text-xs text-blue-700 m-0">
                  Vui lòng chọn lĩnh vực, chủ đề và cấp độ phù hợp với bài thảo
                  luận của bạn
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
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={fields.map((field) => ({
                label: field.name,
                value: field.id,
              }))}
              onChange={(value) => setFieldId(value)}
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
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={topics.map((topic) => ({
                label: topic.name,
                value: topic.id,
              }))}
              onChange={(value) => setTopicId(value)}
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
              onChange={(value) => setLevelId(value)}
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold">Loại bài viết</span>}
            name="postType"
          >
            <Select size="large" disabled>
              <Select.Option value="DISCUSSION">💬 Thảo luận</Select.Option>
            </Select>
          </Form.Item>
        </div>

        {/* Step 2: Post Content */}
        <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <span className="text-xl">📝</span>
              <div>
                <h4 className="text-sm font-semibold text-green-900 m-0 mb-1">
                  Nội dung bài viết
                </h4>
                <p className="text-xs text-green-700 m-0">
                  Hãy viết tiêu đề và nội dung rõ ràng để mọi người dễ hiểu và
                  tham gia thảo luận
                </p>
              </div>
            </div>
          </div>

          <Form.Item
            label={
              <span className="font-semibold">
                <span className="text-red-500">* </span>Tiêu đề
              </span>
            }
            name="title"
            rules={[
              { required: true, message: 'Vui lòng nhập tiêu đề!' },
              {
                max: 200,
                message: 'Tiêu đề không được quá 200 ký tự!',
              },
            ]}
          >
            <Input
              placeholder="Nhập tiêu đề bài thảo luận..."
              size="large"
              showCount
              maxLength={200}
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-semibold">
                <span className="text-red-500">* </span>Nội dung
              </span>
            }
            name="content"
            rules={[
              { required: true, message: 'Vui lòng nhập nội dung!' },
              {
                max: 5000,
                message: 'Nội dung không được quá 5000 ký tự!',
              },
            ]}
          >
            <TextArea
              placeholder="Viết nội dung chi tiết cho bài thảo luận của bạn..."
              rows={12}
              showCount
              maxLength={5000}
            />
          </Form.Item>

          {/* Preview selected info from step 1 */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <h4 className="text-xs font-semibold text-gray-700 m-0 mb-2">
              📋 Thông tin đã chọn:
            </h4>
            <div className="space-y-1 text-xs text-gray-600">
              <div>
                • Lĩnh vực:{' '}
                <span className="font-medium text-gray-900">
                  {fieldId
                    ? fields.find((f) => f.id === fieldId)?.name
                    : 'Chưa chọn'}
                </span>
              </div>
              <div>
                • Chủ đề:{' '}
                <span className="font-medium text-gray-900">
                  {topicId
                    ? topics.find((t) => t.id === topicId)?.name
                    : 'Chưa chọn'}
                </span>
              </div>
              <div>
                • Cấp độ:{' '}
                <span className="font-medium text-gray-900">
                  {levelId
                    ? levels.find((l) => l.id === levelId)?.name
                    : 'Chưa chọn'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </Drawer>
  );
};

export default CreatePostDrawer;
