import React from 'react';
import { Tag, Tooltip } from 'antd';
import { JobPost } from './types';

interface JobStatusTagProps {
  status: JobPost['status'];
  rejectionReason?: string;
}

const JobStatusTag: React.FC<JobStatusTagProps> = ({
  status,
  rejectionReason,
}) => {
  const getStatusColor = (status: JobPost['status']) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: JobPost['status']) => {
    switch (status) {
      case 'approved':
        return 'Đã duyệt';
      case 'pending':
        return 'Chờ duyệt';
      case 'rejected':
        return 'Trả lại';
      default:
        return 'Bản nháp';
    }
  };

  return (
    <div>
      <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      {rejectionReason && (
        <Tooltip title={rejectionReason}>
          <span style={{ color: 'var(--color-danger)', cursor: 'help' }}>
            ⓘ
          </span>
        </Tooltip>
      )}
    </div>
  );
};

export default JobStatusTag;
