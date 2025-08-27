import React, { useState } from 'react';
import { message } from 'antd';
import { useAuth } from '@abc-interview-support-frontend/sso-utils';

import {
  JobsPageHeader,
  VerificationWarning,
  JobsToolbar,
  JobsTable,
  JobPreviewDrawer,
  JobFormDrawer,
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
  const [openForm, setOpenForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);

  const [editingJob, setEditingJob] = useState<JobPost | null>(null);

  // Mock data
  const initialJobs: JobPost[] = [
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
  ];

  const [jobPosts, setJobPosts] = useState<JobPost[]>(initialJobs);

  const handlePreview = (job: JobPost) => {
    setSelectedJob(job);
    setPreviewVisible(true);
  };

  const handleCreateJob = () => {
    setEditingJob(null); // <- tạo mới => form rỗng
    setOpenForm(true);
  };

  const handleEditJob = (job: JobPost) => {
    setEditingJob(job); // <- sửa => đổ dữ liệu
    setOpenForm(true);
  };

  const handleSaveJob = (payload: JobPost, mode: 'create' | 'update') => {
    const now = new Date().toISOString().slice(0, 10);
    if (mode === 'create') {
      const newJob: JobPost = {
        ...payload,
        id: crypto.randomUUID?.() ?? String(Date.now()),
        status: 'draft',
        createdAt: now,
        updatedAt: now,
      };
      setJobPosts((prev) => [newJob, ...prev]);
      console.log(jobPosts);
      message.success('Đã tạo tin tuyển dụng');
    } else {
      setJobPosts((prev) =>
        prev.map((j) =>
          j.id === payload.id ? { ...j, ...payload, updatedAt: now } : j
        )
      );
      message.success('Đã cập nhật tin tuyển dụng');
    }
    setOpenForm(false);
  };

  const handleDeleteJob = (jobId: string) => {
    //api delete job
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
          isVerified={isVerified}
        />

        <JobsTable
          jobPosts={filteredData}
          selectedRowKeys={selectedRowKeys}
          onSelectionChange={setSelectedRowKeys}
          onPreview={handlePreview}
          onEdit={handleEditJob}
          onDelete={handleDeleteJob}
        />
      </div>

      <JobPreviewDrawer
        visible={previewVisible}
        onClose={() => setPreviewVisible(false)}
        job={selectedJob}
      />
      <JobFormDrawer
        visible={openForm}
        onClose={() => setOpenForm(false)}
        onSave={handleSaveJob}
        initForm={editingJob || undefined}
      />
    </div>
  );
};

export default JobsPage;
