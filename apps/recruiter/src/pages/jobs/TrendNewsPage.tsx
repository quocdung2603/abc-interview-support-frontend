import { useState } from 'react';
import { message } from 'antd';
import { useAuth } from '@abc-interview-support-frontend/sso-utils';
import {
  TrendNewsPageHeader,
  TrendNewsToolbar,
  TrendNewsTable,
  TrendNewsPreviewDrawer,
  VerificationWarning,
  TrendNews,
  TrendNewsFormDrawer,
} from './components/trend';
import dayjs from 'dayjs';

const TrendNewsPage = () => {
  const { user } = useAuth();
  const isVerified = user?.status === 'Verified';

  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedNews, setSelectedNews] = useState<TrendNews | null>(null);
  const [editingNews, setEditingNews] = useState<TrendNews | null>(null);

  // Filter states
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null);

  const mockData: TrendNews[] = [
    {
      id: '1',
      title: 'Xu hướng tuyển dụng IT 2024',
      summary: 'Những xu hướng mới trong việc tuyển dụng nhân tài IT năm 2024',
      content: '<p>Nội dung chi tiết về xu hướng tuyển dụng IT...</p>',
      category: 'technology',
      tags: ['IT', 'Tuyển dụng', '2024'],
      featuredImage: '/trend-it-2024.jpg',
      author: {
        id: 'author1',
        name: 'Nguyễn Văn A',
        avatar: '/avatar1.jpg',
      },
      status: 'published',
      viewCount: 1250,
      likeCount: 89,
      isFeature: true,
      seo: {
        metaTitle: 'Xu hướng tuyển dụng IT 2024',
        metaDescription: 'Khám phá những xu hướng mới nhất trong tuyển dụng IT',
        keywords: ['tuyển dụng IT', 'xu hướng 2024', 'công nghệ'],
      },
      createdAt: '2024-01-15T10:00:00Z',
      publishedAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      title: 'Kỹ năng mềm quan trọng cho developer',
      summary: 'Những kỹ năng mềm cần thiết mà mọi developer nên có',
      content: '<p>Nội dung về kỹ năng mềm...</p>',
      category: 'skills',
      tags: ['Kỹ năng mềm', 'Developer', 'Phát triển'],
      author: {
        id: 'author2',
        name: 'Trần Thị B',
      },
      status: 'draft',
      viewCount: 0,
      likeCount: 0,
      isFeature: false,
      createdAt: '2024-01-14T14:30:00Z',
    },
  ];

  const [trendNewsList, setTrendNewsList] = useState<TrendNews[]>(mockData);

  // Filter logic
  const filteredNews = trendNewsList.filter((news) => {
    const matchesSearch =
      !searchValue ||
      news.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      news.content.toLowerCase().includes(searchValue.toLowerCase());

    const matchesStatus = !statusFilter || news.status === statusFilter;
    const matchesCategory = !categoryFilter || news.category === categoryFilter;

    const matchesDate =
      !dateRange?.[0] ||
      !dateRange?.[1] ||
      (dayjs(news.createdAt).isAfter(dateRange[0].startOf('day')) &&
        dayjs(news.createdAt).isBefore(dateRange[1].endOf('day')));

    return matchesSearch && matchesStatus && matchesCategory && matchesDate;
  });

  const handlePreviewNews = (news: TrendNews) => {
    setSelectedNews(news);
    setPreviewVisible(true);
  };

  const handleCreateNews = () => {
    setEditingNews(null);
    setOpenForm(true);
  };

  const handleEditNews = (news: TrendNews) => {
    setEditingNews(news); // <- sửa => đổ dữ liệu
    setOpenForm(true);
  };

  const handleDeleteNews = async (id: string) => {
    //api delete news
  };

  const handleSaveNews = async (
    payload: TrendNews,
    mode: 'create' | 'update'
  ) => {
    const now = new Date().toISOString().slice(0, 10);
    if (mode === 'create') {
      const newJob: TrendNews = {
        ...payload,
        id: crypto.randomUUID?.() ?? String(Date.now()),
        status: 'draft',
        createdAt: now,
        updatedAt: now,
      };
      setTrendNewsList((prev) => [newJob, ...prev]);
      console.log(trendNewsList);
      message.success('Đã tạo tin xu hướng');
    } else {
      setTrendNewsList((prev) =>
        prev.map((j) =>
          j.id === payload.id ? { ...j, ...payload, updatedAt: now } : j
        )
      );
      message.success('Đã cập nhật tin xu hướng');
    }
    setOpenForm(false);
  };

  const handleResetFilters = () => {
    setSearchValue('');
    setStatusFilter('');
    setCategoryFilter('');
    setDateRange(null);
  };

  return (
    <div className="container-center animate-fade-in-up">
      <TrendNewsPageHeader onCreateNews={handleCreateNews} />

      <VerificationWarning isVerified={isVerified} />

      <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
        <TrendNewsToolbar
          searchValue={searchValue}
          statusFilter={statusFilter}
          categoryFilter={categoryFilter}
          onSearchChange={setSearchValue}
          onStatusFilterChange={setStatusFilter}
          onCategoryFilterChange={setCategoryFilter}
          onDateRangeChange={setDateRange}
          onResetFilters={handleResetFilters}
        />

        <TrendNewsTable
          data={filteredNews}
          loading={loading}
          onEdit={handleEditNews}
          onDelete={handleDeleteNews}
          onPreview={handlePreviewNews}
        />
      </div>

      <TrendNewsPreviewDrawer
        news={selectedNews}
        visible={previewVisible}
        onClose={() => {
          setPreviewVisible(false);
        }}
      />

      <TrendNewsFormDrawer
        visible={openForm}
        onClose={() => setOpenForm(false)}
        onSave={handleSaveNews}
        initForm={editingNews || undefined}
      />
    </div>
  );
};

export default TrendNewsPage;
