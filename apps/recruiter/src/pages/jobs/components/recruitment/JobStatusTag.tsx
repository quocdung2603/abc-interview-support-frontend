import React from 'react';
import { Tag, Tooltip } from 'antd';
import { RecruitmentNews } from '@abc-interview-support-frontend/types';

interface JobStatusTagProps {
  status: RecruitmentNews['status'];
  rejectionReason?: string;
}

const JobStatusTag: React.FC<JobStatusTagProps> = ({
  status,
  rejectionReason,
}) => {
  const getStatusColor = (status: RecruitmentNews['status']) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
        return 'error';
      case 'PUBLISHED':
        return 'processing';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: RecruitmentNews['status']) => {
    switch (status) {
      case 'APPROVED':
        return 'Đã duyệt';
      case 'PENDING':
        return 'Chờ duyệt';
      case 'REJECTED':
        return 'Trả lại';
      case 'PUBLISHED':
        return 'Đã xuất bản';
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
