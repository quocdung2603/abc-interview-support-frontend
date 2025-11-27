import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface MockExamPageHeaderProps {
  onCreate?: () => void;
}

const MockExamPageHeader: React.FC<MockExamPageHeaderProps> = ({ onCreate }) => {
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
            Quản lý bài phỏng vấn ảo
          </div>
          <div className="text-body text-neutral-600">
            Xem các bài phỏng vấn ảo được tạo bởi doanh nghiệp.
          </div>
        </div>
        {onCreate && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onCreate}
            size="large"
          >
            Tạo kỳ thi mới
          </Button>
        )}
      </div>
    </div>
  );
};

export default MockExamPageHeader;
