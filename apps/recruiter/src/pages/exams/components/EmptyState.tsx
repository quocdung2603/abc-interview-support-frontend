import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface EmptyStateProps {
  onCreateExam: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onCreateExam }) => {
  return (
    <div className="empty-state">
      <div className="illustration">📝</div>
      <h3>Chưa có kỳ thi nào</h3>
      <p>Tạo kỳ thi đầu tiên để bắt đầu tuyển dụng nhân tài.</p>
      <Button type="primary" icon={<PlusOutlined />} onClick={onCreateExam}>
        Tạo kỳ thi mới
      </Button>
    </div>
  );
};

export default EmptyState;
