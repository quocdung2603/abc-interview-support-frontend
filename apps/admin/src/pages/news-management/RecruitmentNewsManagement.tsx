import { RecruitmentNews, Field } from '@abc-interview-support-frontend/types';

import { useState, useEffect, useMemo } from 'react';
import confirm from 'antd/es/modal/confirm';
import { message } from 'antd';
import {
  RecruitmentNewsPageHeader,
  RecruitmentNewsPreviewDrawer,
  RecruitmentNewsTable,
  RecruitmentNewsToolbar,
} from './components/recruitment-news';
import { newsService, questionService } from '@abc-interview-support-frontend/services';

const RecruitmentNewsManagement = () => {
  const [dataList, setDataList] = useState<RecruitmentNews[]>([]);
  const [fieldData, setFieldData] = useState<Field[]>([]);
  const [searchText, setSearchText] = useState('');
  const [fieldFilter, setFieldFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [selectedRowKeys] = useState<React.Key[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState<number | null>(null);


  const filteredData = useMemo(() => {
    return dataList.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchText.toLowerCase()) ||
        item.content.toLowerCase().includes(searchText.toLowerCase());
      const matchesField = fieldFilter === 'all' || item.fieldId === Number(fieldFilter);
      const matchesLocation =
        locationFilter === 'all' || item.location === locationFilter;

      return matchesSearch && matchesField && matchesLocation;
    });
  }, [dataList, searchText, fieldFilter, locationFilter]);

  const handleDelete = (newsId: number) => {
    const confirmDelete = async () => {
      try {
        await newsService.deleteNews(newsId);
        const updatedList = dataList.filter((news) => news.id !== newsId);
        setDataList(updatedList);
        message.success('Đã xóa tin tuyển dụng thành công');
      } catch (error) {
        console.error('Error deleting news:', error);
        message.error('Có lỗi xảy ra khi xóa tin tuyển dụng');
      }
    };

    confirm({
      title: 'Bạn có chắc muốn xóa tin tuyển dụng này?',
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xác nhận',
      okType: 'danger',
      maskClosable: true,
      closable: true,
      onOk: confirmDelete,
      cancelText: 'Hủy',
    });
  };

  const handlePreview = (data: RecruitmentNews) => {
    setPreviewVisible(true);
    setSelectedNewsId(data.id);
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
      news = news.filter((item: RecruitmentNews) => item.newsType === 'RECRUITMENT' && (item.status === 'APPROVED' || item.status === 'PUBLISHED'));
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
      <RecruitmentNewsPageHeader />

      <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
        <RecruitmentNewsToolbar
          searchText={searchText}
          onSearchChange={setSearchText}
          fieldFilter={fieldFilter}
          onFieldFilterChange={setFieldFilter}
          locationFilter={locationFilter}
          onLocationFilterChange={setLocationFilter}
          selectedRowKeys={selectedRowKeys}
          fields={fieldData}
        />

        <RecruitmentNewsTable
          dataList={filteredData}
          onPreview={handlePreview}
          onDelete={handleDelete}
          fields={fieldData}
        />
      </div>

      <RecruitmentNewsPreviewDrawer
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

export default RecruitmentNewsManagement;
