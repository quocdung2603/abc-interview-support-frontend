import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface PageHeaderProps {
  onCreate: () => void;
}

const MockExamPageHeader: React.FC<PageHeaderProps> = ({ onCreate }) => {
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
            📃 Quản lý bài phỏng vấn ảo
          </div>
          <div className="text-body text-neutral-600">
            Tạo, chỉnh sửa, các bài phỏng vấn ảo.
          </div>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={onCreate}
          style={{
            background:
              'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
            border: 'none',
            minWidth: '140px',
          }}
        >
          Tạo bài kiểm tra mới
        </Button>
      </div>
    </div>
  );
};

export default MockExamPageHeader;
