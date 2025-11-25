import { useState, useMemo, useEffect } from 'react';
import {
  NewsApprovalFormDrawer,
  NewsApprovalPageHeader,
  NewsApprovalTable,
  NewsApprovalToolbar,
} from './components/news-approval';
import { NewsItem, Field } from '@abc-interview-support-frontend/types';
import { newsService, questionService } from '@abc-interview-support-frontend/services';

const NewsApproval = () => {
  const [dataList, setDataList] = useState<NewsItem[]>([]);
  const [fieldData, setFieldData] = useState<Field[]>([]);
  const [searchText, setSearchText] = useState('');
  const [fieldFilter, setFieldFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [newsTypeFilter, setNewsTypeFilter] = useState<string>('all');
  const [selectedRowKeys] = useState<React.Key[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState<number | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const filteredData = useMemo(() => {
    return dataList.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchText.toLowerCase()) ||
        item.content.toLowerCase().includes(searchText.toLowerCase());
      const matchesField = fieldFilter === 'all' || item.fieldId === Number(fieldFilter);
      const matchesLocation =
        locationFilter === 'all' || (item.newsType === 'RECRUITMENT' && item.location === locationFilter);
      const matchesStatus =
        statusFilter === 'all' || item.status === statusFilter;
      const matchesNewsType =
        newsTypeFilter === 'all' || item.newsType === newsTypeFilter;

      return (
        matchesSearch &&
        matchesField &&
        matchesLocation &&
        matchesStatus &&
        matchesNewsType
      );
    });
  }, [dataList, searchText, fieldFilter, locationFilter, statusFilter, newsTypeFilter]);

  const handlePreview = (data: NewsItem) => {
    setPreviewVisible(true);
    setSelectedNewsId(data.id);
    setSelectedUserId(data.userId);
  };

  const getAllFields = async () => {
    try {
      const res = await questionService.getAllFields();
      setFieldData(res.content || []);
    } catch (error) {
      console.error('Error fetching fields:', error);
      setFieldData([]);
    }
  };

  const getAllNews = async () => {
    try {
      const res = await newsService.getAllNews();
      let news = res.content || [];
      news = news.filter((item: NewsItem) => (item.status === 'PENDING' || item.status === 'REJECTED'));
      setDataList(news);
    } catch (error) {
      console.error('Error fetching news:', error);
      setDataList([]);
    }
  }

  useEffect(() => {
    getAllNews();
    getAllFields();
  }, []);

  return (
    <div className="container-center animate-fade-in-up">
      <NewsApprovalPageHeader />

      <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
        <NewsApprovalToolbar
          fields={fieldData}
          fieldFilter={fieldFilter}
          locationFilter={locationFilter}
          onLocationFilterChange={setLocationFilter}
          searchText={searchText}
          onSearchChange={setSearchText}
          onFieldFilterChange={setFieldFilter}
          selectedRowKeys={selectedRowKeys}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          newsTypeFilter={newsTypeFilter}
          onNewsTypeFilterChange={setNewsTypeFilter}
        />
        <NewsApprovalTable
          dataList={filteredData}
          onPreview={handlePreview}
          fields={fieldData}
        />
      </div>

      <NewsApprovalFormDrawer
        visible={previewVisible}
        onClose={() => {
          setPreviewVisible(false);
          setSelectedNewsId(null);
          setSelectedUserId(null);
        }}
        newsId={selectedNewsId}
        userId={selectedUserId}
        fields={fieldData}
        onSuccess={getAllNews}
      />
    </div>
  );
};

export default NewsApproval;
