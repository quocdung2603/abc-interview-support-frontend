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
  const [questionTypeFilter, setQuestionTypeFilter] = useState<string>('all');
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
      const matchesField = fieldFilter === 'all' || item?.fieldId === Number(fieldFilter);
      const matchesTopic = topicFilter === 'all' || item?.topicId === Number(topicFilter);
      const matchesLevel = levelFilter === 'all' || item?.levelId === Number(levelFilter);
      const matchesStatus = statusFilter === 'all' || item?.status === statusFilter;
      const matchesQuestionType = questionTypeFilter === 'all' || item?.questionTypeId === Number(questionTypeFilter);

      return matchesSearch && matchesField && matchesTopic && matchesLevel && matchesStatus && matchesQuestionType;
    });
  }, [dataList, searchText, fieldFilter, topicFilter, levelFilter, statusFilter, questionTypeFilter]);

  const handleReview = (question: Question) => {
    setSelectedQuestion(question);
    setFormDrawerVisible(true);
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
          questionTypeFilter={questionTypeFilter}
          onQuestionTypeFilterChange={setQuestionTypeFilter}
          questionTypes={questionTypeData}
        />

        <QuestionApprovalTable
          dataList={filteredData}
          onPreview={handleReview}
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
      />
    </div>
  );
};

export default QuestionApproval;
