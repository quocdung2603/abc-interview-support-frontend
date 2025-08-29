import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  FileTextOutlined,
  SettingOutlined,
  TeamOutlined,
  ReadOutlined,
  QuestionCircleOutlined,
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
      key: 'users-group',
      icon: <TeamOutlined />,
      label: 'Quản lý người dùng',
      children: [
        {
          key: RouterLink.User,
          icon: null,
          label: 'Người dùng',
          onClick: () => navigate(`/${RouterLink.User}`),
        },
        {
          key: RouterLink.Recruiter,
          icon: null,
          label: 'Nhà tuyển dụng',
          onClick: () => navigate(`/${RouterLink.Recruiter}`),
        },
        {
          key: RouterLink.AccountApproval,
          icon: null,
          label: 'Kiểm duyệt tài khoản',
          onClick: () => navigate(`/${RouterLink.AccountApproval}`),
        },
      ],
    },
    {
      key: 'news-group',
      icon: <ReadOutlined />,
      label: 'Quản lý tin tức',
      children: [
        {
          key: RouterLink.TrendNews,
          icon: null,
          label: 'Tin xu hướng',
          onClick: () => navigate(`/${RouterLink.TrendNews}`),
        },
        {
          key: RouterLink.RecruitmentNews,
          icon: null,
          label: 'Tin tuyển dụng',
          onClick: () => navigate(`/${RouterLink.RecruitmentNews}`),
        },
        {
          key: RouterLink.NewsApproval,
          icon: null,
          label: 'Kiểm duyệt tin tức',
          onClick: () => navigate(`/${RouterLink.NewsApproval}`),
        },
      ],
    },
    {
      key: 'questions-group',
      icon: <QuestionCircleOutlined />,
      label: 'Quản lý câu hỏi',
      children: [
        {
          key: RouterLink.QuestionBank,
          icon: null,
          label: 'Ngân hàng câu hỏi',
          onClick: () => navigate(`/${RouterLink.QuestionBank}`),
        },
        {
          key: RouterLink.QuestionApproval,
          icon: null,
          label: 'Kiểm duyệt câu hỏi',
          onClick: () => navigate(`/${RouterLink.QuestionApproval}`),
        },
      ],
    },
    {
      key: 'exams-group',
      icon: <FileTextOutlined />,
      label: 'Quản lý kì thi',
      children: [
        {
          key: RouterLink.MockExam,
          icon: null,
          label: 'Phỏng vấn ảo',
          onClick: () => navigate(`/${RouterLink.MockExam}`),
        },
        {
          key: RouterLink.BaseExam,
          icon: null,
          label: 'Tuyển chọn sơ loại',
          onClick: () => navigate(`/${RouterLink.BaseExam}`),
        },
        {
          key: RouterLink.ExamApproval,
          icon: null,
          label: 'Kiểm duyệt kì thi',
          onClick: () => navigate(`/${RouterLink.ExamApproval}`),
        },
      ],
    },
    {
      key: RouterLink.Setting,
      icon: <SettingOutlined />,
      label: 'Cài đặt',
      onClick: () => navigate(`/${RouterLink.Setting}`),
    },
  ];

  // Xác định selected keys và open keys dựa trên location
  const getMenuState = () => {
    const currentPath =
      location.pathname.replace('/', '') || RouterLink.Dashboard;
    let selectedKeys: string[] = [currentPath];
    let openKeys: string[] = [];

    // Map path to group
    const pathToGroup: Record<string, string> = {
      [RouterLink.User]: 'users-group',
      [RouterLink.Recruiter]: 'users-group',
      [RouterLink.AccountApproval]: 'users-group',
      [RouterLink.TrendNews]: 'news-group',
      [RouterLink.RecruitmentNews]: 'news-group',
      [RouterLink.NewsApproval]: 'news-group',
      [RouterLink.QuestionBank]: 'questions-group',
      [RouterLink.QuestionApproval]: 'questions-group',
      [RouterLink.MockExam]: 'exams-group',
      [RouterLink.BaseExam]: 'exams-group',
      [RouterLink.ExamApproval]: 'exams-group',
    };

    // Nếu path thuộc một group, mở group đó
    if (pathToGroup[currentPath]) {
      openKeys = [pathToGroup[currentPath]];
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
            A
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
              A
            </div>
            <div>
              <div
                style={{
                  fontWeight: 'bold',
                  fontSize: '16px',
                  lineHeight: 1,
                }}
              >
                Admin
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
