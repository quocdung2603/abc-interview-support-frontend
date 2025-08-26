import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface JobsPageHeaderProps {
  onCreateJob: () => void;
}

const JobsPageHeader: React.FC<JobsPageHeaderProps> = ({ onCreateJob }) => {
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
            style={{ marginBottom: 'var(--spacing-sm)' }}
          >
            💼 Quản lý tin tuyển dụng
          </div>
          <div className="text-body text-neutral-600">
            Tạo, chỉnh sửa và quản lý các bài đăng tuyển dụng của công ty
          </div>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={onCreateJob}
          style={{
            background:
              'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
            border: 'none',
            minWidth: '140px',
          }}
        >
          Tạo bài đăng
        </Button>
      </div>
    </div>
  );
};

export default JobsPageHeader;
