import { Tag } from 'antd';
import { TrendNews } from './types';

interface TrendNewsStatusTagProps {
  status: TrendNews['status'];
}

const TrendNewsStatusTag: React.FC<TrendNewsStatusTagProps> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'published':
        return { color: 'green', text: 'Đã xuất bản' };
      case 'draft':
        return { color: 'orange', text: 'Bản nháp' };
      case 'archived':
        return { color: 'red', text: 'Đã lưu trữ' };
      case 'pending':
        return { color: 'blue', text: 'Chờ duyệt' };
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
