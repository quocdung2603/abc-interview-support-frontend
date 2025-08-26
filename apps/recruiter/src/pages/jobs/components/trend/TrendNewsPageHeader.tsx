import { Button } from 'antd';
import { PlusOutlined, BookOutlined } from '@ant-design/icons';

interface TrendNewsPageHeaderProps {
  onCreateNews: () => void;
}

const TrendNewsPageHeader: React.FC<TrendNewsPageHeaderProps> = ({
  onCreateNews,
}) => {
  return (
    <div style={{ marginBottom: 'var(--spacing-xl)' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-md)',
        }}
      >
        <div>
          <div
            className="text-heading-2 text-gradient-primary"
            style={{
              marginBottom: 'var(--spacing-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
            }}
          >
            <BookOutlined />
            Quản lý tin xu hướng
          </div>
          <div className="text-body text-neutral-600">
            Tạo, chỉnh sửa và quản lý các bài viết xu hướng ngành
          </div>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={onCreateNews}
          style={{
            background:
              'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
            border: 'none',
            minWidth: '140px',
          }}
        >
          Tạo tin tức
        </Button>
      </div>
    </div>
  );
};

export default TrendNewsPageHeader;
