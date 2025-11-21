import React from 'react';
import { Form, Input, Select } from 'antd';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { Exam } from '@abc-interview-support-frontend/types';

const { Option } = Select;

// Extended interface to include UI-specific fields
interface CreateFormFields extends Exam {
  totalQuestions: number;
  candidates: number;
  startTime: string;
  endTime: string;
  examPeriod?: [string, string];
  questionSource?: 'upload' | 'existing';
  questionBank?: any; // File upload for CSV
}

interface BasicInfoStepProps {
  control: Control<CreateFormFields>;
  errors: FieldErrors<CreateFormFields>;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ control, errors }) => {
  return (
    <div className="space-y-6">
      <div>
        <Form.Item
          label="Tên kỳ thi"
          name="title"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          className="mb-0"
        >
          <Controller
            name="title"
            control={control}
            rules={{ required: 'Vui lòng nhập tiêu đề' }}
            render={({ field }) => (
              <Input
                size="large"
                placeholder="Nhập tên kỳ thi..."
                {...field}
                className="rounded-lg"
              />
            )}
          />
        </Form.Item>
      </div>

      <div>
        <Form.Item
          label="Vị trí tuyển dụng"
          name="position"
          rules={[{ required: true, message: 'Vui lòng nhập vị trí' }]}
          className="mb-0"
        >
          <Controller
            name="position"
            control={control}
            rules={{ required: 'Vui lòng nhập vị trí' }}
            render={({ field }) => (
              <Input
                size="large"
                placeholder="Nhập vị trí tuyển dụng..."
                {...field}
                className="rounded-lg"
              />
            )}
          />
        </Form.Item>
      </div>

      <div>
        <Form.Item
          label="Chủ đề kiến thức"
          name="topics"
          rules={[
            { required: true, message: 'Vui lòng chọn ít nhất 1 chủ đề' },
          ]}
          className="mb-0"
        >
          <Controller
            name="topics"
            control={control}
            rules={{ required: 'Vui lòng chọn ít nhất 1 chủ đề' }}
            render={({ field }) => (
              <Select
                mode="multiple"
                size="large"
                placeholder="Chọn chủ đề"
                {...field}
                value={field.value?.map(String) || []}
                onChange={(values) => field.onChange(values?.map(Number) || [])}
                className="rounded-lg"
              >
                <Option value="1">JavaScript</Option>
                <Option value="2">React</Option>
                <Option value="3">Node.js</Option>
                <Option value="4">Database</Option>
                <Option value="5">Algorithms</Option>
              </Select>
            )}
          />
        </Form.Item>
      </div>

      <div>
        <Form.Item
          label="Thời gian thi (phút)"
          name="duration"
          rules={[{ required: true, message: 'Vui lòng nhập thời gian' }]}
          className="mb-0"
        >
          <Controller
            name="duration"
            control={control}
            rules={{ required: 'Vui lòng nhập thời gian' }}
            render={({ field }) => (
              <Input
                type="number"
                size="large"
                placeholder="90"
                {...field}
                className="rounded-lg"
              />
            )}
          />
        </Form.Item>
      </div>

      <div>
        <Form.Item
          label="Số lượng câu hỏi"
          name="totalQuestions"
          rules={[
            { required: true, message: 'Vui lòng nhập số lượng câu hỏi' },
            { type: 'number', min: 1, message: 'Số lượng phải lớn hơn 0' },
          ]}
          className="mb-0"
        >
          <Controller
            name="totalQuestions"
            control={control}
            rules={{
              required: 'Vui lòng nhập số lượng câu hỏi',
              min: { value: 1, message: 'Số lượng phải lớn hơn 0' }
            }}
            render={({ field }) => (
              <Input
                type="number"
                size="large"
                placeholder="10"
                {...field}
                className="rounded-lg"
              />
            )}
          />
        </Form.Item>
        {errors.totalQuestions && (
          <span className="text-red-500 text-sm mt-1 block">
            {typeof errors.totalQuestions.message === 'string'
              ? errors.totalQuestions.message
              : 'Lỗi không xác định'}
          </span>
        )}
      </div>
    </div>
  );
};

export default BasicInfoStep;