import React, { useState } from 'react';
import { message } from 'antd';
import { useAuth } from '@abc-interview-support-frontend/sso-utils';

import {
  JobsPageHeader,
  VerificationWarning,
  JobsToolbar,
  JobsTable,
  JobPreviewDrawer,
} from './components/recruitment';
import { JobPost } from './components/recruitment/types';

const JobsPage: React.FC = () => {
  const { user } = useAuth();
  const isVerified = user?.status === 'Verified';

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);

  // Mock data
  const [jobPosts] = useState<JobPost[]>([
    {
      id: '1',
      title: 'Senior Frontend Developer - React/TypeScript',
      position: 'Senior Frontend Developer',
      location: 'Hồ Chí Minh',
      salaryMin: 25000000,
      salaryMax: 40000000,
      salaryCurrency: 'VND',
      deadline: '2024-12-31',
      status: 'approved',
      updatedAt: '2024-11-15',
      createdAt: '2024-11-01',
    },
    {
      id: '2',
      title: 'Backend Developer - Node.js/NestJS',
      position: 'Backend Developer',
      location: 'Hà Nội',
      salaryMin: 20000000,
      salaryMax: 35000000,
      salaryCurrency: 'VND',
      deadline: '2024-12-25',
      status: 'pending',
      updatedAt: '2024-11-14',
      createdAt: '2024-11-10',
    },
    {
      id: '3',
      title: 'Full-stack Developer - MERN Stack',
      position: 'Full-stack Developer',
      location: 'Remote',
      salaryMin: 18000000,
      salaryMax: 30000000,
      salaryCurrency: 'VND',
      deadline: '2024-12-20',
      status: 'draft',
      updatedAt: '2024-11-13',
      createdAt: '2024-11-12',
    },
    {
      id: '4',
      title: 'DevOps Engineer - AWS/Docker/K8s',
      position: 'DevOps Engineer',
      location: 'Đà Nẵng',
      salaryMin: 30000000,
      salaryMax: 45000000,
      salaryCurrency: 'VND',
      deadline: '2024-12-15',
      status: 'rejected',
      rejectionReason: 'Mô tả công việc chưa rõ ràng về yêu cầu kinh nghiệm',
      updatedAt: '2024-11-12',
      createdAt: '2024-11-05',
    },
  ]);

  const handlePreview = (job: JobPost) => {
    setSelectedJob(job);
    setPreviewVisible(true);
  };

  const handleSubmitForApproval = (jobId: string) => {
    if (!isVerified) {
      message.warning('Cần xác thực tài khoản trước khi gửi duyệt');
      return;
    }
    message.success('Đã gửi bài đăng để duyệt');
  };

  const handleBulkSubmit = () => {
    if (!isVerified) {
      message.warning('Cần xác thực tài khoản trước khi gửi duyệt');
      return;
    }
    message.success(`Đã gửi ${selectedRowKeys.length} bài đăng để duyệt`);
    setSelectedRowKeys([]);
  };

  const handleCreateJob = () => {
    message.info('Chuyển đến trang tạo bài đăng mới');
  };

  const filteredData = jobPosts.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchText.toLowerCase()) ||
      job.position.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesLocation =
      locationFilter === 'all' || job.location === locationFilter;

    return matchesSearch && matchesStatus && matchesLocation;
  });

  return (
    <div className="container-center animate-fade-in-up">
      <JobsPageHeader onCreateJob={handleCreateJob} />

      <VerificationWarning isVerified={isVerified} />

      <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
        <JobsToolbar
          searchText={searchText}
          onSearchChange={setSearchText}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          locationFilter={locationFilter}
          onLocationFilterChange={setLocationFilter}
          selectedRowKeys={selectedRowKeys}
          onBulkSubmit={handleBulkSubmit}
          isVerified={isVerified}
        />

        <JobsTable
          jobPosts={filteredData}
          selectedRowKeys={selectedRowKeys}
          onSelectionChange={setSelectedRowKeys}
          onPreview={handlePreview}
          onSubmitForApproval={handleSubmitForApproval}
          isVerified={isVerified}
        />
      </div>

      <JobPreviewDrawer
        visible={previewVisible}
        onClose={() => setPreviewVisible(false)}
        job={selectedJob}
      />
    </div>
  );
};

export default JobsPage;
