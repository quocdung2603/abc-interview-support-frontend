import { useEffect, useMemo, useState } from 'react';
import { message, Modal } from 'antd';
import {
  QuestionBankFormDrawer,
  QuestionBankPageHeader,
  QuestionBankPreviewDrawer,
  QuestionBankTable,
  QuestionBankToolbar,
} from './components/question-bank';
import {
  Question,
  Field,
  Topic,
  Level,
  QuestionType,
} from '@abc-interview-support-frontend/types';
import { questionService } from '@abc-interview-support-frontend/services';

const QuestionBank = () => {

  const [dataList, setDataList] = useState<Question[]>([]);
  const [fieldData, setFieldData] = useState<Field[]>([]);
  const [topicData, setTopicData] = useState<Topic[]>([]);
  const [levelData, setLevelData] = useState<Level[]>([]);
  const [questionTypeData, setQuestionTypeData] = useState<QuestionType[]>([]);
  const [searchText, setSearchText] = useState('');
  const [fieldFilter, setFieldFilter] = useState<string>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [questionTypeFilter, setQuestionTypeFilter] = useState<string>('all');
  const [selectedRowKeys] = useState<React.Key[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Question | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedFormItem, setSelectedFormItem] = useState<Question | null>(
    null
  );

  const filteredData = useMemo(() => {
    return dataList.filter((item) => {
      const matchesSearch = item?.questionContent
        ?.toLowerCase()
        .includes(searchText.toLowerCase());
      const matchesField = fieldFilter === 'all' || item?.fieldId === Number(fieldFilter);
      const matchesTopic = topicFilter === 'all' || item?.topicId === Number(topicFilter);
      const matchesLevel = levelFilter === 'all' || item?.levelId === Number(levelFilter);
      const matchesQuestionType = questionTypeFilter === 'all' || item?.questionTypeId === Number(questionTypeFilter);

      return matchesSearch && matchesField && matchesTopic && matchesLevel && matchesQuestionType;
    });
  }, [dataList, searchText, fieldFilter, topicFilter, levelFilter, questionTypeFilter]);

  const handlePreview = (data: Question) => {
    setPreviewVisible(true);
    setSelectedItem(data);
  };

  const handleCreate = () => {
    setSelectedFormItem(null);
    setFormVisible(true);
  };

  const handleEdit = (data: Question) => {
    setSelectedFormItem(data);
    setFormVisible(true);
  };

  const handleFormClose = () => {
    setFormVisible(false);
    setSelectedFormItem(null);
  };

  const handleFormSuccess = () => {
    // Refresh the questions list after successful creation/update
    getAllQuestions();
  };

  const handleDelete = async (questionId: number) => {
    Modal.confirm({
      title: 'Xác nhận xóa câu hỏi',
      content: 'Bạn có chắc chắn muốn xóa câu hỏi này? Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await questionService.deleteQuestion(questionId);
          message.success('Xóa câu hỏi thành công!');
          // Refresh the questions list after successful deletion
          getAllQuestions();
        } catch (error: unknown) {
          console.error('Delete question error:', error);

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
            message.error('Có lỗi xảy ra khi xóa câu hỏi. Vui lòng thử lại.');
          }
        }
      },
    });
  };

  const getAllFields = async () => {
    try {
      const res = await questionService.getAllFields();
      console.log('Fields:', res.content);
      setFieldData(res.content || []);
    } catch (error) {
      console.error('Error fetching fields:', error);
      setFieldData([]);
    }
  };

  const getAllTopics = async () => {
    try {
      const res = await questionService.getAllTopics();
      console.log('Topics:', res.content);
      setTopicData(res.content || []);
    } catch (error) {
      console.error('Error fetching topics:', error);
      setTopicData([]);
    }
  };

  const getAllLevels = async () => {
    try {
      const res = await questionService.getAllLevels();
      console.log('Levels:', res.content);
      setLevelData(res.content || []);
    } catch (error) {
      console.error('Error fetching levels:', error);
      setLevelData([]);
    }
  };

  const getAllQuestionTypes = async () => {
    try {
      const res = await questionService.getAllQuestionTypes();
      console.log('Question Types:', res.content);
      setQuestionTypeData(res.content || []);
    } catch (error) {
      console.error('Error fetching question types:', error);
      setQuestionTypeData([]);
    }
  };

  const getAllQuestions = async () => {
    try {
      const res = await questionService.getAllQuestions();
      let questions = res.content || [];
      questions = questions.filter((question: unknown) => {
        const q = question as { status?: string };
        return q?.status === 'APPROVED';
      });
      console.log('All Questions:', questions);
      setDataList(questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setDataList([]);
    }
  }

  useEffect(() => {
    getAllFields();
    getAllTopics();
    getAllLevels();
    getAllQuestionTypes();
    getAllQuestions();
  }, []);

  return (
    <div className="container-center animate-fade-in-up">
      <QuestionBankPageHeader onCreate={handleCreate} />

      <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
        <QuestionBankToolbar
          searchText={searchText}
          onSearchChange={setSearchText}
          fieldFilter={fieldFilter}
          onFieldFilterChange={setFieldFilter}
          topicFilter={topicFilter}
          onTopicFilterChange={setTopicFilter}
          levelFilter={levelFilter}
          onLevelFilterChange={setLevelFilter}
          questionTypeFilter={questionTypeFilter}
          onQuestionTypeFilterChange={setQuestionTypeFilter}
          selectedRowKeys={selectedRowKeys}
          fields={fieldData}
          topics={topicData}
          levels={levelData}
          questionTypes={questionTypeData}
        />

        <QuestionBankTable
          dataList={filteredData}
          onPreview={handlePreview}
          onEdit={handleEdit}
          onDelete={handleDelete}
          fields={fieldData}
          topics={topicData}
          levels={levelData}
          questionTypes={questionTypeData}
        />
      </div>

      <QuestionBankPreviewDrawer
        visible={previewVisible}
        onClose={() => setPreviewVisible(false)}
        data={selectedItem}
        fields={fieldData}
        topics={topicData}
        levels={levelData}
        questionTypes={questionTypeData}
      />

      <QuestionBankFormDrawer
        visible={formVisible}
        onClose={handleFormClose}
        data={selectedFormItem}
        fields={fieldData}
        topics={topicData}
        levels={levelData}
        questionTypes={questionTypeData}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default QuestionBank;
