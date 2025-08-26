import React from 'react';
import { Card, List, Tag, Button, Space, Tooltip } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { JobPost } from './types';

interface RecentJobsProps {
  jobs: JobPost[];
  onViewJob: (jobId: string) => void;
  onEditJob: (jobId: string) => void;
}

const RecentJobs: React.FC<RecentJobsProps> = ({
  jobs,
  onViewJob,
  onEditJob,
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
    <Card
      title="Tin tuyển dụng gần đây"
      className="card-elevated"
      extra={
        <Button type="link" onClick={() => console.log('View all jobs')}>
          Xem tất cả
        </Button>
      }
    >
      <List
        dataSource={jobs.slice(0, 5)}
        renderItem={(job) => (
          <List.Item
            key={job.id}
            actions={[
              <Tooltip title="Xem chi tiết" key="view">
                <Button
                  type="text"
                  icon={<EyeOutlined />}
                  onClick={() => onViewJob(job.id)}
                />
              </Tooltip>,
              <Tooltip title="Chỉnh sửa" key="edit">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => onEditJob(job.id)}
                />
              </Tooltip>,
            ]}
          >
            <List.Item.Meta
              title={
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    {job.title}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center',
                    }}
                  >
                    <Tag color={getStatusColor(job.status)}>
                      {getStatusText(job.status)}
                    </Tag>
                    <span
                      style={{
                        fontSize: '12px',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      {job.candidateCount} ứng viên
                    </span>
                  </div>
                </div>
              }
              description={
                <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                  <Space>
                    <EnvironmentOutlined
                      style={{ color: 'var(--color-text-secondary)' }}
                    />
                    <span style={{ fontSize: '12px' }}>{job.location}</span>
                  </Space>
                  <Space>
                    <CalendarOutlined
                      style={{ color: 'var(--color-text-secondary)' }}
                    />
                    <span style={{ fontSize: '12px' }}>
                      Hạn: {new Date(job.deadline).toLocaleDateString('vi-VN')}
                    </span>
                  </Space>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default RecentJobs;
