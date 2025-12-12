import React from 'react';
import { Drawer, Tabs, Avatar, Space, Typography, Divider } from 'antd';
import {
  UserOutlined,
  ShopOutlined,
  IdcardOutlined,
} from '@ant-design/icons';
import {
  User,
  RecruiterVerification,
  CompanyDocument,
} from '@abc-interview-support-frontend/types';
import type { TabsProps } from 'antd';
import RecruiterInfo from './RecruiterInfo';
import CompanyInfo from './CompanyInfo';

interface PreviewDrawerProps {
  visible: boolean;
  onClose: () => void;
  data: User | null;
  verificationData?: RecruiterVerification;
  documents?: CompanyDocument[];
}

const RecruiterPreviewDrawer: React.FC<PreviewDrawerProps> = ({
  visible,
  onClose,
  data,
  verificationData,
  documents,
}) => {
  const TabMenu: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <Space>
          <UserOutlined />
          Thông tin cá nhân
        </Space>
      ),
      children: data ? (
        <RecruiterInfo data={data} />
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          Không có dữ liệu người dùng
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <Space>
          <ShopOutlined />
          Thông tin doanh nghiệp
        </Space>
      ),
      children: (
        <CompanyInfo
          verificationData={verificationData}
          documents={documents}
        />
      ),
    },
  ];

  return (
    <Drawer
      title={
        <Space align="center">
          <IdcardOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
          <div>
            <Typography.Title level={5} style={{ margin: 0 }}>
              Chi tiết Recruiter
            </Typography.Title>
            {data && (
              <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                {data.fullName} - {data.email}
              </Typography.Text>
            )}
          </div>
        </Space>
      }
      width={900}
      open={visible}
      onClose={onClose}
      destroyOnClose
      bodyStyle={{ padding: 0 }}
    >
      {data ? (
        <div>
          {/* Header Section */}
          <div style={{
            padding: '24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <Space align="center" size="large">
              <Avatar
                size={80}
                icon={<UserOutlined />}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                  fontSize: '36px'
                }}
              />
              <div>
                <Typography.Title level={3} style={{ color: 'white', margin: 0, marginBottom: 8 }}>
                  {data.fullName}
                </Typography.Title>
                <Typography.Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
                  {data.email}
                </Typography.Text>
                <br />
                <Typography.Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                  Tham gia: {new Date(data.createdAt).toLocaleDateString('vi-VN')}
                </Typography.Text>
              </div>
            </Space>
          </div>

          <Divider style={{ margin: 0 }} />

          {/* Tabs Section */}
          <div style={{ padding: '0' }}>
            <Tabs
              defaultActiveKey="1"
              items={TabMenu}
              size="large"
              tabBarStyle={{
                padding: '0 24px',
                margin: 0,
                background: '#fafafa',
                borderBottom: '1px solid #f0f0f0'
              }}
              style={{ height: '100%' }}
            />
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
          <UserOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
          <br />
          <Typography.Text type="secondary">
            Không có dữ liệu để hiển thị
          </Typography.Text>
        </div>
      )}
    </Drawer>
  );
};

export default RecruiterPreviewDrawer;
