import { Card, Tabs } from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  SecurityScanOutlined,
} from '@ant-design/icons';
import CompanyProfileTab from './CompanyProfileTab';
import NotificationTab from './NotificationTab';
import SecurityTab from './SecurityTab';
import PreferencesTab from './PreferencesTab';
import type {
  CompanyProfileData,
  NotificationSettings,
  SecuritySettings,
  PreferenceSettings,
  SessionInfo,
} from './types';

interface SettingsTabsProps {
  companyData: CompanyProfileData;
  notificationData: NotificationSettings;
  preferencesData: PreferenceSettings;
  sessions: SessionInfo[];
  onSaveCompanyProfile: (values: CompanyProfileData) => Promise<void>;
  onSaveNotifications: (values: NotificationSettings) => Promise<void>;
  onPasswordChange: (values: SecuritySettings) => Promise<void>;
  onToggle2FA: (enabled: boolean) => Promise<void>;
  onLogoutSession: (sessionId: string) => Promise<void>;
  onLogoutAllSessions: () => Promise<void>;
  onSavePreferences: (values: PreferenceSettings) => Promise<void>;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({
  companyData,
  notificationData,
  preferencesData,
  sessions,
  onSaveCompanyProfile,
  onSaveNotifications,
  onPasswordChange,
  onToggle2FA,
  onLogoutSession,
  onLogoutAllSessions,
  onSavePreferences,
}) => {
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
        <CompanyProfileTab
          initialData={companyData}
          onSave={onSaveCompanyProfile}
        />
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
        <NotificationTab
          initialData={notificationData}
          onSave={onSaveNotifications}
        />
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
        <SecurityTab
          onPasswordChange={onPasswordChange}
          onToggle2FA={onToggle2FA}
          sessions={sessions}
          onLogoutSession={onLogoutSession}
          onLogoutAllSessions={onLogoutAllSessions}
        />
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
        <PreferencesTab
          initialData={preferencesData}
          onSave={onSavePreferences}
        />
      ),
    },
  ];

  return (
    <Card>
      <Tabs defaultActiveKey="profile" tabPosition="left" items={tabItems} />
    </Card>
  );
};

export default SettingsTabs;
