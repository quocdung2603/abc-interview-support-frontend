import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout as AntLayout } from 'antd';

import Sidebar from './components/Sidebar';
import HeaderBar from './components/HeaderBar';

const { Content } = AntLayout;

const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} />

      {/* Main Layout */}
      <AntLayout>
        {/* Header */}
        <HeaderBar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />

        {/* Content */}
        <Content
          style={{
            margin: '24px',
            padding: '10px',
            minHeight: 280,
            background: '#f5f5f5',
            borderRadius: '8px',
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
