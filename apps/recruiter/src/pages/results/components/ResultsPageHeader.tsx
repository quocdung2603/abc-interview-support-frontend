import React from 'react';
import { Button, Space, Tooltip } from 'antd';
import { FileExcelOutlined } from '@ant-design/icons';

interface ResultPageHeaderProps {
  onExportData: () => void;
  hasSearched?: boolean;
}

const ExamPageHeader: React.FC<ResultPageHeaderProps> = ({ onExportData, hasSearched = false }) => {
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
        <Space size="middle">
          <Tooltip title={!hasSearched ? "Vui lòng lọc kết quả bài kiểm tra trước" : ""}>
            <Button
              type="primary"
              size="large"
              icon={<FileExcelOutlined />}
              onClick={onExportData}
              disabled={!hasSearched}
              style={{
                background: hasSearched
                  ? 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)'
                  : undefined,
                border: 'none',
                minWidth: '140px',
              }}
            >
              Xuất file Excel
            </Button>
          </Tooltip>
        </Space>
      </div>
    </div>
  );
};

export default ExamPageHeader;
