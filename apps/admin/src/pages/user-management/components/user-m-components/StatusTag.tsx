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
      const normalizedStatus = status.toLowerCase().replace(/\s+/g, ''); // Normalize: lowercase + remove spaces
      switch (normalizedStatus) {
        case 'newbie':
          return { color: '#d9d9d9', text: 'Newbie' };
        case 'learner':
          return { color: 'blue', text: 'Learner' };
        case 'contributor':
          return { color: 'cyan', text: 'Contributor' };
        case 'solver':
          return { color: 'green', text: 'Solver' };
        case 'expert':
          return { color: 'gold', text: 'Expert' };
        case 'seniorexpert':
          return { color: 'orange', text: 'Senior Expert' };
        case 'master':
          return { color: 'volcano', text: 'Master' };
        case 'legend':
          return { color: 'purple', text: 'Legend' };
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
