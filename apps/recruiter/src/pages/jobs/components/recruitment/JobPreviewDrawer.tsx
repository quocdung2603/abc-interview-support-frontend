import React from 'react';
import { Drawer, Tag } from 'antd';
import JobStatusTag from './JobStatusTag';
import { RecruitmentNews } from '@abc-interview-support-frontend/types';

interface JobPreviewDrawerProps {
  visible: boolean;
  onClose: () => void;
  job: RecruitmentNews | null;
}

const JobPreviewDrawer: React.FC<JobPreviewDrawerProps> = ({
  visible,
  onClose,
  job,
}) => {
  const formatSalary = (salary: string) => {
    return salary || 'Thỏa thuận';
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
              <strong>Công ty:</strong> {job.companyName}
            </div>
            <div>
              <strong>Vị trí:</strong> {job.position}
            </div>
            <div>
              <strong>Địa điểm:</strong> {job.location}
            </div>
            <div>
              <strong>Mức lương:</strong> {formatSalary(job.salary || '')}
            </div>
            <div>
              <strong>Kinh nghiệm:</strong> {job.experience || 'Không yêu cầu'}
            </div>
            <div>
              <strong>Giờ làm việc:</strong> {job.workingHours || 'Chưa cập nhật'}
            </div>
            <div>
              <strong>Hạn nộp:</strong>{' '}
              {job.deadline ? new Date(job.deadline).toLocaleDateString('vi-VN') : 'Không giới hạn'}
            </div>
            <div>
              <strong>Ngày hết hạn:</strong>{' '}
              {job.expiredAt ? new Date(job.expiredAt).toLocaleDateString('vi-VN') : 'Không giới hạn'}
            </div>
            <div>
              <strong>Phương thức ứng tuyển:</strong> {job.applicationMethod || 'Chưa cập nhật'}
            </div>
            <div>
              <strong>Lĩnh vực:</strong> {job.fieldId ? `ID: ${job.fieldId}` : 'Chưa chọn'}
            </div>
            {job.examId && (
              <div>
                <strong>ID bài thi:</strong> {job.examId}
              </div>
            )}
            <div>
              <strong>Ngày xuất bản:</strong>{' '}
              {job.publishedAt ? new Date(job.publishedAt).toLocaleDateString('vi-VN') : 'Chưa xuất bản'}
            </div>
            <div>
              <strong>Lượt vote hữu ích:</strong> {job.usefulVote || 0}
            </div>
            <div>
              <strong>Lượt vote quan tâm:</strong> {job.interestVote || 0}
            </div>
            <div>
              <strong>Trạng thái:</strong>{' '}
              <JobStatusTag
                status={job.status}
                rejectionReason={job.rejectReason}
              />
            </div>
            {job.rejectReason && (
              <div>
                <strong>Lý do trả lại:</strong>
                <div
                  className="stats-card"
                  style={{
                    marginTop: '8px',
                    background: 'var(--color-accent-10)',
                  }}
                >
                  {job.rejectReason}
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
              {job.content ? (
                <div dangerouslySetInnerHTML={{ __html: job.content }} />
              ) : (
                <p>
                  Đây là nội dung mô tả công việc chi tiết sẽ được hiển thị khi
                  tích hợp với editor...
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default JobPreviewDrawer;
