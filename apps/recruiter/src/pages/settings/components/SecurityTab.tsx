import { Form, Input, Button, Switch, Divider, message } from 'antd';
import { useState } from 'react';
import { SecuritySettings, SessionInfo } from './types';
import SessionManager from './SessionManager';

interface SecurityTabProps {
  onPasswordChange: (values: SecuritySettings) => Promise<void>;
  onToggle2FA: (enabled: boolean) => Promise<void>;
  sessions: SessionInfo[];
  onLogoutSession: (sessionId: string) => Promise<void>;
  onLogoutAllSessions: () => Promise<void>;
}

const SecurityTab: React.FC<SecurityTabProps> = ({
  onPasswordChange,
  onToggle2FA,
  sessions,
  onLogoutSession,
  onLogoutAllSessions,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handlePasswordChange = async (values: SecuritySettings) => {
    setLoading(true);
    try {
      await onPasswordChange(values);
      message.success('Mật khẩu đã được cập nhật!');
      form.resetFields();
    } catch (error) {
      console.error('Password change error:', error);
      message.error('Có lỗi xảy ra khi đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  const handle2FAToggle = async (checked: boolean) => {
    try {
      await onToggle2FA(checked);
      setTwoFactorEnabled(checked);
      message.success(
        checked ? 'Đã bật xác thực hai yếu tố' : 'Đã tắt xác thực hai yếu tố'
      );
    } catch (error) {
      console.error('2FA toggle error:', error);
      message.error('Có lỗi xảy ra khi cập nhật 2FA');
    }
  };

  return (
    <div className="settings-content">
      <Form form={form} layout="vertical" onFinish={handlePasswordChange}>
        <h3>Đổi mật khẩu</h3>
        <Form.Item
          label="Mật khẩu hiện tại"
          name="currentPassword"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu hiện tại' },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu mới' },
            { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu mới"
          name="confirmPassword"
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('Mật khẩu xác nhận không khớp!')
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Cập nhật mật khẩu
          </Button>
        </Form.Item>
      </Form>

      <Divider />

      <h3>Xác thực hai yếu tố (2FA)</h3>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <div>
          <div style={{ fontWeight: 'bold' }}>Kích hoạt 2FA</div>
          <div
            style={{
              fontSize: '12px',
              color: 'var(--color-text-secondary)',
            }}
          >
            Tăng cường bảo mật tài khoản với xác thực hai yếu tố
          </div>
        </div>
        <Switch checked={twoFactorEnabled} onChange={handle2FAToggle} />
      </div>

      <Divider />

      <SessionManager
        sessions={sessions}
        onLogoutSession={onLogoutSession}
        onLogoutAllSessions={onLogoutAllSessions}
      />
    </div>
  );
};

export default SecurityTab;
