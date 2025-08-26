import React from 'react';
import { Modal, Steps, Button } from 'antd';
import ExamForm from './ExamForm';

interface ExamWizardProps {
  visible: boolean;
  onClose: () => void;
  onFinish: () => void;
  currentStep: number;
  onNextStep: () => void;
  onPrevStep: () => void;
}

const ExamWizard: React.FC<ExamWizardProps> = ({
  visible,
  onClose,
  onFinish,
  currentStep,
  onNextStep,
  onPrevStep,
}) => {
  const steps = [
    { title: 'Thông tin cơ bản' },
    { title: 'Cấu hình đề thi' },
    { title: 'Thời gian thi' },
    { title: 'Xác nhận' },
  ];

  return (
    <Modal
      title="Tạo kỳ thi mới"
      open={visible}
      onCancel={onClose}
      width={800}
      footer={null}
    >
      <Steps current={currentStep} items={steps} />
      <div
        className="steps-content"
        style={{ marginTop: '24px', marginBottom: '24px' }}
      >
        <ExamForm currentStep={currentStep} />
      </div>
      <div className="steps-action">
        {currentStep > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={onPrevStep}>
            Quay lại
          </Button>
        )}
        {currentStep < steps.length - 1 && (
          <Button type="primary" onClick={onNextStep}>
            Tiếp theo
          </Button>
        )}
        {currentStep === steps.length - 1 && (
          <Button type="primary" onClick={onFinish}>
            Tạo kỳ thi
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default ExamWizard;
