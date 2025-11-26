import React, { useMemo, useEffect } from 'react';
import {
  Drawer,
  Button,
  notification,
  Steps,
  Form,
} from 'antd';
import { Exam, Field, Topic, Level, QuestionType } from '@abc-interview-support-frontend/types';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BasicInfoStep, ExamConfigStep, ConfirmationStep } from './exam-form-component';

// Extended interface to include UI-specific fields
interface CreateFormFields extends Exam {
  totalQuestions: number;
  candidates: number;
  startTime: string;
  endTime: string;
  examPeriod?: [string, string];
  questionSource?: 'upload' | 'existing';
  questionBank?: any; // File upload for CSV
  selectedQuestions: number[]; // Add selected questions
  // Override to use correct field names
  topics?: number[];
  questionTypes?: number[];
}

interface ExamFormDrawerProps {
  currentStep: number;
  onClose: () => void;
  visible: boolean;
  initForm?: CreateFormFields;
  onSave: (data: CreateFormFields, mode: 'create' | 'update') => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onFinish: () => void;
  fields: Field[];
  topics: Topic[];
  levels: Level[];
  questionTypes: QuestionType[];
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
  fields,
  topics,
  levels,
  questionTypes,
}) => {
  const isEdit = useMemo(() => Boolean(initForm?.id), [initForm]);

  const defaultFormValue: CreateFormFields = useMemo(() => ({
    id: 0,
    userId: 0,
    examType: 'RECRUITER',
    title: '',
    position: '',
    fieldId: 0,
    levelId: 0,
    topicIds: [],
    questionTypeIds: [],
    questionCount: 1,
    duration: 1,
    status: 'DRAFT',
    language: 'vi',
    createdAt: '',
    createdBy: 0,
    totalQuestions: 1,
    candidates: 1,
    startTime: '',
    endTime: '',
    examPeriod: undefined,
    questionSource: 'upload',
    selectedQuestions: [], // Initialize empty array
    // Legacy fields for backward compatibility
    topics: [],
    questionTypes: [],
  }), []);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<CreateFormFields>({
    defaultValues: defaultFormValue,
  });

  // Reset form khi initForm thay đổi (cho edit mode)
  useEffect(() => {
    if (!visible) return;
    if (initForm) {
      reset(initForm);
    } else {
      reset(defaultFormValue);
    }
  }, [visible, initForm, reset, defaultFormValue]);

  const validateCurrentStep = async (step: number): Promise<boolean> => {
    let fields: (keyof CreateFormFields)[] = [];
    switch (step) {
      case 0:
        fields = ['title', 'position', 'topicIds', 'questionTypeIds', 'duration', 'totalQuestions'];
        break;
      case 1:
        // Step 1 (Cấu hình đề thi) không yêu cầu validation bắt buộc
        return true;
      case 2:
        // Step 2 (Xác nhận) không yêu cầu validation bắt buộc
        return true;
    }
    const isValid = await trigger(fields);
    return isValid;
  };

  const onSubmit: SubmitHandler<CreateFormFields> = async (data) => {
    try {
      if (isEdit && initForm) {
        onSave(data, 'update');
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
        <BasicInfoStep control={control} errors={errors} questionTypes={questionTypes} topics={topics} />
      ),
    },
    {
      title: 'Cấu hình đề thi',
      content: (
        <ExamConfigStep
          control={control}
          errors={errors}
          fields={fields}
          topics={topics}
          levels={levels}
          questionTypes={questionTypes}
          setValue={setValue}
        />
      ),
    },
    {
      title: 'Xác nhận',
      content: (
        <ConfirmationStep watch={watch} />
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
      mask={false}
      zIndex={1002}
      push={false}
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
              <Button type="primary" onClick={handleSubmit(onSubmit)}>
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

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <div style={{ marginTop: 24 }}>{steps[currentStep].content}</div>
      </Form>
    </Drawer>
  );
};

export default ExamFormDrawer;
