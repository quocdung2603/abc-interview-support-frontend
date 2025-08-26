import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface ResultPageHeaderProps {
  onExportData: () => void;
}

const ExamPageHeader: React.FC<ResultPageHeaderProps> = ({ onExportData }) => {
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
            📃 Kết quả & Bảng xếp hạng
          </div>
          <div className="text-body text-neutral-600">
            Theo dõi kết quả thi và xếp hạng thí sinh
          </div>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={onExportData}
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
