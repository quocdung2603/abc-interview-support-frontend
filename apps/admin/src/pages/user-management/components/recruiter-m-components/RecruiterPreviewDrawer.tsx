import React from 'react';
import { Drawer, Tabs } from 'antd';
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
      label: 'Thông tin cá nhân',
      children: data ? (
        <RecruiterInfo data={data} />
      ) : (
        <div>Không có dữ liệu</div>
      ),
    },
    {
      key: '2',
      label: 'Thông tin doanh nghiệp',
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
      title="Xem trước bài đăng"
      width={900}
      open={visible}
      onClose={onClose}
    >
      {data && <Tabs defaultActiveKey="1" items={TabMenu} />}
    </Drawer>
  );
};

export default RecruiterPreviewDrawer;
