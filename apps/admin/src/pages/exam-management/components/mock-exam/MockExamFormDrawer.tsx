import React, { useMemo, useEffect } from 'react';
import {
  Drawer,
  Button,
  notification,
  Steps,
  Tabs,
  Form,
} from 'antd';
import { Exam, Field, Topic, Level, QuestionType, ExamQuestion } from '@abc-interview-support-frontend/types';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BasicInfoStep, ExamConfigStep, ConfirmationStep } from './mock-exam-form-drawer';
import { useAuth } from '@abc-interview-support-frontend/sso-utils';

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

const MockExamFormDrawer: React.FC<ExamFormDrawerProps> = ({
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
  const { user } = useAuth();
  const isEdit = useMemo(() => Boolean(initForm?.id), [initForm]);
  const [currentQuestions, setCurrentQuestions] = React.useState<ExamQuestion[]>(initForm?.questions || []);

  // Update currentQuestions when initForm changes
  React.useEffect(() => {
    setCurrentQuestions(initForm?.questions || []);
  }, [initForm?.questions]);

  const handleUpdateQuestions = (questions: ExamQuestion[]) => {
    setCurrentQuestions(questions);
    // Update form value
    setValue('questions', questions);
  };

  const defaultFormValue: CreateFormFields = useMemo(() => ({
    id: 0,
    userId: user ? Number.parseInt(user.userId) : 0,
    examType: 'VIRTUAL',
    title: '',
    position: '',
    fieldId: undefined,
    levelId: undefined,
    topicIds: [],
    questionTypeIds: [],
    questionCount: 1,
    duration: 1,
    status: 'DRAFT',
    language: 'vi',
    createdAt: '',
    createdBy: 0,
    candidates: 1,
    startTime: '',
    endTime: '',
    examPeriod: undefined,
    questionSource: 'upload',
  }), [user]);

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
        fields = ['title', 'position', 'fieldId', 'levelId', 'topicIds', 'questionTypeIds', 'duration'];
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
      // Convert form data to match Exam interface
      const submitData = {
        ...data,
        fieldId: data.fieldId || 0,
        levelId: data.levelId || 0,
        questionCount: data.questions?.length || 0, // Auto calculate from selected questions
      };

      if (isEdit && initForm) {
        onSave(submitData, 'update');
      } else {
        onSave(submitData, 'create');
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
        <BasicInfoStep control={control} errors={errors} questionTypes={questionTypes} topics={topics} fields={fields} levels={levels} />
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
          isEdit={isEdit}
          existingQuestions={currentQuestions}
          onUpdateQuestions={handleUpdateQuestions}
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

  const tabItems = [
    {
      key: 'basic-info',
      label: 'Thông tin cơ bản',
      children: (
        <BasicInfoStep control={control} errors={errors} questionTypes={questionTypes} topics={topics} fields={fields} levels={levels} />
      ),
    },
    {
      key: 'config',
      label: 'Cấu hình đề thi',
      children: (
        <ExamConfigStep
          control={control}
          errors={errors}
          fields={fields}
          topics={topics}
          levels={levels}
          questionTypes={questionTypes}
          setValue={setValue}
          isEdit={isEdit}
          existingQuestions={currentQuestions}
          onUpdateQuestions={handleUpdateQuestions}
        />
      ),
    },
    {
      key: 'confirmation',
      label: 'Xác nhận',
      children: (
        <ConfirmationStep watch={watch} />
      ),
    },
  ];

  return (
    <Drawer
      title={`${isEdit ? 'Cập nhật' : 'Tạo'} kỳ thi ảo mới`}
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
            {currentStep > 0 && !isEdit && (
              <Button style={{ marginRight: 8 }} onClick={onPrevStep}>
                Quay lại
              </Button>
            )}
          </div>
          <div>
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              Đóng
            </Button>
            {!isEdit && currentStep < steps.length - 1 ? (
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
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        {isEdit ? (
          <Tabs items={tabItems} />
        ) : (
          <>
            <div style={{ marginBottom: 24 }}>
              <Steps current={currentStep} size="small">
                {steps.map((step, index) => (
                  <Steps.Step key={step.title} title={step.title} />
                ))}
              </Steps>
            </div>
            <div style={{ marginTop: 24 }}>{steps[currentStep].content}</div>
          </>
        )}
      </Form>
    </Drawer>
  );
};

export default MockExamFormDrawer;
