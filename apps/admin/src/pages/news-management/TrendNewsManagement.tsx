import { News, Field, Topic } from '@abc-interview-support-frontend/types';

import { useState, useEffect } from 'react';
import confirm from 'antd/es/modal/confirm';
import {
  TrendNewsPageHeader,
  TrendNewsPreviewDrawer,
  TrendNewsTable,
  TrendNewsToolbar,
} from './components/trend-news';

const TrendNewsManagement = () => {
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

  // Mock data cho News với newsType: 'trend'
  const mockNewsData: News[] = Array.from({ length: 8 }, (_, i) => {
    const titles = [
      'React 19 chính thức ra mắt với nhiều tính năng mới',
      'Node.js 22 LTS được phát hành với performance cải thiện',
      'Docker Desktop 2024 có gì mới?',
      'Spring Boot 3.2 với hỗ trợ Java 21',
      'Vue.js 3.4 ra mắt với Composition API cải tiến',
      'Kubernetes 1.30 tập trung vào security',
      'Flutter 3.22 với Dart 3.4',
      'Angular 18 với standalone components',
    ];

    const contents = [
      'React 19 mang đến nhiều cải tiến về performance và developer experience. Các tính năng mới bao gồm React Compiler, Server Components cải tiến, và Actions API.',
      'Node.js 22 LTS được phát hành với nhiều cải thiện về performance, memory usage và security. Phiên bản này cũng hỗ trợ các tính năng mới nhất của JavaScript.',
      'Docker Desktop 2024 giới thiệu giao diện mới, cải thiện performance và hỗ trợ tốt hơn cho Apple Silicon. Các tính năng AI và DevEx cũng được tích hợp.',
      'Spring Boot 3.2 mang đến hỗ trợ đầy đủ cho Java 21, cải thiện về performance và security. Framework này cũng có nhiều cải tiến về testing và monitoring.',
      'Vue.js 3.4 tập trung vào cải thiện Composition API, performance và developer experience. Các tính năng mới giúp code dễ đọc và maintain hơn.',
      'Kubernetes 1.30 tập trung vào security với nhiều cải tiến về authentication, authorization và network policies. Performance cũng được cải thiện đáng kể.',
      'Flutter 3.22 với Dart 3.4 mang đến nhiều cải tiến về performance và UI. Framework này cũng hỗ trợ tốt hơn cho web và desktop platforms.',
      'Angular 18 tiếp tục phát triển standalone components với nhiều cải tiến về build performance và developer experience.',
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

    return {
      newsId: String(i + 1),
      userId: String(Math.floor(Math.random() * 5) + 1), // Random user ID
      newsType: 'trend',
      title: titles[i],
      content: contents[i],
      fieldId: field.fieldId,
      topicId: topic?.topicId,
      createdAt,
    } as News;
  });

  const [dataList] = useState<News[]>(mockNewsData);
  const [searchText, setSearchText] = useState('');
  const [fieldFilter, setFieldFilter] = useState<string>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [selectedRowKeys] = useState<React.Key[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<News | null>(null);

  // Reset topic filter khi field thay đổi
  useEffect(() => {
    if (fieldFilter !== 'all') {
      setTopicFilter('all');
    }
  }, [fieldFilter]);

  const filteredData = dataList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.content.toLowerCase().includes(searchText.toLowerCase());
    const matchesField = fieldFilter === 'all' || item.fieldId === fieldFilter;
    const matchesTopic = topicFilter === 'all' || item.topicId === topicFilter;

    return matchesSearch && matchesField && matchesTopic;
  });

  const handleDelete = (newsId: string) => {
    console.log('Delete news:', newsId);
    confirm({
      title: 'Bạn có chắc muốn xóa tin tức này?',
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xác nhận',
      okType: 'danger',
      maskClosable: true,
      closable: true,
      onOk() {
        // API call to delete news
        console.log('News deleted:', newsId);
      },
      cancelText: 'Hủy',
    });
  };

  const handlePreview = (data: News) => {
    setPreviewVisible(true);
    setSelectedItem(data);
  };

  return (
    <div className="container-center animate-fade-in-up">
      <TrendNewsPageHeader />

      <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
        <TrendNewsToolbar
          searchText={searchText}
          onSearchChange={setSearchText}
          fieldFilter={fieldFilter}
          onFieldFilterChange={setFieldFilter}
          topicFilter={topicFilter}
          onTopicFilterChange={setTopicFilter}
          selectedRowKeys={selectedRowKeys}
          fields={mockFields}
          topics={mockTopics}
        />

        <TrendNewsTable
          dataList={filteredData}
          onPreview={handlePreview}
          onDelete={handleDelete}
          fields={mockFields}
          topics={mockTopics}
        />
      </div>

      <TrendNewsPreviewDrawer
        data={selectedItem}
        onClose={() => setPreviewVisible(false)}
        visible={previewVisible}
        fields={mockFields}
        topics={mockTopics}
      />
    </div>
  );
};

export default TrendNewsManagement;
