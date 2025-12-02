import React, { useState } from 'react';
import {
  User,
  EloHistory,
} from '@abc-interview-support-frontend/types';
import PersonalInfo from './PersonalInfo';
import EloRankInfo from './EloRankInfo';
import EloHistoryTable from './EloHistoryTable';
import TabNavigation from '../TabNavigation';
import RecruiterRegistration from './RecruiterRegistration';

interface PersonalInfoTabsProps {
  user: User;
  eloHistory: EloHistory[];
  onUpdateUser: (user: User) => void;
  showOnlyPersonalInfo?: boolean;
  showOnlyEloRank?: boolean;
  showOnlyRecruiterRegis?: boolean;
}

const PersonalInfoTabs: React.FC<PersonalInfoTabsProps> = ({
  user,
  eloHistory,
  onUpdateUser,
  showOnlyPersonalInfo = false,
  showOnlyEloRank = false,
  showOnlyRecruiterRegis = false,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<string>('info');

  // If showing only specific section, render directly without tabs
  if (showOnlyPersonalInfo) {
    return <PersonalInfo user={user as any} onUpdateUser={onUpdateUser as any} />;
  }

  if (showOnlyEloRank) {
    return (
      <div className="space-y-6">
        <EloRankInfo user={user} />
        <EloHistoryTable eloHistory={eloHistory as any} />
      </div>
    );
  }

  if (showOnlyRecruiterRegis) {
    return <RecruiterRegistration />;
  }

  // Default behavior with tabs
  const subTabs = [
    {
      id: 'info',
      label: 'Thông tin cá nhân',
      icon: '',
      description: 'Quản lý thông tin cá nhân',
      badge: undefined,
    },
    {
      id: 'elo',
      label: 'ELO & Xếp hạng',
      icon: '',
      description: 'Thông tin ELO và lịch sử cộng điểm',
      badge: eloHistory.length || undefined,
    },
    {
      id: 'recruiter',
      label: 'Đăng ký nhà tuyển dụng',
      icon: '',
      description: 'Đăng ký nếu bạn là nhà tuyển dụng từ doanh nghiệp',
    },
  ];

  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case 'info':
        return (
          <PersonalInfo user={user as any} onUpdateUser={onUpdateUser as any} />
        );
      case 'elo':
        return (
          <div className="space-y-6">
            <EloRankInfo user={user} />
            <EloHistoryTable eloHistory={eloHistory as any} />
          </div>
        );
      case 'recruiter':
        return (
          <RecruiterRegistration />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <TabNavigation
        tabs={subTabs}
        activeTab={activeSubTab}
        onTabChange={setActiveSubTab}
      />
      <div className="min-h-96">{renderSubTabContent()}</div>
    </div>
  );
};

export default PersonalInfoTabs;
