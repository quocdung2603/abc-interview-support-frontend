import { useState } from 'react';
import {
  NewsApprovalFormDrawer,
  NewsApprovalPageHeader,
  NewsApprovalTable,
  NewsApprovalToolbar,
} from './components/news-approval';
import { News, Field, Topic } from '@abc-interview-support-frontend/types';

const NewsApproval = () => {
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

  // Mock data cho News với các trạng thái khác nhau
  const MockData: News[] = Array.from({ length: 15 }, (_, i) => {
    const trendTitles = [
      'React 19 chính thức ra mắt với nhiều tính năng mới',
      'Node.js 22 LTS được phát hành với performance cải thiện',
      'Docker Desktop 2024 có gì mới?',
      'Spring Boot 3.2 với hỗ trợ Java 21',
      'Vue.js 3.4 ra mắt với Composition API cải tiến',
      'Kubernetes 1.30 tập trung vào security',
      'Flutter 3.22 với Dart 3.4',
      'Angular 18 với standalone components',
    ];

    const recruitmentTitles = [
      'FPT Software tuyển dụng 500 lập trình viên React/Vue.js',
      'VNG Corporation mở vị trí Senior Backend Developer',
      'Shopee Việt Nam tuyển dụng fresher Frontend Developer',
      'Tiki tuyển dụng Data Engineer với lương lên đến 50 triệu',
      'Garena Việt Nam mở 20 vị trí Game Developer',
      'Viettel tuyển dụng DevOps Engineer tại Hà Nội',
      'Zalo tuyển dụng Mobile Developer (React Native)',
    ];

    const trendContents = [
      'React 19 mang đến nhiều cải tiến về performance và developer experience. Các tính năng mới bao gồm React Compiler, Server Components cải tiến, và Actions API.',
      'Node.js 22 LTS được phát hành với nhiều cải thiện về performance, memory usage và security. Phiên bản này cũng hỗ trợ các tính năng mới nhất của JavaScript.',
      'Docker Desktop 2024 giới thiệu giao diện mới, cải thiện performance và hỗ trợ tốt hơn cho Apple Silicon. Các tính năng AI và DevEx cũng được tích hợp.',
      'Spring Boot 3.2 mang đến hỗ trợ đầy đủ cho Java 21, cải thiện về performance và security. Framework này cũng có nhiều cải tiến về testing và monitoring.',
      'Vue.js 3.4 tập trung vào cải thiện Composition API, performance và developer experience. Các tính năng mới giúp code dễ đọc và maintain hơn.',
      'Kubernetes 1.30 tập trung vào security với nhiều cải tiến về authentication, authorization và network policies. Performance cũng được cải thiện đáng kể.',
      'Flutter 3.22 với Dart 3.4 mang đến nhiều cải tiến về performance và UI. Framework này cũng hỗ trợ tốt hơn cho web và desktop platforms.',
      'Angular 18 tiếp tục phát triển standalone components với nhiều cải tiến về build performance và developer experience.',
    ];

    const recruitmentContents = [
      'FPT Software đang có nhu cầu tuyển dụng 500 lập trình viên Frontend với các công nghệ React, Vue.js, Angular. Yêu cầu: Tốt nghiệp Đại học CNTT, có kinh nghiệm 1-3 năm, lương từ 15-35 triệu/tháng + thưởng.',
      'VNG Corporation cần tuyển Senior Backend Developer cho dự án lớn. Yêu cầu: Kinh nghiệm 3+ năm với Node.js/Spring Boot, có kiến thức về microservices và cloud. Lương: 30-50 triệu + stock options.',
      'Shopee Việt Nam mở cơ hội cho các bạn fresher Frontend Developer. Không yêu cầu kinh nghiệm, sẽ được training 3 tháng. Công nghệ: React, TypeScript, lương khởi điểm 12 triệu/tháng.',
      'Tiki cần tuyển Data Engineer để xử lý big data. Yêu cầu: Kinh nghiệm với Hadoop/Spark, Python, SQL. Lương lên đến 50 triệu/tháng + thưởng performance.',
      'Garena Việt Nam tuyển dụng 20 Game Developer cho các dự án game mobile. Yêu cầu: Kinh nghiệm Unity/Unreal Engine, C#, lương cạnh tranh trong ngành game.',
      'Viettel tuyển dụng DevOps Engineer tại Hà Nội. Yêu cầu: Kinh nghiệm với Docker, Kubernetes, AWS/Azure. Lương: 25-40 triệu/tháng + phúc lợi tốt.',
      'Zalo cần tuyển Mobile Developer sử dụng React Native. Yêu cầu: 2+ năm kinh nghiệm, có portfolio app đã publish. Lương: 20-35 triệu/tháng.',
    ];

    const locations = [
      'Hà Nội',
      'TP.HCM',
      'Đà Nẵng',
      'Hải Phòng',
      'Cần Thơ',
      'Hà Nội & TP.HCM',
      'Toàn quốc',
    ];

    const statuses: ('Pending' | 'Approve' | 'Reject')[] = [
      'Pending',
      'Approve',
      'Reject',
    ];
    const newsTypes: ('trend' | 'recruitment')[] = ['trend', 'recruitment'];

    const newsType = newsTypes[Math.floor(Math.random() * newsTypes.length)];
    const isTrend = newsType === 'trend';

    const title = isTrend
      ? trendTitles[Math.floor(Math.random() * trendTitles.length)]
      : recruitmentTitles[Math.floor(Math.random() * recruitmentTitles.length)];

    const content = isTrend
      ? trendContents[Math.floor(Math.random() * trendContents.length)]
      : recruitmentContents[
          Math.floor(Math.random() * recruitmentContents.length)
        ];

    const status = statuses[Math.floor(Math.random() * statuses.length)];
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

    return {
      newsId: String(i + 1),
      userId: String(Math.floor(Math.random() * 10) + 1),
      newsType,
      title,
      content,
      location: isTrend
        ? undefined
        : locations[Math.floor(Math.random() * locations.length)],
      fieldId: field.fieldId,
      topicId: topic?.topicId,
      createdAt,
      status,
      rejectReason:
        status === 'Reject'
          ? 'Nội dung không phù hợp với chính sách của hệ thống'
          : undefined,
    } as News;
  });

  const [dataList, setDataList] = useState<News[]>(MockData);
  const [searchText, setSearchText] = useState('');
  const [fieldFilter, setFieldFilter] = useState<string>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [newsTypeFilter, setNewsTypeFilter] = useState<string>('all');
  const [selectedRowKeys] = useState<React.Key[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<News | null>(null);

  const filteredData = dataList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.content.toLowerCase().includes(searchText.toLowerCase());
    const matchesField = fieldFilter === 'all' || item.fieldId === fieldFilter;
    const matchesTopic = topicFilter === 'all' || item.topicId === topicFilter;
    const matchesLocation =
      locationFilter === 'all' || item.location === locationFilter;
    const matchesStatus =
      statusFilter === 'all' || item.status === statusFilter;
    const matchesNewsType =
      newsTypeFilter === 'all' || item.newsType === newsTypeFilter;

    return (
      matchesSearch &&
      matchesField &&
      matchesTopic &&
      matchesLocation &&
      matchesStatus &&
      matchesNewsType
    );
  });

  const handleApprove = (data: News) => {
    setDataList((prev) =>
      prev.map((item) =>
        item.newsId === data.newsId
          ? { ...item, status: 'Approve' as const }
          : item
      )
    );
  };

  const handleReject = (data: News, reason: string) => {
    setDataList((prev) =>
      prev.map((item) =>
        item.newsId === data.newsId
          ? { ...item, status: 'Reject' as const, rejectReason: reason }
          : item
      )
    );
  };

  const handlePreview = (data: News) => {
    setPreviewVisible(true);
    setSelectedItem(data);
  };

  return (
    <div className="container-center animate-fade-in-up">
      <NewsApprovalPageHeader />

      <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
        <NewsApprovalToolbar
          fields={mockFields}
          fieldFilter={fieldFilter}
          locationFilter={locationFilter}
          onLocationFilterChange={setLocationFilter}
          searchText={searchText}
          onSearchChange={setSearchText}
          onFieldFilterChange={setFieldFilter}
          onTopicFilterChange={setTopicFilter}
          topicFilter={topicFilter}
          topics={mockTopics}
          selectedRowKeys={selectedRowKeys}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          newsTypeFilter={newsTypeFilter}
          onNewsTypeFilterChange={setNewsTypeFilter}
        />
        <NewsApprovalTable
          dataList={filteredData}
          onPreview={handlePreview}
          onApprove={handleApprove}
          fields={mockFields}
          topics={mockTopics}
        />
      </div>

      <NewsApprovalFormDrawer
        visible={previewVisible}
        onClose={() => setPreviewVisible(false)}
        data={selectedItem}
        onApprove={handleApprove}
        onReject={handleReject}
        fields={mockFields}
        topics={mockTopics}
      />
    </div>
  );
};

export default NewsApproval;
