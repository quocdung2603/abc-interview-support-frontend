import { useEffect, useMemo, useState } from 'react';
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

      return matchesSearch && matchesField && matchesTopic && matchesLevel;
    });
  }, [dataList, searchText, fieldFilter, topicFilter, levelFilter]);

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

  const getAllFields = async () => {
    try {
      const res = await questionService.getAllFields();
      console.log('Fields:', res.content);
      const mappedFields = (res.content || []).map((item: { id: number, name?: string, description?: string }) => ({
        id: item.id,
        fieldName: item.name || item.description || 'Unknown Field',
        description: item.description || item.name || 'Unknown Field',
      }));
      setFieldData(mappedFields);
    } catch (error) {
      console.error('Error fetching fields:', error);
      setFieldData([]);
    }
  };

  const getAllTopics = async () => {
    try {
      const res = await questionService.getAllTopics();
      console.log('Topics:', res.content);
      const mappedTopics = (res.content || []).map((item: { id: number, name?: string, description?: string, fieldId: number }) => ({
        id: item.id,
        fieldId: item.fieldId,
        topicName: item.name || item.description || 'Unknown Topic',
        description: item.description || item.name || 'Unknown Topic',
      }));
      setTopicData(mappedTopics);
    } catch (error) {
      console.error('Error fetching topics:', error);
      setTopicData([]);
    }
  };

  const getAllLevels = async () => {
    try {
      const res = await questionService.getAllLevels();
      console.log('Levels:', res.content);
      const mappedLevels = (res.content || []).map((item: { id: number, name?: string, description?: string }) => ({
        id: item.id,
        levelName: (item.name || item.description || 'Unknown Level') as 'Fresher' | 'Junior' | 'Senior' | 'Middle',
        description: item.description || item.name || 'Unknown Level',
      }));
      setLevelData(mappedLevels);
    } catch (error) {
      console.error('Error fetching levels:', error);
      setLevelData([]);
    }
  };

  const getAllQuestionTypes = async () => {
    try {
      const res = await questionService.getAllQuestionTypes();
      console.log('Question Types:', res.content);
      const mappedTypes = (res.content || []).map((item: { id: string, description: string }) => ({
        id: Number(item.id),
        questionTypeName: item.description,
        description: item.description,
      }));
      setQuestionTypeData(mappedTypes);
    } catch (error) {
      console.error('Error fetching question types:', error);
      setQuestionTypeData([]);
    }
  };

  const getAllQuestions = async () => {
    try {
      const res = await questionService.getAllQuestions();
      let questions = res.content || [];
      questions = questions.filter((question: any) => question?.status === 'APPROVED');
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
          selectedRowKeys={selectedRowKeys}
          fields={fieldData}
          topics={topicData}
          levels={levelData}
        />

        <QuestionBankTable
          dataList={filteredData}
          onPreview={handlePreview}
          onEdit={handleEdit}
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
      />
    </div>
  );
};

export default QuestionBank;
