import React from 'react';
import { Tag } from 'antd';

interface StatusTagProps {
  status: string;
  type: 'status-account' | 'elo-rank' | 'is-studying';
}

const StatusTag: React.FC<StatusTagProps> = ({ status, type }) => {
  const getStatusConfig = (status: string, type: string) => {
    if (type.includes('status-account')) {
      switch (status) {
        case 'Pending':
          return { color: 'default', text: 'Chưa xác thực' };
        case 'Verified':
          return { color: 'green', text: 'Đã xác thực' };
        case 'Locked':
          return { color: 'red', text: 'Đã bị khóa' };
        default:
          return { color: 'default', text: status };
      }
    } else if (type.includes('elo-rank')) {
      switch (status) {
        case 'Newbie':
          return { color: '#d9d9d9', text: 'Newbie' }; // xám nhạt (custom hex)
        case 'Learner':
          return { color: 'blue', text: 'Learner' }; // preset
        case 'Contributor':
          return { color: 'cyan', text: 'Contributor' }; // preset
        case 'Solver':
          return { color: 'green', text: 'Solver' }; // preset
        case 'Expert':
          return { color: 'gold', text: 'Expert' }; // preset
        case 'Senior Expert':
          return { color: 'orange', text: 'Senior Expert' }; // preset
        case 'Master':
          return { color: 'volcano', text: 'Master' }; // preset
        case 'Legend':
          return { color: 'purple', text: 'Legend' }; // preset
        default:
          return { color: '#d9d9d9', text: status };
      }
    } else {
      switch (status) {
        case 'true':
          return { color: 'blue', text: 'Đã học xong' };
        case 'false':
          return { color: 'green', text: 'Đang học' };
        default:
          return { color: 'default', text: status };
      }
    }
  };

  const config = getStatusConfig(status, type);
  return <Tag color={config.color}>{config.text}</Tag>;
};

export default StatusTag;
