import React from 'react';
import { Form, Input, Select } from 'antd';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { Exam, QuestionType, Topic, Field, Level, ExamQuestion } from '@abc-interview-support-frontend/types';

const { Option } = Select;

// Extended interface to include UI-specific fields
interface CreateFormFields extends Omit<Exam, 'fieldId' | 'levelId'> {
  fieldId?: number;
  levelId?: number;
  candidates: number;
  startTime: string;
  endTime: string;
  examPeriod?: [string, string];
  questionSource?: 'upload' | 'existing';
  questionBank?: File | null; // File upload for CSV
  questions?: ExamQuestion[]; // Current questions in the exam
}

interface BasicInfoStepProps {
  control: Control<CreateFormFields>;
  errors: FieldErrors<CreateFormFields>;
  questionTypes: QuestionType[];
  topics: Topic[];
  fields: Field[];
  levels: Level[];
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ control, errors, questionTypes, topics, fields, levels }) => {
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
          label="Lĩnh vực"
          name="fieldId"
          rules={[{ required: true, message: 'Vui lòng chọn lĩnh vực' }]}
          className="mb-0"
        >
          <Controller
            name="fieldId"
            control={control}
            rules={{
              required: 'Vui lòng chọn lĩnh vực',
              validate: (value) => value !== undefined || 'Vui lòng chọn lĩnh vực'
            }}
            render={({ field }) => (
              <Select
                size="large"
                placeholder="Chọn lĩnh vực"
                {...field}
                className="rounded-lg"
                showSearch
                allowClear
                optionFilterProp="children"
              >
                {fields.map((fieldOption) => (
                  <Option key={fieldOption.id} value={fieldOption.id}>
                    {fieldOption.name}
                  </Option>
                ))}
              </Select>
            )}
          />
        </Form.Item>
      </div>

      <div>
        <Form.Item
          label="Trình độ"
          name="levelId"
          rules={[{ required: true, message: 'Vui lòng chọn trình độ' }]}
          className="mb-0"
        >
          <Controller
            name="levelId"
            control={control}
            rules={{
              required: 'Vui lòng chọn trình độ',
              validate: (value) => value !== undefined || 'Vui lòng chọn trình độ'
            }}
            render={({ field }) => (
              <Select
                size="large"
                placeholder="Chọn trình độ"
                {...field}
                className="rounded-lg"
                showSearch
                allowClear
                optionFilterProp="children"
              >
                {levels.map((levelOption) => (
                  <Option key={levelOption.id} value={levelOption.id}>
                    {levelOption.name}
                  </Option>
                ))}
              </Select>
            )}
          />
        </Form.Item>
      </div>

      <div>
        <Form.Item
          label="Chủ đề kiến thức"
          name="topicIds"
          rules={[
            { required: true, message: 'Vui lòng chọn ít nhất 1 chủ đề' },
          ]}
          className="mb-0"
        >
          <Controller
            name="topicIds"
            control={control}
            rules={{ required: 'Vui lòng chọn ít nhất 1 chủ đề' }}
            render={({ field }) => (
              <Select
                mode="multiple"
                size="large"
                placeholder="Chọn chủ đề"
                {...field}
                className="rounded-lg"
                showSearch
                allowClear
                optionFilterProp="children"
              >
                {topics.map((topicOption) => (
                  <Option key={topicOption.id} value={topicOption.id}>
                    {topicOption.name}
                  </Option>
                ))}
              </Select>
            )}
          />
        </Form.Item>
      </div>

      <div>
        <Form.Item
          label="Loại câu hỏi"
          name="questionTypeIds"
          rules={[
            { required: true, message: 'Vui lòng chọn ít nhất 1 loại câu hỏi' },
          ]}
          className="mb-0"
        >
          <Controller
            name="questionTypeIds"
            control={control}
            rules={{ required: 'Vui lòng chọn ít nhất 1 loại câu hỏi' }}
            render={({ field }) => (
              <Select
                mode="multiple"
                size="large"
                placeholder="Chọn loại câu hỏi"
                {...field}
                className="rounded-lg"
                showSearch
                allowClear
                optionFilterProp="children"
              >
                {questionTypes.map((typeOption) => (
                  <Option key={typeOption.id} value={typeOption.id}>
                    {typeOption.name}
                  </Option>
                ))}
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

    </div>
  );
};

export default BasicInfoStep;