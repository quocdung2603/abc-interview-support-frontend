import { useEffect, useMemo, useState } from 'react';
import { message, Modal } from 'antd';
import {
  Field,
} from '@abc-interview-support-frontend/types';
import { questionService } from '@abc-interview-support-frontend/services';
import { FieldFormDrawer, FieldHeader, FieldPreviewDrawer, FieldTable } from './components/field-management';
import FieldToolbar from './components/field-management/FieldToolbar';

const FieldManagement = () => {

  const [dataList, setDataList] = useState<Field[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys] = useState<React.Key[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Field | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedFormItem, setSelectedFormItem] = useState<Field | null>(
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

  const handlePreview = (data: Field) => {
    setPreviewVisible(true);
    setSelectedItem(data);
  };

  const handleCreate = () => {
    setSelectedFormItem(null);
    setFormVisible(true);
  };

  const handleEdit = (data: Field) => {
    setSelectedFormItem(data);
    setFormVisible(true);
  };

  const handleFormClose = () => {
    setFormVisible(false);
    setSelectedFormItem(null);
  };

  const handleFormSuccess = () => {
    // Refresh the fields list after successful creation/update
    getAllFields();
  };

  const handleDelete = async (fieldId: number) => {
    Modal.confirm({
      title: 'Xác nhận xóa lĩnh vực',
      content: 'Bạn có chắc chắn muốn xóa lĩnh vực này? Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await questionService.deleteField(fieldId);
          message.success('Xóa lĩnh vực thành công!');
          // Refresh the fields list after successful deletion
          getAllFields();
        } catch (error: unknown) {
          console.error('Delete field error:', error);

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
            message.error('Có lỗi xảy ra khi xóa lĩnh vực. Vui lòng thử lại.');
          }
        }
      },
    });
  };

  const getAllFields = async () => {
    try {
      const res = await questionService.getAllFields();
      console.log('Fields:', res.content);
      setDataList(res.content || []);
    } catch (error) {
      console.error('Error fetching fields:', error);
      setDataList([]);
    }
  };

  useEffect(() => {
    getAllFields();
  }, []);

  return (
    <div className="container-center animate-fade-in-up">
      <FieldHeader onCreate={handleCreate} />

      <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
        <FieldToolbar
          searchText={searchText}
          onSearchChange={setSearchText}
          selectedRowKeys={selectedRowKeys}
        />

        <FieldTable
          dataList={filteredData}
          onPreview={handlePreview}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <FieldPreviewDrawer
        visible={previewVisible}
        onClose={() => setPreviewVisible(false)}
        data={selectedItem}
      />

      <FieldFormDrawer
        visible={formVisible}
        onClose={handleFormClose}
        data={selectedFormItem}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default FieldManagement;
