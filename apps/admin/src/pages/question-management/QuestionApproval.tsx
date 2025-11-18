import { useState, useMemo, useEffect } from 'react';
import {
  QuestionApprovalPageHeader,
  QuestionApprovalToolbar,
  QuestionApprovalTable,
  QuestionApprovalFormDrawer,
} from './components/question-approval';
import {
  Field,
  Level,
  Question,
  QuestionType,
  Topic,
} from '@abc-interview-support-frontend/types';
import { questionService } from '@abc-interview-support-frontend/services';

const QuestionApproval = () => {
  const [dataList, setDataList] = useState<Question[]>([]);
  const [fieldData, setFieldData] = useState<Field[]>([]);
  const [topicData, setTopicData] = useState<Topic[]>([]);
  const [levelData, setLevelData] = useState<Level[]>([]);
  const [questionTypeData, setQuestionTypeData] = useState<QuestionType[]>([]);
  const [searchText, setSearchText] = useState('');
  const [fieldFilter, setFieldFilter] = useState<string>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRowKeys] = useState<React.Key[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [formDrawerVisible, setFormDrawerVisible] = useState(false);

const filteredData = useMemo(() => {
    return dataList.filter((item) => {
      const matchesSearch = item?.questionContent
        ?.toLowerCase()
        .includes(searchText.toLowerCase());
      const matchesField = fieldFilter === 'all' || item?.fieldId.toString() === fieldFilter;
      const matchesTopic = topicFilter === 'all' || item?.topicId.toString() === topicFilter;
      const matchesLevel = levelFilter === 'all' || item?.levelId.toString() === levelFilter;
      const matchesStatus = statusFilter === 'all' || item?.status === statusFilter;

      return matchesSearch && matchesField && matchesTopic && matchesLevel && matchesStatus;
    });
  }, [dataList, searchText, fieldFilter, topicFilter, levelFilter, statusFilter]);

  const handlePreview = (question: Question) => {
    setSelectedQuestion(question);
    setFormDrawerVisible(true);
  };

  const handleEdit = (question: Question) => {
    setSelectedQuestion(question);
    setFormDrawerVisible(true);
  };

  const handleApprove = (questionId: string) => {
    // TODO: Implement approve logic
    console.log('Approve question:', questionId);
  };

  const handleReject = (questionId: string, rejectReason: string) => {
    // TODO: Implement reject logic
    console.log('Reject question:', questionId, 'Reason:', rejectReason);
  };

    const getAllFields = async () => {
    try {
      const res = await questionService.getAllFields();
      console.log('Fields:', res.content);
      const mappedFields = (res.content || []).map((item: {id: number, name?: string, description?: string}) => ({
        id: item.id.toString(),
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
      const mappedTopics = (res.content || []).map((item: {id: number, name?: string, description?: string, fieldId: number}) => ({
        id: item.id.toString(),
        fieldId: item.fieldId.toString(),
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
      const mappedLevels = (res.content || []).map((item: {id: number, name?: string, description?: string}) => ({
        id: item.id.toString(),
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
      const mappedTypes = (res.content || []).map((item: {id: string, description: string}) => ({
        id: item.id,
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
      let questions: Question[] = (res.content as Question[]) || [];
      questions = questions.filter((question) => question?.status !== 'APPROVED');
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
      <QuestionApprovalPageHeader />
      <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
        <QuestionApprovalToolbar
          searchText={searchText}
          onSearchChange={setSearchText}
          fieldFilter={fieldFilter}
          onFieldFilterChange={setFieldFilter}
          topicFilter={topicFilter}
          onTopicFilterChange={setTopicFilter}
          levelFilter={levelFilter}
          onLevelFilterChange={setLevelFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          selectedRowKeys={selectedRowKeys}
          fields={fieldData}
          topics={topicData}
          levels={levelData}
        />

        <QuestionApprovalTable
          dataList={filteredData}
          onPreview={handlePreview}
          onEdit={handleEdit}
           fields={fieldData}
          topics={topicData}
          levels={levelData}
          questionTypes={questionTypeData}
        />
      </div>

      <QuestionApprovalFormDrawer
        visible={formDrawerVisible}
        onClose={() => setFormDrawerVisible(false)}
        data={selectedQuestion}
        fields={fieldData}
        topics={topicData}
        levels={levelData}
        questionTypes={questionTypeData}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default QuestionApproval;
