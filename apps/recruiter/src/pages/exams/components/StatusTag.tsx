import React from 'react';
import { Tag } from 'antd';

interface StatusTagProps {
  status: string;
}

const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'draft':
        return { color: 'default', text: 'Bản nháp' };
      case 'published':
        return { color: 'blue', text: 'Đã công bố' };
      case 'closed':
        return { color: 'green', text: 'Đã kết thúc' };
      default:
        return { color: 'default', text: status };
    }
  };

  const config = getStatusConfig(status);
  return <Tag color={config.color}>{config.text}</Tag>;
};

export default StatusTag;
