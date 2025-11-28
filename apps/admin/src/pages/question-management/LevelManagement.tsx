import { useEffect, useMemo, useState } from 'react';
import { message, Modal } from 'antd';
import {
  Level,
} from '@abc-interview-support-frontend/types';
import { questionService } from '@abc-interview-support-frontend/services';
import { LevelFormDrawer, LevelHeader, LevelPreviewDrawer, LevelTable } from './components/level-management';
import LevelToolbar from './components/level-management/LevelToolbar';

const LevelManagement = () => {

  const [dataList, setDataList] = useState<Level[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys] = useState<React.Key[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Level | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedFormItem, setSelectedFormItem] = useState<Level | null>(
    null
  );

  const filteredData = useMemo(() => {
    return dataList.filter((item) => {
      const matchesSearch = item?.name
        ?.toLowerCase()
        .includes(searchText.toLowerCase());
      return matchesSearch;
    });
  }, [dataList, searchText]);

  const handlePreview = (data: Level) => {
    setPreviewVisible(true);
    setSelectedItem(data);
  };

  const handleCreate = () => {
    setSelectedFormItem(null);
    setFormVisible(true);
  };

  const handleEdit = (data: Level) => {
    setSelectedFormItem(data);
    setFormVisible(true);
  };

  const handleFormClose = () => {
    setFormVisible(false);
    setSelectedFormItem(null);
  };

  const handleFormSuccess = () => {
    // Refresh the levels list after successful creation/update
    getAllLevels();
  };

  const handleDelete = async (levelId: number) => {
    Modal.confirm({
      title: 'Xác nhận xóa mức độ',
      content: 'Bạn có chắc chắn muốn xóa mức độ này? Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await questionService.deleteLevel(levelId);
          message.success('Xóa mức độ thành công!');
          // Refresh the levels list after successful deletion
          getAllLevels();
        } catch (error: unknown) {
          console.error('Delete level error:', error);

          // Handle API error
          if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            if (axiosError.response?.data?.message) {
              message.error(`Lỗi: ${axiosError.response.data.message}`);
              return;
            }
          }

          if (error instanceof Error && error.message) {
            message.error(`Lỗi: ${error.message}`);
          } else {
            message.error('Có lỗi xảy ra khi xóa mức độ. Vui lòng thử lại.');
          }
        }
      },
    });
  };

  const getAllLevels = async () => {
    try {
      const res = await questionService.getAllLevels();
      console.log('Levels:', res.content);
      setDataList(res.content || []);
    } catch (error) {
      console.error('Error fetching levels:', error);
      setDataList([]);
    }
  };

  useEffect(() => {
    getAllLevels();
  }, []);

  return (
    <div className="container-center animate-fade-in-up">
      <LevelHeader onCreate={handleCreate} />

      <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
        <LevelToolbar
          searchText={searchText}
          onSearchChange={setSearchText}
          selectedRowKeys={selectedRowKeys}
        />

        <LevelTable
          dataList={filteredData}
          onPreview={handlePreview}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <LevelPreviewDrawer
        visible={previewVisible}
        onClose={() => setPreviewVisible(false)}
        data={selectedItem}
      />

      <LevelFormDrawer
        visible={formVisible}
        onClose={handleFormClose}
        data={selectedFormItem}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default LevelManagement;