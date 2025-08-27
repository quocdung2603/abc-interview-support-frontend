import React from 'react';
import { Drawer } from 'antd';
import JobStatusTag from './JobStatusTag';
import { JobPost } from './types';

interface JobPreviewDrawerProps {
  visible: boolean;
  onClose: () => void;
  job: JobPost | null;
}

const JobPreviewDrawer: React.FC<JobPreviewDrawerProps> = ({
  visible,
  onClose,
  job,
}) => {
  const formatSalary = (min: number, max: number, currency: string) => {
    const formatNumber = (num: number) => {
      if (num >= 1000000) {
        return `${(num / 1000000).toFixed(0)}M`;
      }
      return num.toLocaleString();
    };

    return `${formatNumber(min)} - ${formatNumber(max)} ${currency}`;
  };

  return (
    <Drawer
      title="Xem trước bài đăng"
      width={900}
      open={visible}
      onClose={onClose}
    >
      {job && (
        <div>
          <div
            className="text-heading-3"
            style={{ marginBottom: 'var(--spacing-md)' }}
          >
            {job.title}
          </div>

          <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
            <div>
              <strong>Vị trí:</strong> {job.position}
            </div>
            <div>
              <strong>Địa điểm:</strong> {job.location}
            </div>
            <div>
              <strong>Mức lương:</strong>{' '}
              {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
            </div>
            <div>
              <strong>Hạn nộp:</strong>{' '}
              {new Date(job.deadline).toLocaleDateString('vi-VN')}
            </div>
            <div>
              <strong>Trạng thái:</strong>{' '}
              <JobStatusTag
                status={job.status}
                rejectionReason={job.rejectionReason}
              />
            </div>
            {job.rejectionReason && (
              <div>
                <strong>Lý do trả lại:</strong>
                <div
                  className="stats-card"
                  style={{
                    marginTop: '8px',
                    background: 'var(--color-accent-10)',
                  }}
                >
                  {job.rejectionReason}
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: 'var(--spacing-lg)' }}>
            <div
              className="text-body"
              style={{ fontWeight: 500, marginBottom: 'var(--spacing-sm)' }}
            >
              Mô tả công việc:
            </div>
            <div className="prose-custom">
              <p>
                Đây là nội dung mô tả công việc chi tiết sẽ được hiển thị khi
                tích hợp với editor...
              </p>
              <p>Bao gồm: mục tiêu, nhiệm vụ, yêu cầu ứng viên, quyền lợi...</p>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default JobPreviewDrawer;
