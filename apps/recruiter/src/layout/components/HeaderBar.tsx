import React from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  BellOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Button, Dropdown, Avatar, Badge } from 'antd';

const { Header } = Layout;

interface HeaderBarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ collapsed, onToggle }) => {
  // Dropdown menu cho user
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ cá nhân',
    },
    {
      key: 'notifications',
      icon: <BellOutlined />,
      label: 'Thông báo',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
    },
  ];

  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      // Xử lý logout
      const ssoOrigin =
        import.meta.env.VITE_SSO_ORIGIN || 'http://localhost:4200';
      window.location.href = ssoOrigin;
    }
  };

  return (
    <Header
      style={{
        padding: '0 24px',
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px 0 rgba(29, 35, 41, 0.05)',
      }}
    >
      {/* Toggle Button */}
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onToggle}
        style={{
          fontSize: '16px',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />

      {/* Right Side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Notifications */}
        <Badge count={3} size="small">
          <Button
            type="text"
            icon={<BellOutlined />}
            style={{
              fontSize: '16px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        </Badge>

        {/* User Dropdown */}
        <Dropdown
          menu={{
            items: userMenuItems,
            onClick: handleUserMenuClick,
          }}
          trigger={['click']}
        >
          <button
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: '8px',
              transition: 'all 0.2s',
              border: 'none',
              background: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f5f5f5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <Avatar
              size="small"
              style={{
                background: 'linear-gradient(135deg, #1890ff, #36cfc9)',
                marginRight: '8px',
              }}
            >
              HR
            </Avatar>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 'medium',
                  lineHeight: 1,
                }}
              >
                HR Manager
              </span>
              <span
                style={{
                  fontSize: '12px',
                  color: '#8c8c8c',
                  lineHeight: 1,
                }}
              >
                ABC Company
              </span>
            </div>
          </button>
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderBar;
