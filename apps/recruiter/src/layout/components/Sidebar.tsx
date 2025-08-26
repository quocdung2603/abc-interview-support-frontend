import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  SafetyCertificateOutlined,
  ShopOutlined,
  FileTextOutlined,
  TrophyOutlined,
  SettingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import { RouterLink } from '../../utils/RouterLink';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Tạo menu items với sub-menu
  const menuItems: MenuItem[] = [
    {
      key: RouterLink.Dashboard,
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate(`/${RouterLink.Dashboard}`),
    },
    {
      key: RouterLink.Verification,
      icon: <SafetyCertificateOutlined />,
      label: 'Xác thực DN',
      onClick: () => navigate(`/${RouterLink.Verification}`),
    },
    {
      key: 'jobs-group',
      icon: <ShopOutlined />,
      label: 'Quản lý tin tức',
      children: [
        {
          key: RouterLink.Jobs,
          icon: <FileTextOutlined />,
          label: 'Tin tuyển dụng',
          onClick: () => navigate(`/${RouterLink.Jobs}`),
        },
        {
          key: RouterLink.JobsNew,
          icon: <PlusOutlined />,
          label: 'Tin xu hướng',
          onClick: () => navigate(`/${RouterLink.TrendNews}`),
        },
      ],
    },
    {
      key: 'exams-group',
      icon: <FileTextOutlined />,
      label: 'Quản lý kì thi',
      children: [
        {
          key: RouterLink.Exams,
          icon: <FileTextOutlined />,
          label: 'Kỳ thi',
          onClick: () => navigate(`/${RouterLink.Exams}`),
        },
        {
          key: RouterLink.Results,
          icon: <TrophyOutlined />,
          label: 'Kết quả & BXH',
          onClick: () => navigate(`/${RouterLink.Results}`),
        },
      ],
    },
    {
      key: RouterLink.Settings,
      icon: <SettingOutlined />,
      label: 'Cài đặt',
      onClick: () => navigate(`/${RouterLink.Settings}`),
    },
  ];

  // Xác định selected keys và open keys dựa trên location
  const getMenuState = () => {
    const currentPath = location.pathname.replace('/', '');
    let selectedKeys: string[] = [currentPath || RouterLink.Dashboard];
    let openKeys: string[] = [];

    // Xử lý sub-menu selection
    if (currentPath.startsWith('jobs')) {
      openKeys = ['jobs-group'];
      if (currentPath === 'jobs/new') {
        selectedKeys = [RouterLink.JobsNew];
      } else if (currentPath.includes('jobs/') && currentPath !== 'jobs') {
        selectedKeys = [RouterLink.JobsEdit];
      } else {
        selectedKeys = [RouterLink.Jobs];
      }
    } else if (currentPath.startsWith('exams')) {
      openKeys = ['exams-group'];
      if (currentPath === 'exams/new') {
        selectedKeys = [RouterLink.ExamsNew];
      } else if (currentPath.includes('exams/') && currentPath !== 'exams') {
        selectedKeys = [RouterLink.ExamsEdit];
      } else {
        selectedKeys = [RouterLink.Exams];
      }
    }

    return { selectedKeys, openKeys };
  };

  const { selectedKeys, openKeys: defaultOpenKeys } = getMenuState();
  const [openKeys, setOpenKeys] = React.useState<string[]>(defaultOpenKeys);

  const onOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={256}
      style={{
        background: '#fff',
        boxShadow: '2px 0 8px 0 rgba(29, 35, 41, 0.05)',
        borderRight: '1px solid #f0f0f0',
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: '64px',
          padding: '16px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
      >
        {collapsed ? (
          <div
            style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #1890ff, #36cfc9)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '16px',
            }}
          >
            R
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #1890ff, #36cfc9)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '16px',
                marginRight: '12px',
              }}
            >
              R
            </div>
            <div>
              <div
                style={{
                  fontWeight: 'bold',
                  fontSize: '16px',
                  lineHeight: 1,
                }}
              >
                Recruiter
              </div>
              <div
                style={{ fontSize: '12px', color: '#8c8c8c', lineHeight: 1 }}
              >
                Portal
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Menu */}
      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        items={menuItems}
        style={{
          border: 'none',
          height: 'calc(100vh - 64px)',
          overflow: 'auto',
        }}
      />
    </Sider>
  );
};

export default Sidebar;
