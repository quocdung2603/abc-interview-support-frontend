import { Form, Button, Switch, Select, Divider, message } from 'antd';
import { useState } from 'react';
import { PreferenceSettings } from './types';

const { Option } = Select;

interface PreferencesTabProps {
  initialData: PreferenceSettings;
  onSave: (values: PreferenceSettings) => Promise<void>;
}

const PreferencesTab: React.FC<PreferencesTabProps> = ({
  initialData,
  onSave,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSave = async (values: PreferenceSettings) => {
    setLoading(true);
    try {
      await onSave(values);
      message.success('Tùy chọn đã được lưu!');
    } catch (error) {
      console.error('Preferences save error:', error);
      message.error('Có lỗi xảy ra khi lưu tùy chọn');
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
        <h3>Hiển thị</h3>
        <Form.Item label="Ngôn ngữ" name="language">
          <Select>
            <Option value="vi">Tiếng Việt</Option>
            <Option value="en">English</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Múi giờ" name="timezone">
          <Select>
            <Option value="Asia/Ho_Chi_Minh">Giờ Việt Nam (UTC+7)</Option>
            <Option value="UTC">UTC (UTC+0)</Option>
            <Option value="Asia/Tokyo">Giờ Tokyo (UTC+9)</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Định dạng ngày" name="dateFormat">
          <Select>
            <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
            <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
            <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
          </Select>
        </Form.Item>

        <Form.Item name="darkMode" valuePropName="checked">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 'bold' }}>Chế độ tối</div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Sử dụng giao diện tối (đang phát triển)
              </div>
            </div>
            <Switch />
          </div>
        </Form.Item>

        <Divider />

        <h3>Hành vi</h3>
        <Form.Item name="autoSave" valuePropName="checked">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 'bold' }}>Tự động lưu</div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Tự động lưu nháp khi tạo tin tuyển dụng hoặc kỳ thi
              </div>
            </div>
            <Switch />
          </div>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Lưu tùy chọn
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PreferencesTab;
