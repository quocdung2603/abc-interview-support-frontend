import {
  Form,
  Input,
  Button,
  Upload,
  Avatar,
  Divider,
  Select,
  message,
} from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { CompanyProfileData } from './types';

const { Option } = Select;
const { TextArea } = Input;

interface CompanyProfileTabProps {
  initialData: CompanyProfileData;
  onSave: (values: CompanyProfileData) => Promise<void>;
}

const CompanyProfileTab: React.FC<CompanyProfileTabProps> = ({
  initialData,
  onSave,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSave = async (values: CompanyProfileData) => {
    setLoading(true);
    try {
      await onSave(values);
      message.success('Thông tin công ty đã được cập nhật!');
    } catch (error) {
      console.error('Profile save error:', error);
      message.error('Có lỗi xảy ra khi lưu thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (info: any) => {
    if (info.file.status === 'done') {
      message.success('Logo đã được tải lên thành công!');
    } else if (info.file.status === 'error') {
      message.error('Tải lên logo thất bại.');
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
        <div className="company-header">
          <Avatar size={80} icon={<UserOutlined />} />
          <div style={{ marginLeft: '16px' }}>
            <h3>Logo công ty</h3>
            <Upload onChange={handleLogoUpload} showUploadList={false}>
              <Button icon={<UploadOutlined />}>Tải lên logo</Button>
            </Upload>
            <p
              style={{
                margin: '4px 0',
                fontSize: '12px',
                color: 'var(--color-text-secondary)',
              }}
            >
              Khuyến nghị: 300x300px, định dạng PNG/JPG
            </p>
          </div>
        </div>

        <Divider />

        <Form.Item
          label="Tên công ty"
          name="companyName"
          rules={[{ required: true, message: 'Vui lòng nhập tên công ty' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email liên hệ"
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Website" name="website">
          <Input placeholder="https://company.com" />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
        >
          <TextArea rows={2} />
        </Form.Item>

        <Form.Item label="Mô tả công ty" name="description">
          <TextArea rows={4} placeholder="Giới thiệu về công ty của bạn..." />
        </Form.Item>

        <Form.Item
          label="Lĩnh vực hoạt động"
          name="industry"
          rules={[{ required: true, message: 'Vui lòng chọn lĩnh vực' }]}
        >
          <Select>
            <Option value="technology">Công nghệ thông tin</Option>
            <Option value="finance">Tài chính - Ngân hàng</Option>
            <Option value="manufacturing">Sản xuất</Option>
            <Option value="retail">Bán lẻ</Option>
            <Option value="healthcare">Y tế</Option>
            <Option value="education">Giáo dục</Option>
            <Option value="other">Khác</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Quy mô công ty"
          name="companySize"
          rules={[{ required: true, message: 'Vui lòng chọn quy mô' }]}
        >
          <Select>
            <Option value="1-10">1-10 nhân viên</Option>
            <Option value="11-50">11-50 nhân viên</Option>
            <Option value="51-100">51-100 nhân viên</Option>
            <Option value="100-500">100-500 nhân viên</Option>
            <Option value="500+">Trên 500 nhân viên</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Lưu thay đổi
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CompanyProfileTab;
