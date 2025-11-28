import { useEffect, useMemo, useState } from 'react';
import { message, Modal } from 'antd';
import {
  QuestionType,
} from '@abc-interview-support-frontend/types';
import { questionService } from '@abc-interview-support-frontend/services';
import { QuestionTypeFormDrawer, QuestionTypeHeader, QuestionTypePreviewDrawer, QuestionTypeTable } from './components/question-type-management';
import QuestionTypeToolbar from './components/question-type-management/QuestionTypeToolbar';

const QuestionTypeManagement = () => {

  const [dataList, setDataList] = useState<QuestionType[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys] = useState<React.Key[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<QuestionType | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedFormItem, setSelectedFormItem] = useState<QuestionType | null>(
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

  const handlePreview = (data: QuestionType) => {
    setPreviewVisible(true);
    setSelectedItem(data);
  };

  const handleCreate = () => {
    setSelectedFormItem(null);
    setFormVisible(true);
  };

  const handleEdit = (data: QuestionType) => {
    setSelectedFormItem(data);
    setFormVisible(true);
  };

  const handleFormClose = () => {
    setFormVisible(false);
    setSelectedFormItem(null);
  };

  const handleFormSuccess = () => {
    // Refresh the question types list after successful creation/update
    getAllQuestionTypes();
  };

  const handleDelete = async (questionTypeId: number) => {
    Modal.confirm({
      title: 'Xác nhận xóa loại câu hỏi',
      content: 'Bạn có chắc chắn muốn xóa loại câu hỏi này? Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await questionService.deleteQuestionType(questionTypeId);
          message.success('Xóa loại câu hỏi thành công!');
          // Refresh the question types list after successful deletion
          getAllQuestionTypes();
        } catch (error: unknown) {
          console.error('Delete question type error:', error);

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
            message.error('Có lỗi xảy ra khi xóa loại câu hỏi. Vui lòng thử lại.');
          }
        }
      },
    });
  };

  const getAllQuestionTypes = async () => {
    try {
      const res = await questionService.getAllQuestionTypes();
      console.log('Question Types:', res.content);
      setDataList(res.content || []);
    } catch (error) {
      console.error('Error fetching question types:', error);
      setDataList([]);
    }
  };

  useEffect(() => {
    getAllQuestionTypes();
  }, []);

  return (
    <div className="container-center animate-fade-in-up">
      <QuestionTypeHeader onCreate={handleCreate} />

      <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
        <QuestionTypeToolbar
          searchText={searchText}
          onSearchChange={setSearchText}
          selectedRowKeys={selectedRowKeys}
        />

        <QuestionTypeTable
          dataList={filteredData}
          onPreview={handlePreview}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <QuestionTypePreviewDrawer
        visible={previewVisible}
        onClose={() => setPreviewVisible(false)}
        data={selectedItem}
      />

      <QuestionTypeFormDrawer
        visible={formVisible}
        onClose={handleFormClose}
        data={selectedFormItem}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default QuestionTypeManagement;