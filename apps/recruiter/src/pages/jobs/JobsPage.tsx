import React, { useState, useMemo, useEffect } from 'react';
import { message } from 'antd';
import { useAuth } from '@abc-interview-support-frontend/sso-utils';

import {
  JobsPageHeader,
  JobsToolbar,
  JobsTable,
  JobPreviewDrawer,
  JobFormDrawer,
} from './components/recruitment';
import { RecruitmentNews } from '@abc-interview-support-frontend/types';
import { newsService } from '@abc-interview-support-frontend/services';

const JobsPage: React.FC = () => {
  const { user } = useAuth();

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<RecruitmentNews | null>(null);

  const [editingJob, setEditingJob] = useState<RecruitmentNews | null>(null);

  const [jobPosts, setJobPosts] = useState<RecruitmentNews[]>([]);

  const handlePreview = (job: RecruitmentNews) => {
    setSelectedJob(job);
    setPreviewVisible(true);
  };

  const handleCreateJob = () => {
    setEditingJob(null); // <- tạo mới => form rỗng
    setOpenForm(true);
  };

  const handleEditJob = (job: RecruitmentNews) => {
    setEditingJob(job); // <- sửa => đổ dữ liệu
    setOpenForm(true);
  };

  const handleSaveJob = (payload: RecruitmentNews, mode: 'create' | 'update') => {
    const now = new Date().toISOString().slice(0, 10);
    if (mode === 'create') {
      const newJob: RecruitmentNews = {
        ...payload,
        id: Number(crypto.randomUUID?.() ?? String(Date.now())),
        newsType: 'RECRUITMENT',
        status: 'PENDING',
        createdAt: now,
        userId: user?.userId ? Number(user.userId) : 1, // TODO: get from current user
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

  const handleDeleteJob = async (jobId: number) => {
    //api delete job
  };

  const filteredData = useMemo(() => {
    return jobPosts.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchText.toLowerCase()) ||
        job.position?.toLowerCase().includes(searchText.toLowerCase()) ||
        job.companyName?.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
      const matchesLocation =
        locationFilter === 'all' || job.location === locationFilter;

      return matchesSearch && matchesStatus && matchesLocation;
    });
  }, [jobPosts, searchText, statusFilter, locationFilter]);

  const getNewsByUser = async (userId: string) => {
    try {
      const res = await newsService.getNewsByUser(userId);
      let news = res.content || [];
      news = news.filter((news: RecruitmentNews) => news.newsType === 'RECRUITMENT');
      setJobPosts(news);
    } catch (error) {
      console.error('Error fetching recruitment news:', error);
      setJobPosts([]);
    }
  }

  useEffect(() => {
    getNewsByUser(user?.userId || '')
  }, [user?.userId]);


  return (
    <div className="container-center animate-fade-in-up">
      <JobsPageHeader onCreateJob={handleCreateJob} />

      <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
        <JobsToolbar
          searchText={searchText}
          onSearchChange={setSearchText}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          locationFilter={locationFilter}
          onLocationFilterChange={setLocationFilter}
          selectedRowKeys={selectedRowKeys}
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
