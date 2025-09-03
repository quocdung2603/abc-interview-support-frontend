import { useState } from 'react';
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

const QuestionApproval = () => {
  // Mock data cho Field
  const mockFields: Field[] = [
    {
      fieldId: '1',
      fieldName: 'Frontend',
      description: 'Frontend Development',
    },
    { fieldId: '2', fieldName: 'Backend', description: 'Backend Development' },
    { fieldId: '3', fieldName: 'DevOps', description: 'DevOps Engineering' },
    { fieldId: '4', fieldName: 'Mobile', description: 'Mobile Development' },
    {
      fieldId: '5',
      fieldName: 'Data Science',
      description: 'Data Science & AI',
    },
  ];

  // Mock data cho Topic
  const mockTopics: Topic[] = [
    {
      topicId: '1',
      fieldId: '1',
      topicName: 'React',
      description: 'React Framework',
    },
    {
      topicId: '2',
      fieldId: '1',
      topicName: 'Vue.js',
      description: 'Vue.js Framework',
    },
    {
      topicId: '3',
      fieldId: '1',
      topicName: 'Angular',
      description: 'Angular Framework',
    },
    {
      topicId: '4',
      fieldId: '2',
      topicName: 'Node.js',
      description: 'Node.js Runtime',
    },
    {
      topicId: '5',
      fieldId: '2',
      topicName: 'Spring Boot',
      description: 'Spring Boot Framework',
    },
    {
      topicId: '6',
      fieldId: '2',
      topicName: 'Django',
      description: 'Django Framework',
    },
    {
      topicId: '7',
      fieldId: '3',
      topicName: 'Docker',
      description: 'Containerization',
    },
    {
      topicId: '8',
      fieldId: '3',
      topicName: 'Kubernetes',
      description: 'Container Orchestration',
    },
    {
      topicId: '9',
      fieldId: '4',
      topicName: 'React Native',
      description: 'Cross-platform Mobile',
    },
    {
      topicId: '10',
      fieldId: '4',
      topicName: 'Flutter',
      description: 'Flutter Framework',
    },
  ];

  // Mock data cho Level
  const mockLevels: Level[] = [
    { levelId: '1', levelName: 'Fresher', description: 'Beginner level' },
    { levelId: '2', levelName: 'Junior', description: 'Junior level' },
    { levelId: '3', levelName: 'Middle', description: 'Middle level' },
    { levelId: '4', levelName: 'Senior', description: 'Senior level' },
  ];

  // Mock data cho QuestionType
  const mockQuestionTypes: QuestionType[] = [
    {
      questionTypeId: '1',
      questionTypeName: 'SingleChoice',
      description: 'Single choice question',
    },
    {
      questionTypeId: '2',
      questionTypeName: 'MultipleChoice',
      description: 'Multiple choice question',
    },
    {
      questionTypeId: '3',
      questionTypeName: 'FillInTheBlank',
      description: 'Fill in the blank question',
    },
    {
      questionTypeId: '4',
      questionTypeName: 'OpenEnded',
      description: 'Open ended question',
    },
    {
      questionTypeId: '5',
      questionTypeName: 'Reference',
      description: 'Reference question',
    },
  ];

  // Mock data cho Question
  const mockQuestions: Question[] = Array.from({ length: 20 }, (_, i) => {
    const questionTitles = [
      'React Hook useEffect được sử dụng để làm gì?',
      'Trong JavaScript, phương thức nào được sử dụng để thêm phần tử vào cuối mảng?',
      'RESTful API là gì?',
      'Trong CSS, thuộc tính nào được sử dụng để tạo khoảng cách giữa các phần tử?',
      'Git command nào được sử dụng để tạo một commit mới?',
      'Trong SQL, mệnh đề nào được sử dụng để lọc dữ liệu?',
      'Docker container khác gì với Docker image?',
      'Trong React, lifecycle method nào được gọi sau khi component được render lần đầu?',
      'Algorithm nào có độ phức tạp thời gian O(n log n)?',
      'Trong HTML, thẻ nào được sử dụng để tạo hyperlink?',
    ];

    const questionVariants = [
      '1,2,3', // Có thể có nhiều variant
      '4',
      '5,6',
      '7',
      '8,9',
      '10',
      '11',
      '12',
      '13',
      '14',
    ];

    const createdAt = new Date(
      Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
    );

    const field = mockFields[Math.floor(Math.random() * mockFields.length)];
    const topic = mockTopics.filter((t) => t.fieldId === field.fieldId)[
      Math.floor(
        Math.random() *
          mockTopics.filter((t) => t.fieldId === field.fieldId).length
      )
    ];
    const level = mockLevels[Math.floor(Math.random() * mockLevels.length)];

    return {
      questionId: String(i + 1),
      userId: String(Math.floor(Math.random() * 10) + 1),
      topicId: topic?.topicId || '1',
      fieldId: field.fieldId,
      levelId: level.levelId,
      status: ['Pending', 'Approved', 'Rejected'][
        Math.floor(Math.random() * 3)
      ] as 'Pending' | 'Approved' | 'Rejected',
      questionTitle: questionTitles[i % questionTitles.length],
      questionVariant: questionVariants[i % questionVariants.length],
      similarityScore: Math.random() * 100,
      usefulVote: Math.floor(Math.random() * 50),
      unusefulVote: Math.floor(Math.random() * 10),
      createdAt,
    } as Question;
  });

  const [dataList] = useState<Question[]>(mockQuestions);
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

  const filteredData = dataList.filter((item) => {
    const matchesSearch = item.questionTitle
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesField = fieldFilter === 'all' || item.fieldId === fieldFilter;
    const matchesTopic = topicFilter === 'all' || item.topicId === topicFilter;
    const matchesLevel = levelFilter === 'all' || item.levelId === levelFilter;
    const matchesStatus =
      statusFilter === 'all' || item.status === statusFilter;

    return (
      matchesSearch &&
      matchesField &&
      matchesTopic &&
      matchesLevel &&
      matchesStatus
    );
  });

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
          fields={mockFields}
          topics={mockTopics}
          levels={mockLevels}
        />

        <QuestionApprovalTable
          dataList={filteredData}
          onPreview={handlePreview}
          onEdit={handleEdit}
          fields={mockFields}
          topics={mockTopics}
          levels={mockLevels}
          questionTypes={mockQuestionTypes}
        />
      </div>

      <QuestionApprovalFormDrawer
        visible={formDrawerVisible}
        onClose={() => setFormDrawerVisible(false)}
        data={selectedQuestion}
        fields={mockFields}
        topics={mockTopics}
        levels={mockLevels}
        questionTypes={mockQuestionTypes}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default QuestionApproval;
