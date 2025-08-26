import React, { useState } from 'react';
import {
  Steps,
  Card,
  Form,
  Input,
  Upload,
  Button,
  Checkbox,
  message,
  Tooltip,
  Progress,
} from 'antd';
import {
  InboxOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
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
  uploadedFile?: any;
}

const VerificationPage: React.FC = () => {
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
      status: 'approved',
    },
    { id: 'tax_cert', name: 'Hồ sơ thuế', status: 'pending' },
    {
      id: 'digital_signature',
      name: 'Chữ ký số',
      status: 'rejected',
      feedback: 'Chữ ký số đã hết hạn, vui lòng cập nhật phiên bản mới',
    },
  ]);

  const [hrDocs, setHrDocs] = useState<DocumentStatus[]>([
    {
      id: 'labor_contract',
      name: 'Hợp đồng lao động mẫu',
      status: 'not_submitted',
    },
    { id: 'employee_card', name: 'Thẻ nhân viên', status: 'not_submitted' },
    {
      id: 'employee_confirmation',
      name: 'Giấy xác nhận nhân viên',
      status: 'approved',
    },
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
        return (
          <InfoCircleOutlined style={{ color: 'var(--color-neutral-400)' }} />
        );
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

  const renderCompanyInfoStep = () => (
    <div className="card-elevated" style={{ padding: 'var(--spacing-xl)' }}>
      <div
        className="text-heading-3"
        style={{
          marginBottom: 'var(--spacing-lg)',
          color: 'var(--color-primary)',
        }}
      >
        📋 Thông tin doanh nghiệp
      </div>

      <Form
        form={companyForm}
        layout="vertical"
        initialValues={companyInfo}
        onValuesChange={(_, values) => setCompanyInfo(values)}
      >
        <div className="content-grid">
          <Form.Item
            name="companyName"
            label="Tên công ty"
            rules={[{ required: true, message: 'Vui lòng nhập tên công ty' }]}
          >
            <Input
              placeholder="Nhập tên công ty đầy đủ"
              className="input-field"
            />
          </Form.Item>

          <Form.Item
            name="taxId"
            label="Mã số thuế"
            rules={[{ required: true, message: 'Vui lòng nhập mã số thuế' }]}
          >
            <Input placeholder="Nhập mã số thuế" className="input-field" />
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
            <Input placeholder="https://company.com" className="input-field" />
          </Form.Item>

          <Form.Item
            name="contactEmail"
            label="Email liên hệ"
            rules={[
              { required: true, message: 'Vui lòng nhập email liên hệ' },
              { type: 'email', message: 'Vui lòng nhập email hợp lệ' },
            ]}
          >
            <Input placeholder="contact@company.com" className="input-field" />
          </Form.Item>
        </div>
      </Form>
    </div>
  );

  const renderDocumentSection = (
    title: string,
    icon: string,
    docs: DocumentStatus[],
    setDocs: React.Dispatch<React.SetStateAction<DocumentStatus[]>>
  ) => (
    <div className="card-elevated" style={{ padding: 'var(--spacing-xl)' }}>
      <div
        className="text-heading-3"
        style={{
          marginBottom: 'var(--spacing-lg)',
          color: 'var(--color-primary)',
        }}
      >
        {icon} {title}
      </div>

      <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="card-interactive"
            style={{ padding: 'var(--spacing-md)' }}
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
                  💬 {doc.feedback}
                </span>
              </div>
            )}

            {doc.status !== 'approved' && (
              <Dragger
                {...uploadProps}
                style={{ marginTop: 'var(--spacing-sm)' }}
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
            )}
          </div>
        ))}
      </div>

      <div
        className="stats-card"
        style={{
          marginTop: 'var(--spacing-lg)',
          background: 'var(--color-accent-10)',
        }}
      >
        <div className="text-body-small">
          📖 <strong>Hướng dẫn:</strong> Tải xuống mẫu tài liệu tại{' '}
          <a href="#" style={{ color: 'var(--color-accent)' }}>
            đây
          </a>
          . Đảm bảo file ở định dạng PDF và dung lượng dưới 5MB.
        </div>
      </div>
    </div>
  );

  const renderConfirmationStep = () => {
    const totalDocs = legalDocs.length + hrDocs.length;
    const approvedDocs = [...legalDocs, ...hrDocs].filter(
      (doc) => doc.status === 'approved'
    ).length;
    const completionRate = Math.round((approvedDocs / totalDocs) * 100);

    return (
      <div className="card-elevated" style={{ padding: 'var(--spacing-xl)' }}>
        <div
          className="text-heading-3"
          style={{
            marginBottom: 'var(--spacing-lg)',
            color: 'var(--color-primary)',
          }}
        >
          ✅ Xác nhận & Gửi duyệt
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
            {approvedDocs}/{totalDocs} tài liệu đã được duyệt
          </div>
        </div>

        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <Checkbox style={{ marginBottom: 'var(--spacing-sm)' }}>
            Tôi xác nhận rằng tất cả thông tin và tài liệu đã cung cấp là chính
            xác và hợp lệ.
          </Checkbox>
          <Checkbox style={{ marginBottom: 'var(--spacing-sm)' }}>
            Tôi đồng ý với{' '}
            <a href="#" style={{ color: 'var(--color-accent)' }}>
              Điều khoản sử dụng
            </a>{' '}
            và{' '}
            <a href="#" style={{ color: 'var(--color-accent)' }}>
              Chính sách bảo mật
            </a>
            .
          </Checkbox>
          <Checkbox>
            Tôi cho phép hệ thống liên hệ qua email để cập nhật tiến độ xác
            thực.
          </Checkbox>
        </div>

        <div className="content-grid">
          <div>
            <Button
              size="large"
              style={{ width: '100%' }}
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              ← Quay lại
            </Button>
          </div>
          <div>
            <Tooltip
              title={
                completionRate < 100
                  ? 'Cần hoàn thành đủ tài liệu trước khi gửi duyệt'
                  : ''
              }
            >
              <Button
                type="primary"
                size="large"
                disabled={completionRate < 100}
                style={{
                  width: '100%',
                  background:
                    completionRate === 100 ? 'var(--color-success)' : undefined,
                }}
                onClick={() => {
                  message.success('Hồ sơ đã được gửi duyệt thành công!');
                }}
              >
                🚀 Gửi duyệt
              </Button>
            </Tooltip>
          </div>
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
        '📄',
        legalDocs,
        setLegalDocs
      ),
    },
    {
      title: 'Tài liệu nhân sự',
      content: renderDocumentSection(
        'Tài liệu nhân sự',
        '👥',
        hrDocs,
        setHrDocs
      ),
    },
    {
      title: 'Xác nhận & Gửi duyệt',
      content: renderConfirmationStep(),
    },
  ];

  return (
    <div className="container-center animate-fade-in-up">
      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div
          className="text-heading-2 text-gradient-primary"
          style={{ marginBottom: 'var(--spacing-sm)' }}
        >
          🏢 Xác thực doanh nghiệp
        </div>
        <div className="text-body text-neutral-600">
          Hoàn tất quy trình xác thực để sử dụng đầy đủ tính năng của hệ thống
        </div>
      </div>

      <div
        className="card-elevated"
        style={{
          padding: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-lg)',
        }}
      >
        <Steps current={currentStep} size="small">
          {steps.map((item, index) => (
            <Step
              key={index}
              title={item.title}
              style={{
                cursor: 'pointer',
              }}
              onClick={() => setCurrentStep(index)}
            />
          ))}
        </Steps>
      </div>

      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        {steps[currentStep].content}
      </div>

      {currentStep < steps.length - 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 'var(--spacing-md)',
          }}
        >
          {currentStep > 0 && (
            <Button
              size="large"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              ← Quay lại
            </Button>
          )}
          <Button
            type="primary"
            size="large"
            onClick={() => setCurrentStep(currentStep + 1)}
            style={{ minWidth: '120px' }}
          >
            Tiếp theo →
          </Button>
        </div>
      )}
    </div>
  );
};

export default VerificationPage;
