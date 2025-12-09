import React, { useState } from 'react';
import { NewsItem, Field, Topic, Level, User } from '@abc-interview-support-frontend/types';
import CreateNewsButton from './CreateNewsButton';
import NewsTable from './NewsTable';
import CreateNewsDrawer, { CreateNewsData, EditNewsData } from './CreateNewsDrawer';
import { newsService } from '@abc-interview-support-frontend/services';
import { message, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';

interface NewsTabsProps {
  user: User;
  news: NewsItem[];
  fields: Field[];
  topics: Topic[];
  levels: Level[];
  onRefresh: () => void;
}

const NewsTabs: React.FC<NewsTabsProps> = ({
  user,
  news,
  fields,
  topics,
  levels,
  onRefresh,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<EditNewsData | undefined>();
  const navigate = useNavigate();

  const handleCreateNews = () => {
    setEditMode(false);
    setEditData(undefined);
    setDrawerOpen(true);
  };

  const handleEditNews = (newsItem: NewsItem) => {
    setEditMode(true);
    setEditData({
      newsId: newsItem.id,
      userId: newsItem.userId,
      title: newsItem.title,
      content: newsItem.content,
      fieldId: newsItem.fieldId || 0,
      newsType: newsItem.newsType,
    });
    setDrawerOpen(true);
  };

  const handleDeleteNews = (newsId: number) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa tin tức này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await newsService.deleteNews(newsId);
          message.success('Xóa tin tức thành công!');
          onRefresh();
        } catch (error) {
          console.error('Error deleting news:', error);
          message.error('Không thể xóa tin tức. Vui lòng thử lại!');
        }
      },
    });
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditMode(false);
    setEditData(undefined);
  };

  const handleSubmitNews = async (data: CreateNewsData) => {
    try {
      // Format data to match API requirements
      const requestData = {
        userId: user.id,
        title: data.title,
        content: data.content,
        fieldId: data.fieldId,
        newsType: 'NEWS' as const, // Always NEWS
      };

      if (editMode && editData?.newsId) {
        // Update existing news
        console.log('Update news request:', requestData);
        await newsService.updateNews(editData.newsId, requestData);
        message.success('Cập nhật tin tức thành công!');
      } else {
        // Create new news
        console.log('Create news request:', requestData);
        await newsService.createNews(requestData);
        message.success('Tạo tin tức thành công!');
      }

      onRefresh();
      setDrawerOpen(false);
      setEditMode(false);
      setEditData(undefined);
    } catch (error) {
      console.error('Error submitting news:', error);
      message.error(editMode ? 'Không thể cập nhật tin tức. Vui lòng thử lại!' : 'Không thể tạo tin tức. Vui lòng thử lại!');
    }
  };

  const handleViewNews = (newsId: number) => {
    console.log('View news:', newsId);
    navigate(`/trend-news-detail/${newsId}`);
    message.info(`Xem chi tiết tin tức ID: ${newsId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>📰</span>
            <span>Tin tức</span>
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Chia sẻ tin tức và cơ hội nghề nghiệp
          </p>
        </div>
        <CreateNewsButton onClick={handleCreateNews} />
      </div>

      {/* News Table */}
      <NewsTable
        news={news}
        onViewNews={handleViewNews}
        onEditNews={handleEditNews}
        onDeleteNews={handleDeleteNews}
      />

      {/* Create/Edit News Drawer */}
      <CreateNewsDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        fields={fields}
        onSubmit={handleSubmitNews}
        editMode={editMode}
        editData={editData}
      />
    </div>
  );
};

export default NewsTabs;
