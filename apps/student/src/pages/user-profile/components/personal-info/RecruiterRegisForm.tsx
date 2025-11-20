import React, { useState } from 'react';
import { Form, Input, Modal, Steps, Button, Checkbox, message, Progress, Upload } from 'antd';
import { UserOutlined, MailOutlined, GlobalOutlined, IdcardOutlined, FormOutlined, InboxOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

const { Step } = Steps;
const { Dragger } = Upload;
const { TextArea } = Input;

interface CompanyInfo {
  companyName: string;
  taxId: string;
  address: string;
  website: string;
  contactEmail: string;
}

interface DocumentStatus {
  id: string;
  name: string;
  status: 'not_submitted' | 'pending' | 'approved' | 'rejected';
  feedback?: string;
  uploadedFile?: File;
}

interface RecruiterRegisFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: CompanyInfo) => void;
}

const RecruiterRegisForm: React.FC<RecruiterRegisFormProps> = ({
  visible,
  onCancel,
  onSubmit,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [companyForm] = Form.useForm<CompanyInfo>();
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    companyName: '',
    taxId: '',
    address: '',
    website: '',
    contactEmail: '',
  });

  const [legalDocs, setLegalDocs] = useState<DocumentStatus[]>([
    {
      id: 'business_cert',
      name: 'Giấy chứng nhận đăng ký doanh nghiệp',
      status: 'not_submitted',
    },
    {
      id: 'business_license',
      name: 'Giấy phép kinh doanh',
      status: 'not_submitted',
    },
    { id: 'tax_cert', name: 'Hồ sơ thuế', status: 'not_submitted' },
  ]);

  const [hrDocs, setHrDocs] = useState<DocumentStatus[]>([
    {
      id: 'labor_contract',
      name: 'Hợp đồng lao động mẫu',
      status: 'not_submitted',
    },
    { id: 'employee_card', name: 'Thẻ nhân viên', status: 'not_submitted' },
  ]);

  const getStatusIcon = (status: DocumentStatus['status']) => {
    switch (status) {
      case 'approved':
        return (
          <CheckCircleOutlined style={{ color: 'var(--color-success)' }} />
        );
      case 'pending':
        return (
          <ClockCircleOutlined style={{ color: 'var(--color-warning)' }} />
        );
      case 'rejected':
        return (
          <ExclamationCircleOutlined style={{ color: 'var(--color-danger)' }} />
        );
      default:
        return null;
    }
  };

  const getStatusText = (status: DocumentStatus['status']) => {
    switch (status) {
      case 'approved':
        return 'Đã duyệt';
      case 'pending':
        return 'Đang duyệt';
      case 'rejected':
        return 'Yêu cầu bổ sung';
      default:
        return 'Chưa nộp';
    }
  };

  const getStatusColor = (status: DocumentStatus['status']) => {
    switch (status) {
      case 'approved':
        return 'var(--color-success)';
      case 'pending':
        return 'var(--color-warning)';
      case 'rejected':
        return 'var(--color-danger)';
      default:
        return 'var(--color-neutral-400)';
    }
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.pdf',
    beforeUpload: (file) => {
      const isPDF = file.type === 'application/pdf';
      if (!isPDF) {
        message.error('Chỉ chấp nhận file PDF!');
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('File phải nhỏ hơn 5MB!');
      }
      return isPDF && isLt5M;
    },
    onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} tải lên thành công.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} tải lên thất bại.`);
      }
    },
  };

  const handleSubmit = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      return;
    }

    try {
      const values = await companyForm.validateFields();
      onSubmit(values);
      // Reset form
      companyForm.resetFields();
      setCurrentStep(0);
      setCompanyInfo({
        companyName: '',
        taxId: '',
        address: '',
        website: '',
        contactEmail: '',
      });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    companyForm.resetFields();
    setCurrentStep(0);
    setCompanyInfo({
      companyName: '',
      taxId: '',
      address: '',
      website: '',
      contactEmail: '',
    });
    onCancel();
  };

  const renderCompanyInfoStep = () => (
    <div style={{ padding: 'var(--spacing-lg) 0' }}>
      <div
        className="text-heading-3"
        style={{
          marginBottom: 'var(--spacing-lg)',
          color: 'var(--color-primary)',
        }}
      >
        Thông tin doanh nghiệp
      </div>

      <Form
        form={companyForm}
        layout="vertical"
        initialValues={companyInfo}
        onValuesChange={(_, values) => setCompanyInfo(values)}
        size="large"
      >
        <div className="content-grid">
          <Form.Item
            name="companyName"
            label="Tên công ty"
            rules={[{ required: true, message: 'Vui lòng nhập tên công ty' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: 'var(--color-neutral-400)' }} />}
              placeholder="Nhập tên công ty đầy đủ"
              className="input-field"
            />
          </Form.Item>

          <Form.Item
            name="taxId"
            label="Mã số thuế"
            rules={[{ required: true, message: 'Vui lòng nhập mã số thuế' }]}
          >
            <Input
              prefix={<IdcardOutlined style={{ color: 'var(--color-neutral-400)' }} />}
              placeholder="Nhập mã số thuế"
              className="input-field"
            />
          </Form.Item>
        </div>

        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
        >
          <TextArea
            rows={3}
            placeholder="Nhập địa chỉ đầy đủ"
            className="input-field"
          />
        </Form.Item>

        <div className="content-grid">
          <Form.Item
            name="website"
            label="Website"
            rules={[{ type: 'url', message: 'Vui lòng nhập URL hợp lệ' }]}
          >
            <Input
              prefix={<GlobalOutlined style={{ color: 'var(--color-neutral-400)' }} />}
              placeholder="https://company.com"
              className="input-field"
            />
          </Form.Item>

          <Form.Item
            name="contactEmail"
            label="Email liên hệ"
            rules={[
              { required: true, message: 'Vui lòng nhập email liên hệ' },
              { type: 'email', message: 'Vui lòng nhập email hợp lệ' },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: 'var(--color-neutral-400)' }} />}
              placeholder="contact@company.com"
              className="input-field"
            />
          </Form.Item>
        </div>
      </Form>
    </div>
  );

  const renderDocumentSection = (
    title: string,
    docs: DocumentStatus[],
    setDocs: React.Dispatch<React.SetStateAction<DocumentStatus[]>>
  ) => (
    <div style={{ padding: 'var(--spacing-lg) 0' }}>
      <div
        className="text-heading-3"
        style={{
          marginBottom: 'var(--spacing-lg)',
          color: 'var(--color-primary)',
        }}
      >
        {title}
      </div>

      <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
        {docs.map((doc) => (
          <div
            key={doc.id}
            style={{
              border: '1px solid var(--color-neutral-200)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-neutral-50)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: 'var(--spacing-md)',
                borderBottom: doc.feedback ? '1px solid var(--color-neutral-200)' : 'none',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--spacing-sm)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                  }}
                >
                  {getStatusIcon(doc.status)}
                  <span className="text-body" style={{ fontWeight: 500 }}>
                    {doc.name}
                  </span>
                </div>
                <div
                  className="badge-neutral"
                  style={{
                    background: getStatusColor(doc.status),
                    color: 'white',
                  }}
                >
                  {getStatusText(doc.status)}
                </div>
              </div>

              {doc.feedback && (
                <div
                  style={{
                    background: 'var(--color-accent-10)',
                    padding: 'var(--spacing-sm)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--spacing-sm)',
                  }}
                >
                  <span
                    className="text-caption"
                    style={{ color: 'var(--color-danger)' }}
                  >
                    {doc.feedback}
                  </span>
                </div>
              )}
            </div>

            <div style={{ padding: '0 var(--spacing-md) var(--spacing-md)' }}>
              <Dragger
                {...uploadProps}
                style={{
                  border: '2px dashed var(--color-neutral-300)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-neutral-50)',
                  minHeight: '120px',
                }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Kéo thả file PDF vào đây hoặc click để chọn
                </p>
                <p className="ant-upload-hint">
                  Chỉ chấp nhận file PDF, dung lượng tối đa 5MB
                </p>
              </Dragger>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderConfirmationStep = () => {
    const totalDocs = legalDocs.length + hrDocs.length;
    const submittedDocs = [...legalDocs, ...hrDocs].filter(
      (doc) => doc.status !== 'not_submitted'
    ).length;
    const completionRate = Math.round((submittedDocs / totalDocs) * 100);

    return (
      <div style={{ padding: 'var(--spacing-lg) 0' }}>
        <div
          className="text-heading-3"
          style={{
            marginBottom: 'var(--spacing-lg)',
            color: 'var(--color-primary)',
          }}
        >
          Xác nhận & Gửi đăng ký
        </div>

        <div
          className="stats-card"
          style={{ marginBottom: 'var(--spacing-lg)' }}
        >
          <div
            className="text-body"
            style={{ marginBottom: 'var(--spacing-md)' }}
          >
            <strong>Tiến độ hoàn thành hồ sơ</strong>
          </div>
          <Progress
            percent={completionRate}
            status={completionRate === 100 ? 'success' : 'active'}
            strokeColor={{
              '0%': 'var(--color-accent)',
              '100%': 'var(--color-primary)',
            }}
          />
          <div
            className="text-caption"
            style={{
              marginTop: 'var(--spacing-sm)',
              color: 'var(--color-neutral-500)',
            }}
          >
            {submittedDocs}/{totalDocs} tài liệu đã tải lên
          </div>
        </div>

        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <Checkbox style={{ marginBottom: 'var(--spacing-sm)' }}>
            Tôi xác nhận rằng tất cả thông tin và tài liệu đã cung cấp là chính
            xác và hợp lệ.
          </Checkbox>
          <Checkbox style={{ marginBottom: 'var(--spacing-sm)' }}>
            Tôi đồng ý với{' '}
            <span style={{ color: 'var(--color-accent)', cursor: 'pointer', textDecoration: 'underline' }}>
              Điều khoản sử dụng
            </span>{' '}
            và{' '}
            <span style={{ color: 'var(--color-accent)', cursor: 'pointer', textDecoration: 'underline' }}>
              Chính sách bảo mật
            </span>.
          </Checkbox>
          <Checkbox>
            Tôi cho phép hệ thống liên hệ qua email để cập nhật tiến độ đăng ký.
          </Checkbox>
        </div>
      </div>
    );
  };

  const steps = [
    {
      title: 'Thông tin DN',
      content: renderCompanyInfoStep(),
    },
    {
      title: 'Tài liệu pháp lý',
      content: renderDocumentSection(
        'Tài liệu pháp lý',
        legalDocs,
        setLegalDocs
      ),
    },
    {
      title: 'Tài liệu nhân sự',
      content: renderDocumentSection(
        'Tài liệu nhân sự',
        hrDocs,
        setHrDocs
      ),
    },
    {
      title: 'Xác nhận',
      content: renderConfirmationStep(),
    },
  ];

  const getModalFooter = () => {
    if (currentStep === steps.length - 1) {
      return [
        <Button key="back" onClick={() => setCurrentStep(currentStep - 1)}>
          Quay lại
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          style={{ backgroundColor: 'var(--color-accent)' }}
        >
          Gửi đăng ký
        </Button>,
      ];
    }

    return [
      <Button key="cancel" onClick={handleCancel}>
        Hủy
      </Button>,
      currentStep > 0 && (
        <Button key="back" onClick={() => setCurrentStep(currentStep - 1)}>
          Quay lại
        </Button>
      ),
      <Button
        key="next"
        type="primary"
        onClick={handleSubmit}
        style={{ backgroundColor: 'var(--color-accent)' }}
      >
        Tiếp theo
      </Button>,
    ].filter(Boolean);
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <FormOutlined style={{ fontSize: '1.25rem', color: 'var(--color-accent)' }} />
          <span className="text-heading-2" style={{ color: 'var(--color-primary)' }}>
            Đăng ký nhà tuyển dụng
          </span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={getModalFooter()}
      width="95vw"
      height="95vh"
      centered
      styles={{
        body: {
          height: 'calc(95vh - 110px)', // Trừ đi header và footer
          overflow: 'auto',
          padding: 0,
        },
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%'
      }}>
        <div style={{ marginBottom: 'var(--spacing-lg)', padding: '0 var(--spacing-xl)' }}>
          <Steps current={currentStep} size="small">
            {steps.map((item, index) => (
              <Step
                key={item.title}
                title={item.title}
              />
            ))}
          </Steps>
        </div>

        <div style={{ flex: 1, padding: '0 var(--spacing-xl) var(--spacing-xl)', overflow: 'auto' }}>
          {steps[currentStep].content}
        </div>
      </div>
    </Modal>
  );
};

export default RecruiterRegisForm;