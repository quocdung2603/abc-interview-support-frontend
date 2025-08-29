import React from 'react';
import { Tag } from 'antd';

interface StatusTagProps {
  status: string;
}

const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  const getStatusConfig = (status: string) => {
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
  };

  const config = getStatusConfig(status);
  return <Tag color={config.color}>{config.text}</Tag>;
};

export default StatusTag;
