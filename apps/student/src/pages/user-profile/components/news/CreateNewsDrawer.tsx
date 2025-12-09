import React, { useState } from 'react';
import {
  Drawer,
  Steps,
  Form,
  Select,
  Input,
  Button,
  message,
} from 'antd';
import { Field } from '@abc-interview-support-frontend/types';

const { TextArea } = Input;

interface CreateNewsDrawerProps {
  open: boolean;
  onClose: () => void;
  fields: Field[];
  onSubmit: (data: CreateNewsData) => Promise<void>;
  editMode?: boolean;
  editData?: EditNewsData;
}

export interface CreateNewsData {
  userId: number;
  title: string;
  content: string;
  fieldId: number;
  newsType: 'NEWS' | 'RECRUITMENT';
}

export interface EditNewsData {
  newsId?: number;
  userId: number;
  title: string;
  content: string;
  fieldId: number;
  newsType: 'NEWS' | 'RECRUITMENT';
}

const CreateNewsDrawer: React.FC<CreateNewsDrawerProps> = ({
  open,
  onClose,
  fields,
  onSubmit,
  editMode = false,
  editData,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Load edit data when in edit mode
  React.useEffect(() => {
    if (editMode && editData && open) {
      form.setFieldsValue({
        fieldId: editData.fieldId,
        title: editData.title,
        content: editData.content,
        newsType: editData.newsType,
      });
    } else if (!open) {
      form.resetFields();
    }
  }, [editMode, editData, open, form]);

  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        // Validate step 1
        await form.validateFields(['fieldId']);
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

      // Note: userId will be passed from parent component
      const newsData: Partial<CreateNewsData> = {
        title: values.title,
        content: values.content,
        fieldId: values.fieldId,
        newsType: 'NEWS' as const, // Always NEWS type for trend news
      };

      await onSubmit(newsData as CreateNewsData);
      message.success('Tạo tin tức thành công!');
      handleClose();
    } catch (error) {
      console.error('Error creating news:', error);
      message.error('Không thể tạo tin tức. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setCurrentStep(0);
    onClose();
  };

  const steps = [
    {
      title: 'Thông tin cơ bản',
      icon: '📋',
    },
    {
      title: 'Nội dung tin tức',
      icon: '📝',
    },
  ];

  return (
    <Drawer
      title={
        <div className="flex items-center gap-2">
          <span className="text-xl">📰</span>
          <span>{editMode ? 'Chỉnh sửa tin tức' : 'Tạo tin tức mới'}</span>
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
                {editMode ? 'Cập nhật' : 'Tạo tin tức'}
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
          newsType: 'NEWS',
        }}
      >
        {/* Step 1: Basic Info */}
        <div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <span className="text-xl">ℹ️</span>
              <div>
                <h4 className="text-sm font-semibold text-blue-900 m-0 mb-1">
                  Tin tức xu hướng
                </h4>
                <p className="text-xs text-blue-700 m-0">
                  Chia sẻ tin tức và xu hướng công nghệ mới nhất
                </p>
              </div>
            </div>
          </div>

          {/* Hidden field for newsType - always NEWS */}
          <Form.Item name="newsType" hidden>
            <Input />
          </Form.Item>

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
            />
          </Form.Item>
        </div>

        {/* Step 2: Content */}
        <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <span className="text-xl">📝</span>
              <div>
                <h4 className="text-sm font-semibold text-green-900 m-0 mb-1">
                  Nội dung tin tức
                </h4>
                <p className="text-xs text-green-700 m-0">
                  Điền đầy đủ thông tin về tin tức
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
              { min: 10, message: 'Tiêu đề phải có ít nhất 10 ký tự!' },
              { max: 200, message: 'Tiêu đề không được quá 200 ký tự!' },
            ]}
          >
            <Input
              placeholder="Nhập tiêu đề tin tức..."
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
              { min: 50, message: 'Nội dung phải có ít nhất 50 ký tự!' },
              { max: 10000, message: 'Nội dung không được quá 10000 ký tự!' },
            ]}
          >
            <TextArea
              placeholder="Viết nội dung chi tiết..."
              rows={8}
              showCount
              maxLength={10000}
            />
          </Form.Item>
        </div>
      </Form>
    </Drawer>
  );
};

export default CreateNewsDrawer;