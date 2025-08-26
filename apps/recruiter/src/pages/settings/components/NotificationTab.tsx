import { Form, Button, Switch, Divider, message } from 'antd';
import { useState } from 'react';
import { NotificationSettings } from './types';

interface NotificationTabProps {
  initialData: NotificationSettings;
  onSave: (values: NotificationSettings) => Promise<void>;
}

const NotificationTab: React.FC<NotificationTabProps> = ({
  initialData,
  onSave,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSave = async (values: NotificationSettings) => {
    setLoading(true);
    try {
      await onSave(values);
      message.success('Cài đặt thông báo đã được lưu!');
    } catch (error) {
      console.error('Notification save error:', error);
      message.error('Có lỗi xảy ra khi lưu cài đặt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-content">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={initialData}
      >
        <h3>Thông báo qua Email</h3>
        <Form.Item name="emailNewApplication" valuePropName="checked">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 'bold' }}>Ứng viên mới</div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Nhận thông báo khi có ứng viên mới nộp hồ sơ
              </div>
            </div>
            <Switch />
          </div>
        </Form.Item>

        <Form.Item name="emailExamComplete" valuePropName="checked">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 'bold' }}>Hoàn thành bài thi</div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Nhận thông báo khi có thí sinh hoàn thành bài thi
              </div>
            </div>
            <Switch />
          </div>
        </Form.Item>

        <Form.Item name="emailSystemUpdate" valuePropName="checked">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 'bold' }}>Cập nhật hệ thống</div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Nhận thông báo về các cập nhật mới của hệ thống
              </div>
            </div>
            <Switch />
          </div>
        </Form.Item>

        <Divider />

        <h3>Thông báo đẩy</h3>
        <Form.Item name="pushNewApplication" valuePropName="checked">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 'bold' }}>Ứng viên mới</div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Hiển thị thông báo trên trình duyệt
              </div>
            </div>
            <Switch />
          </div>
        </Form.Item>

        <Form.Item name="pushExamComplete" valuePropName="checked">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 'bold' }}>Hoàn thành bài thi</div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Hiển thị thông báo trên trình duyệt
              </div>
            </div>
            <Switch />
          </div>
        </Form.Item>

        <Form.Item name="pushSystemUpdate" valuePropName="checked">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 'bold' }}>Cập nhật hệ thống</div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Hiển thị thông báo trên trình duyệt
              </div>
            </div>
            <Switch />
          </div>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Lưu cài đặt thông báo
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default NotificationTab;
