
import { useEffect, useMemo, useState } from 'react';
import { message, Modal } from 'antd';
import {
  Topic,
  Field,
} from '@abc-interview-support-frontend/types';
import { questionService } from '@abc-interview-support-frontend/services';
import { TopicFormDrawer, TopicHeader, TopicPreviewDrawer, TopicTable } from './components/topic-management';
import TopicToolbar from './components/topic-management/TopicToolbar';

const TopicManagement = () => {

  const [dataList, setDataList] = useState<Topic[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedFieldId, setSelectedFieldId] = useState<number | undefined>(undefined);
  const [selectedRowKeys] = useState<React.Key[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Topic | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedFormItem, setSelectedFormItem] = useState<Topic | null>(
    null
  );

  const filteredData = useMemo(() => {
    return dataList.filter((item) => {
      const matchesSearch = item?.name
        ?.toLowerCase()
        .includes(searchText.toLowerCase());
      const matchesField = selectedFieldId ? item.fieldId === selectedFieldId : true;
      return matchesSearch && matchesField;
    });
  }, [dataList, searchText, selectedFieldId]);

  const handlePreview = (data: Topic) => {
    setPreviewVisible(true);
    setSelectedItem(data);
  };

  const handleCreate = () => {
    setSelectedFormItem(null);
    setFormVisible(true);
  };

  const handleEdit = (data: Topic) => {
    setSelectedFormItem(data);
    setFormVisible(true);
  };

  const handleFormClose = () => {
    setFormVisible(false);
    setSelectedFormItem(null);
  };

  const handleFormSuccess = () => {
    // Refresh the topics list after successful creation/update
    getAllTopics();
  };

  const handleDelete = async (topicId: number) => {
    Modal.confirm({
      title: 'Xác nhận xóa chủ đề',
      content: 'Bạn có chắc chắn muốn xóa chủ đề này? Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await questionService.deleteTopic(topicId);
          message.success('Xóa chủ đề thành công!');
          // Refresh the topics list after successful deletion
          getAllTopics();
        } catch (error: unknown) {
          console.error('Delete topic error:', error);

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
            message.error('Có lỗi xảy ra khi xóa chủ đề. Vui lòng thử lại.');
          }
        }
      },
    });
  };

  const getAllTopics = async () => {
    try {
      const res = await questionService.getAllTopics();
      console.log('Topics:', res.content);
      setDataList(res.content || []);
    } catch (error) {
      console.error('Error fetching topics:', error);
      setDataList([]);
    }
  };

  const getAllFields = async () => {
    try {
      const res = await questionService.getAllFields();
      console.log('Fields:', res.content);
      setFields(res.content || []);
    } catch (error) {
      console.error('Error fetching fields:', error);
      setFields([]);
    }
  };

  useEffect(() => {
    getAllTopics();
    getAllFields();
  }, []);

  return (
    <div className="container-center animate-fade-in-up">
      <TopicHeader onCreate={handleCreate} />

      <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
        <TopicToolbar
          searchText={searchText}
          onSearchChange={setSearchText}
          selectedRowKeys={selectedRowKeys}
          fields={fields}
          selectedFieldId={selectedFieldId}
          onFieldChange={setSelectedFieldId}
        />

        <TopicTable
          dataList={filteredData}
          onPreview={handlePreview}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <TopicPreviewDrawer
        visible={previewVisible}
        onClose={() => setPreviewVisible(false)}
        data={selectedItem}
      />

      <TopicFormDrawer
        visible={formVisible}
        onClose={handleFormClose}
        data={selectedFormItem}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default TopicManagement;