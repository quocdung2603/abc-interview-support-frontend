import { Tag } from 'antd';
import { News } from '@abc-interview-support-frontend/types';

interface TrendNewsStatusTagProps {
  status: News['status'];
}

const TrendNewsStatusTag: React.FC<TrendNewsStatusTagProps> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return { color: 'green', text: 'Đã xuất bản' };
      case 'APPROVED':
        return { color: 'blue', text: 'Đã duyệt' };
      case 'PENDING':
        return { color: 'orange', text: 'Chờ duyệt' };
      case 'REJECTED':
        return { color: 'red', text: 'Từ chối' };
      default:
        return { color: 'default', text: status };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Tag
      color={config.color}
      style={{ borderRadius: '12px', fontSize: '12px' }}
    >
      {config.text}
    </Tag>
  );
};

export default TrendNewsStatusTag;
