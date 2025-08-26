import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface ExamPageHeaderProps {
  onCreateExam: () => void;
}

const ExamPageHeader: React.FC<ExamPageHeaderProps> = ({ onCreateExam }) => {
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
            📃 Quản lý các kỳ tuyển dụng
          </div>
          <div className="text-body text-neutral-600">
            Tạo, chỉnh sửa và quản lý các kì thi sơ tuyển của công ty
          </div>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={onCreateExam}
          style={{
            background:
              'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
            border: 'none',
            minWidth: '140px',
          }}
        >
          Tạo kì thi mới
        </Button>
      </div>
    </div>
  );
};

export default ExamPageHeader;
