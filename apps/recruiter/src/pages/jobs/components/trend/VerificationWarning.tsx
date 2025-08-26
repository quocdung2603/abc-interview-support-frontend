import { Alert } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface VerificationWarningProps {
  isVerified: boolean;
}

const VerificationWarning: React.FC<VerificationWarningProps> = ({
  isVerified,
}) => {
  if (isVerified) {
    return null;
  }

  return (
    <Alert
      message="Tài khoản chưa xác thực"
      description={
        <div>
          Tài khoản của bạn chưa được xác thực. Vui lòng hoàn tất quá trình xác
          thực để có thể tạo và quản lý tin tức.
          <br />
          <a
            href="/recruiter/verification"
            style={{ color: 'var(--color-primary)' }}
          >
            Xác thực ngay →
          </a>
        </div>
      }
      type="warning"
      icon={<ExclamationCircleOutlined />}
      showIcon
      style={{
        marginBottom: 'var(--spacing-lg)',
        borderRadius: 'var(--border-radius-lg)',
      }}
      closable
    />
  );
};

export default VerificationWarning;
