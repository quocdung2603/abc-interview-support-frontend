import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Switch,
  Select,
  Upload,
  Avatar,
  Tabs,
  Divider,
  message,
} from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  SecurityScanOutlined,
  UploadOutlined,
} from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const SettingsPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Mock verification state
  const isVerified = true;

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      console.log('Settings saved:', values);
      message.success('Cài đặt đã được lưu thành công!');
    } catch (error) {
      console.error('Settings save error:', error);
      message.error('Có lỗi xảy ra khi lưu cài đặt');
    } finally {
      setLoading(false);
    }
  };

  const tabItems = [
    {
      key: 'profile',
      label: (
        <span>
          <UserOutlined />
          Thông tin công ty
        </span>
      ),
      children: (
        <div className="settings-content">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            initialValues={{
              companyName: 'ABC Technology Solutions',
              email: 'hr@abctech.com',
              phone: '024-1234-5678',
              website: 'https://abctech.com',
              address: 'Số 123, Đường ABC, Quận XYZ, Hà Nội',
              description:
                'Công ty phát triển phần mềm hàng đầu Việt Nam, chuyên về các giải pháp công nghệ cho doanh nghiệp.',
              industry: 'technology',
              companySize: '100-500',
            }}
          >
            <div className="company-header">
              <Avatar size={80} icon={<UserOutlined />} />
              <div style={{ marginLeft: '16px' }}>
                <h3>Logo công ty</h3>
                <Upload>
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
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại' },
              ]}
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
              <TextArea
                rows={4}
                placeholder="Giới thiệu về công ty của bạn..."
              />
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
      ),
    },
    {
      key: 'notifications',
      label: (
        <span>
          <BellOutlined />
          Thông báo
        </span>
      ),
      children: (
        <div className="settings-content">
          <Form
            layout="vertical"
            initialValues={{
              emailNewApplication: true,
              emailExamComplete: true,
              emailSystemUpdate: false,
              pushNewApplication: true,
              pushExamComplete: false,
              pushSystemUpdate: true,
            }}
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
              <Button type="primary" loading={loading}>
                Lưu cài đặt thông báo
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      key: 'security',
      label: (
        <span>
          <SecurityScanOutlined />
          Bảo mật
        </span>
      ),
      children: (
        <div className="settings-content">
          <Form layout="vertical">
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
              <Button type="primary" loading={loading}>
                Cập nhật mật khẩu
              </Button>
            </Form.Item>

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
              <Switch />
            </div>

            <Divider />

            <h3>Phiên đăng nhập</h3>
            <div className="session-info">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold' }}>Phiên hiện tại</div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    Chrome trên Windows - 192.168.1.1
                  </div>
                </div>
                <Button size="small" danger>
                  Đăng xuất
                </Button>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold' }}>Phiên khác</div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    Firefox trên MacOS - 192.168.1.2
                  </div>
                </div>
                <Button size="small" danger>
                  Đăng xuất
                </Button>
              </div>
            </div>

            <Button danger>Đăng xuất tất cả phiên</Button>
          </Form>
        </div>
      ),
    },
    {
      key: 'preferences',
      label: (
        <span>
          <SettingOutlined />
          Tùy chọn
        </span>
      ),
      children: (
        <div className="settings-content">
          <Form
            layout="vertical"
            initialValues={{
              language: 'vi',
              timezone: 'Asia/Ho_Chi_Minh',
              dateFormat: 'DD/MM/YYYY',
              autoSave: true,
              darkMode: false,
            }}
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
              <Button type="primary" loading={loading}>
                Lưu tùy chọn
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
  ];

  // Show not verified state
  if (!isVerified) {
    return (
      <div className="page-container">
        <div className="not-verified-state">
          <div className="illustration">⚙️</div>
          <h2>Cần xác thực doanh nghiệp</h2>
          <p>
            Bạn cần hoàn tất xác thực doanh nghiệp để truy cập cài đặt hệ thống.
          </p>
          <Button type="primary" href="/verification">
            Xác thực ngay
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1>Cài đặt</h1>
            <p>Quản lý thông tin công ty và tùy chọn hệ thống</p>
          </div>
        </div>
      </div>

      <div className="page-content">
        <Card>
          <Tabs
            defaultActiveKey="profile"
            tabPosition="left"
            items={tabItems}
          />
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
