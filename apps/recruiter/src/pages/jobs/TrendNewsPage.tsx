import { useEffect, useState, useMemo } from 'react';
import { message } from 'antd';
import {
  TrendNewsPageHeader,
  TrendNewsToolbar,
  TrendNewsTable,
  TrendNewsPreviewDrawer,
  TrendNewsFormDrawer,
} from './components/trend';
import dayjs from 'dayjs';
import { newsService } from '@abc-interview-support-frontend/services';
import { News } from '@abc-interview-support-frontend/types';
import { useAuth } from '@abc-interview-support-frontend/sso-utils';

const TrendNewsPage = () => {
  const { user } = useAuth();

  const [openForm, setOpenForm] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [editingNews, setEditingNews] = useState<News | null>(null);

  // Filter states
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [newsTypeFilter, setNewsTypeFilter] = useState('');
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null);

  const [trendNewsList, setTrendNewsList] = useState<News[]>([]);

  const getNewsByUser = async (userId: string) => {
    try {
      const res = await newsService.getNewsByUser(userId);
      let news = res.content || [];
      news = news.filter((news: News) => news.newsType === 'NEWS');
      setTrendNewsList(news);
    } catch (error) {
      console.error('Error fetching trend news:', error);
      setTrendNewsList([]);
    }
  }

  useEffect(() => {
    getNewsByUser(user?.userId || '')
  }, [user?.userId]);

  // Filter logic
  const filteredNews = useMemo(() => {
    return trendNewsList.filter((news) => {
      const matchesSearch =
        !searchValue ||
        news.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        news.content.toLowerCase().includes(searchValue.toLowerCase());

      const matchesStatus = !statusFilter || news.status === statusFilter;
      const matchesCategory = !newsTypeFilter || news.newsType === newsTypeFilter;

      const matchesDate =
        !dateRange?.[0] ||
        !dateRange?.[1] ||
        (dayjs(news.createdAt).isAfter(dateRange[0].startOf('day')) &&
          dayjs(news.createdAt).isBefore(dateRange[1].endOf('day')));

      return matchesSearch && matchesStatus && matchesCategory && matchesDate;
    });
  }, [trendNewsList, searchValue, statusFilter, newsTypeFilter, dateRange]);

  const handlePreviewNews = (news: News) => {
    setSelectedNews(news);
    setPreviewVisible(true);
  };

  const handleCreateNews = () => {
    setEditingNews(null);
    setOpenForm(true);
  };

  const handleEditNews = (news: News) => {
    setEditingNews(news); // <- sửa => đổ dữ liệu
    setOpenForm(true);
  };

  const handleDeleteNews = async (id: number) => {
    try {
      await newsService.deleteNews(id);
      setTrendNewsList((prev) => prev.filter((news) => news.id !== id));
      message.success('Đã xóa tin tức thành công');
    } catch (error) {
      console.error('Error deleting news:', error);
      message.error('Có lỗi xảy ra khi xóa tin tức');
    }
  };

  const handleSaveNews = (data: News, mode: 'create' | 'update') => {
    if (mode === 'create') {
      setTrendNewsList((prev) => [data, ...prev]);
    } else {
      setTrendNewsList((prev) =>
        prev.map((j) => (j.id === data.id ? data : j))
      );
    }
    setOpenForm(false);
  };

  const handleResetFilters = () => {
    setSearchValue('');
    setStatusFilter('');
    setNewsTypeFilter('');
    setDateRange(null);
  };

  return (
    <div className="container-center animate-fade-in-up">
      <TrendNewsPageHeader onCreateNews={handleCreateNews} />
      <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
        <TrendNewsToolbar
          searchValue={searchValue}
          statusFilter={statusFilter}
          newsTypeFilter={newsTypeFilter}
          onSearchChange={setSearchValue}
          onStatusFilterChange={setStatusFilter}
          onNewsTypeFilterChange={setNewsTypeFilter}
          onDateRangeChange={setDateRange}
          onResetFilters={handleResetFilters}
        />

        <TrendNewsTable
          data={filteredNews}
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
        user={user}
      />
    </div>
  );
};

export default TrendNewsPage;
