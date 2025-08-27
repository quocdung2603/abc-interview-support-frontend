import React, { useMemo, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  Card,
  Button,
  Statistic,
  Drawer,
  notification,
  Steps,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Examss } from './types';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import dayjs from 'dayjs';

interface CreateFormFields extends Examss {}

interface ExamFormDrawerProps {
  currentStep: number;
  onClose: () => void;
  visible: boolean;
  initForm?: CreateFormFields;
  onSave: (data: CreateFormFields, mode: 'create' | 'update') => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onFinish: () => void;
}

const ExamFormDrawer: React.FC<ExamFormDrawerProps> = ({
  currentStep,
  onClose,
  visible,
  initForm,
  onSave,
  onNextStep,
  onPrevStep,
  onFinish,
}) => {
  const isEdit = useMemo(() => Boolean(initForm?.id), [initForm]);

  const defaultFormValue: CreateFormFields = {
    id: '',
    title: '',
    position: '',
    status: 'published',
    totalQuestions: 1,
    duration: 1,
    candidates: 1,
    description: '',
    topics: [],
    createdAt: '',
    startTime: '',
    endTime: '',
    examPeriod: undefined,
    difficulty: {
      easy: true,
      medium: true,
      hard: false,
    },
  };

  const {
    control,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm<CreateFormFields>({
    defaultValues: defaultFormValue,
  });

  const watchedValues = watch();

  // Reset form khi initForm thay đổi (cho edit mode)
  useEffect(() => {
    if (!visible) return;
    if (initForm) {
      reset(initForm);
    } else {
      reset(defaultFormValue);
    }
  }, [visible, initForm, reset]);

  const validateCurrentStep = async (step: number): Promise<boolean> => {
    let fields: (keyof CreateFormFields)[] = [];
    switch (step) {
      case 0:
        fields = ['title', 'position', 'topics', 'duration'];
        break;
      case 1:
        fields = ['totalQuestions'];
        break;
      case 2:
        fields = ['examPeriod'];
        break;
      case 3:
        return true;
    }
    const isValid = await trigger(fields);
    return isValid;
  };

  const onSubmit: SubmitHandler<CreateFormFields> = async (data) => {
    try {
      if (isEdit) {
        onSave({ ...initForm!, ...data }, 'update');
      } else {
        onSave(data, 'create');
      }
      // Đóng form và reset step sau khi lưu thành công
      onFinish();
    } catch (e) {
      notification.error({
        message: 'Có lỗi xảy ra, vui lòng kiểm tra lại!' + e,
      });
    }
  };

  const steps = [
    {
      title: 'Thông tin cơ bản',
      content: (
        <div className="step-content">
          <p className="text-[16px] text-[grey]">Tên kì thi</p>
          <Controller
            name="title"
            control={control}
            rules={{ required: 'Vui lòng nhập tiêu đề' }}
            render={({ field }) => (
              <Input type="text" placeholder="Nhập tiêu đề..." {...field} />
            )}
          />
          {errors.title && (
            <span className="text-red-500">{errors.title.message}</span>
          )}

          <Form.Item
            label="Vị trí tuyển dụng"
            name="position"
            rules={[{ required: true, message: 'Vui lòng chọn vị trí' }]}
          >
            <Controller
              name="position"
              control={control}
              rules={{ required: 'Vui lòng chọn vị trí' }}
              render={({ field }) => (
                <Select placeholder="Chọn vị trí" {...field}>
                  <Option value="frontend">Frontend Developer</Option>
                  <Option value="backend">Backend Developer</Option>
                  <Option value="fullstack">Fullstack Developer</Option>
                  <Option value="mobile">Mobile Developer</Option>
                  <Option value="devops">DevOps Engineer</Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <textarea
                  rows={3}
                  placeholder="Mô tả về kỳ thi này..."
                  {...field}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Chủ đề kiến thức"
            name="topics"
            rules={[
              { required: true, message: 'Vui lòng chọn ít nhất 1 chủ đề' },
            ]}
          >
            <Controller
              name="topics"
              control={control}
              rules={{ required: 'Vui lòng chọn ít nhất 1 chủ đề' }}
              render={({ field }) => (
                <Select mode="multiple" placeholder="Chọn chủ đề" {...field}>
                  <Option value="javascript">JavaScript</Option>
                  <Option value="react">React</Option>
                  <Option value="nodejs">Node.js</Option>
                  <Option value="database">Database</Option>
                  <Option value="algorithms">Algorithms</Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item
            label="Thời gian thi (phút)"
            name="duration"
            rules={[{ required: true, message: 'Vui lòng nhập thời gian' }]}
          >
            <Controller
              name="duration"
              control={control}
              rules={{ required: 'Vui lòng nhập thời gian' }}
              render={({ field }) => (
                <Input type="number" placeholder="90" {...field} />
              )}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: 'Cấu hình đề thi',
      content: (
        <div className="step-content">
          <div className="question-bank-section">
            <h3>Ngân hàng câu hỏi</h3>
            <Upload>
              <Button icon={<UploadOutlined />}>
                Tải lên file câu hỏi (Excel/CSV)
              </Button>
            </Upload>
            <p className="upload-note">
              Hỗ trợ file Excel (.xlsx) hoặc CSV.{' '}
              <a href="#template" style={{ color: 'var(--color-primary)' }}>
                Tải template
              </a>
            </p>
          </div>

          <div className="exam-config-section">
            <div className="config-cards">
              <Card title="Cấu hình đề thi">
                <div>
                  <Form.Item label="Số câu hỏi" name="totalQuestions">
                    <Controller
                      name="totalQuestions"
                      control={control}
                      rules={{ required: 'Vui lòng nhập số câu hỏi' }}
                      render={({ field }) => (
                        <Input type="number" defaultValue="25" {...field} />
                      )}
                    />
                  </Form.Item>

                  <Form.Item label="Độ khó" name="difficulty">
                    <Controller
                      name="difficulty"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <label htmlFor="easy-checkbox">
                            <input
                              id="easy-checkbox"
                              type="checkbox"
                              style={{ marginRight: '8px' }}
                              checked={field.value?.easy ?? true}
                              onChange={(e) =>
                                field.onChange({
                                  ...field.value,
                                  easy: e.target.checked,
                                })
                              }
                            />
                            Dễ (40%)
                          </label>
                          <br />
                          <label htmlFor="medium-checkbox">
                            <input
                              id="medium-checkbox"
                              type="checkbox"
                              style={{ marginRight: '8px' }}
                              checked={field.value?.medium ?? true}
                              onChange={(e) =>
                                field.onChange({
                                  ...field.value,
                                  medium: e.target.checked,
                                })
                              }
                            />
                            Trung bình (50%)
                          </label>
                          <br />
                          <label htmlFor="hard-checkbox">
                            <input
                              id="hard-checkbox"
                              type="checkbox"
                              style={{ marginRight: '8px' }}
                              checked={field.value?.hard ?? false}
                              onChange={(e) =>
                                field.onChange({
                                  ...field.value,
                                  hard: e.target.checked,
                                })
                              }
                            />
                            Khó (10%)
                          </label>
                        </div>
                      )}
                    />
                  </Form.Item>

                  <div>
                    <h4>Quy tắc chấm điểm:</h4>
                    <div>Đúng: +1 điểm</div>
                    <div>Sai: -0.25 điểm</div>
                    <div>Bỏ trống: 0 điểm</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Thời gian thi',
      content: (
        <div className="step-content">
          <Form.Item
            label="Cửa sổ thời gian thi"
            name="examPeriod"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
          >
            <Controller
              name="examPeriod"
              control={control}
              rules={{ required: 'Vui lòng chọn thời gian thi' }}
              render={({ field }) => (
                <RangePicker
                  showTime
                  format="DD/MM/YYYY HH:mm"
                  placeholder={['Bắt đầu', 'Kết thúc']}
                  style={{ width: '100%' }}
                  value={
                    field.value
                      ? [dayjs(field.value[0]), dayjs(field.value[1])]
                      : undefined
                  }
                  onChange={(dates) => {
                    if (dates?.[0] && dates?.[1]) {
                      field.onChange([
                        dates[0].format('YYYY-MM-DDTHH:mm:ss'),
                        dates[1].format('YYYY-MM-DDTHH:mm:ss'),
                      ]);
                    } else {
                      field.onChange(undefined);
                    }
                  }}
                />
              )}
            />
          </Form.Item>

          <div className="time-summary">
            <Statistic
              title="Số câu hỏi"
              value={watchedValues.totalQuestions || 0}
            />
            <Statistic
              title="Thời gian thi"
              value={`${watchedValues.duration || 0} phút`}
            />
            <Statistic
              title="Điểm tối đa"
              value={watchedValues.totalQuestions || 0}
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Xác nhận',
      content: (
        <div className="step-content">
          <div className="exam-preview">
            <h3>Thông tin kỳ thi</h3>
            <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
              <div>
                <strong>Tên:</strong> {watchedValues.title || 'Chưa nhập'}
              </div>
              <div>
                <strong>Vị trí:</strong> {watchedValues.position || 'Chưa chọn'}
              </div>
              <div>
                <strong>Chủ đề:</strong>{' '}
                {watchedValues.topics?.join(', ') || 'Chưa chọn'}
              </div>
              <div>
                <strong>Thời gian:</strong>{' '}
                {watchedValues.duration
                  ? `${watchedValues.duration} phút`
                  : 'Chưa nhập'}
              </div>
              <div>
                <strong>Số câu:</strong>{' '}
                {watchedValues.totalQuestions || 'Chưa nhập'}
              </div>
              <div>
                <strong>Độ khó:</strong>{' '}
                {watchedValues.difficulty
                  ? [
                      watchedValues.difficulty.easy && 'Dễ',
                      watchedValues.difficulty.medium && 'Trung bình',
                      watchedValues.difficulty.hard && 'Khó',
                    ]
                      .filter(Boolean)
                      .join(', ') || 'Chưa chọn'
                  : 'Chưa chọn'}
              </div>
              <div>
                <strong>Cửa sổ thi:</strong>{' '}
                {watchedValues.examPeriod
                  ? `Từ ${watchedValues.examPeriod[0]} đến ${watchedValues.examPeriod[1]}`
                  : 'Chưa chọn'}
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Drawer
      title={`${isEdit ? 'Cập nhật' : 'Tạo'} kỳ thi mới`}
      width={900}
      open={visible}
      onClose={onClose}
      destroyOnHidden={false}
      footer={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            {currentStep > 0 && (
              <Button style={{ marginRight: 8 }} onClick={onPrevStep}>
                Quay lại
              </Button>
            )}
          </div>
          <div>
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              Đóng
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button
                type="primary"
                onClick={() =>
                  validateCurrentStep(currentStep).then((isValid) =>
                    isValid ? onNextStep() : null
                  )
                }
              >
                Tiếp theo
              </Button>
            ) : (
              <Button type="primary" htmlType="submit" form="examForm">
                {isEdit ? 'Cập nhật' : 'Tạo kỳ thi'}
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div style={{ marginBottom: 24 }}>
        <Steps current={currentStep} size="small">
          {steps.map((step, index) => (
            <Steps.Step key={step.title} title={step.title} />
          ))}
        </Steps>
      </div>

      <form id="examForm" onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginTop: 24 }}>{steps[currentStep].content}</div>
      </form>
    </Drawer>
  );
};

export default ExamFormDrawer;
