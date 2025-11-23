import { News, Field } from '@abc-interview-support-frontend/types';

import { useState, useEffect, useMemo } from 'react';
import confirm from 'antd/es/modal/confirm';
import {
  TrendNewsPageHeader,
  TrendNewsPreviewDrawer,
  TrendNewsTable,
  TrendNewsToolbar,
} from './components/trend-news';
import { newsService, questionService } from '@abc-interview-support-frontend/services';

const TrendNewsManagement = () => {
  const [dataList, setDataList] = useState<News[]>([]);
  const [fieldData, setFieldData] = useState<Field[]>([]);
  const [searchText, setSearchText] = useState('');
  const [fieldFilter, setFieldFilter] = useState<string>('all');
  const [selectedRowKeys] = useState<React.Key[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState<number | null>(null);

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
      news = news.filter((item: News) => item.newsType === 'NEWS' && (item.status === 'APPROVED' || item.status === 'PUBLISHED'));
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

  const filteredData = useMemo(() => {
    return dataList.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchText.toLowerCase()) ||
        item.content.toLowerCase().includes(searchText.toLowerCase());
      const matchesField = fieldFilter === 'all' || item.fieldId === Number(fieldFilter);

      return matchesSearch && matchesField;
    });
  }, [dataList, searchText, fieldFilter]);

  const handleDelete = (newsId: number) => {
    console.log('Delete news:', newsId);
    confirm({
      title: 'Bạn có chắc muốn xóa tin tức này?',
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xác nhận',
      okType: 'danger',
      maskClosable: true,
      closable: true,
      onOk() {
        // API call to delete news
        console.log('News deleted:', newsId);
      },
      cancelText: 'Hủy',
    });
  };

  const handlePreview = (data: News) => {
    setPreviewVisible(true);
    setSelectedNewsId(data.id);
  };

  return (
    <div className="container-center animate-fade-in-up">
      <TrendNewsPageHeader />

      <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
        <TrendNewsToolbar
          searchText={searchText}
          onSearchChange={setSearchText}
          fieldFilter={fieldFilter}
          onFieldFilterChange={setFieldFilter}
          selectedRowKeys={selectedRowKeys}
          fields={fieldData}
        />

        <TrendNewsTable
          dataList={filteredData}
          onPreview={handlePreview}
          onDelete={handleDelete}
          fields={fieldData}
        />
      </div>

      <TrendNewsPreviewDrawer
        newsId={selectedNewsId}
        onClose={() => {
          setPreviewVisible(false);
          setSelectedNewsId(null);
        }}
        visible={previewVisible}
        fields={fieldData}
      />
    </div>
  );
};

export default TrendNewsManagement;
