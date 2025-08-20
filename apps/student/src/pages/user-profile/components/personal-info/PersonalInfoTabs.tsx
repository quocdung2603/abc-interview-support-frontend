import React, { useState } from 'react';
import {
  User,
  EloHistory,
} from '../../../../../../../libs/types/src/lib/user-types';
import PersonalInfo from './PersonalInfo';
import EloRankInfo from './EloRankInfo';
import EloHistoryTable from './EloHistoryTable';
import TabNavigation from '../TabNavigation';

interface PersonalInfoTabsProps {
  user: User;
  eloHistory: EloHistory[];
  onUpdateUser: (user: User) => void;
}

const PersonalInfoTabs: React.FC<PersonalInfoTabsProps> = ({
  user,
  eloHistory,
  onUpdateUser,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<string>('info');

  const subTabs = [
    {
      id: 'info',
      label: 'Thông tin cá nhân',
      icon: '📝',
      description: 'Quản lý thông tin cá nhân',
      badge: undefined,
    },
    {
      id: 'elo',
      label: 'ELO & Xếp hạng',
      icon: '🏆',
      description: 'Thông tin ELO và lịch sử',
      badge: eloHistory.length || undefined,
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
          <div>
            <EloRankInfo user={user} />
            <EloHistoryTable eloHistory={eloHistory as any} />
          </div>
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
      <div style={{ minHeight: '400px' }}>{renderSubTabContent()}</div>
    </div>
  );
};

export default PersonalInfoTabs;
