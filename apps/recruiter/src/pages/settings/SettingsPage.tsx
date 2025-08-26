import { useState } from 'react';
import { message } from 'antd';
import {
  NotVerifiedState,
  SettingsPageHeader,
  SettingsTabs,
} from './components';
import type {
  CompanyProfileData,
  NotificationSettings,
  SecuritySettings,
  PreferenceSettings,
  SessionInfo,
} from './components/types';

const SettingsPage: React.FC = () => {
  // Mock verification state
  const isVerified = true;

  // Mock data
  const [companyData] = useState<CompanyProfileData>({
    companyName: 'ABC Technology Solutions',
    email: 'hr@abctech.com',
    phone: '024-1234-5678',
    website: 'https://abctech.com',
    address: 'Số 123, Đường ABC, Quận XYZ, Hà Nội',
    description:
      'Công ty phát triển phần mềm hàng đầu Việt Nam, chuyên về các giải pháp công nghệ cho doanh nghiệp.',
    industry: 'technology',
    companySize: '100-500',
  });

  const [notificationData] = useState<NotificationSettings>({
    emailNewApplication: true,
    emailExamComplete: true,
    emailSystemUpdate: false,
    pushNewApplication: true,
    pushExamComplete: false,
    pushSystemUpdate: true,
  });

  const [preferencesData] = useState<PreferenceSettings>({
    language: 'vi',
    timezone: 'Asia/Ho_Chi_Minh',
    dateFormat: 'DD/MM/YYYY',
    autoSave: true,
    darkMode: false,
  });

  const [sessions] = useState<SessionInfo[]>([
    {
      id: '1',
      device: 'Desktop',
      browser: 'Chrome',
      os: 'Windows',
      ip: '192.168.1.1',
      isCurrent: true,
      lastActivity: '2024-01-20 14:30:00',
    },
    {
      id: '2',
      device: 'Desktop',
      browser: 'Firefox',
      os: 'MacOS',
      ip: '192.168.1.2',
      isCurrent: false,
      lastActivity: '2024-01-19 09:15:00',
    },
  ]);

  // Handler functions
  const handleSaveCompanyProfile = async (values: CompanyProfileData) => {
    console.log('Company profile saved:', values);
    // API call here
  };

  const handleSaveNotifications = async (values: NotificationSettings) => {
    console.log('Notifications saved:', values);
    // API call here
  };

  const handlePasswordChange = async (values: SecuritySettings) => {
    console.log('Password changed:', values);
    // API call here
  };

  const handleToggle2FA = async (enabled: boolean) => {
    console.log('2FA toggled:', enabled);
    // API call here
  };

  const handleLogoutSession = async (sessionId: string) => {
    console.log('Session logged out:', sessionId);
    message.success('Đã đăng xuất phiên');
    // API call here
  };

  const handleLogoutAllSessions = async () => {
    console.log('All sessions logged out');
    message.success('Đã đăng xuất tất cả phiên');
    // API call here
  };

  const handleSavePreferences = async (values: PreferenceSettings) => {
    console.log('Preferences saved:', values);
    // API call here
  };

  // Show not verified state
  if (!isVerified) {
    return <NotVerifiedState />;
  }

  return (
    <div className="container-center animate-fade-in-up">
      <SettingsPageHeader />

      <div className="page-content">
        <SettingsTabs
          companyData={companyData}
          notificationData={notificationData}
          preferencesData={preferencesData}
          sessions={sessions}
          onSaveCompanyProfile={handleSaveCompanyProfile}
          onSaveNotifications={handleSaveNotifications}
          onPasswordChange={handlePasswordChange}
          onToggle2FA={handleToggle2FA}
          onLogoutSession={handleLogoutSession}
          onLogoutAllSessions={handleLogoutAllSessions}
          onSavePreferences={handleSavePreferences}
        />
      </div>
    </div>
  );
};

export default SettingsPage;
