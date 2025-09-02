import { News, Field, Topic } from '@abc-interview-support-frontend/types';

import { useState, useEffect } from 'react';
import confirm from 'antd/es/modal/confirm';
import {
  RecruitmentNewsPageHeader,
  RecruitmentNewsPreviewDrawer,
  RecruitmentNewsTable,
  RecruitmentNewsToolbar,
} from './components/recruitment-news';

const RecruitmentNewsManagement = () => {
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

  // Mock data cho News với newsType: 'recruitment'
  const mockNewsData: News[] = Array.from({ length: 10 }, (_, i) => {
    const titles = [
      'FPT Software tuyển dụng 500 lập trình viên React/Vue.js',
      'VNG Corporation mở vị trí Senior Backend Developer',
      'Shopee Việt Nam tuyển dụng fresher Frontend Developer',
      'Tiki tuyển dụng Data Engineer với lương lên đến 50 triệu',
      'Garena Việt Nam mở 20 vị trí Game Developer',
      'Viettel tuyển dụng DevOps Engineer tại Hà Nội',
      'Zalo tuyển dụng Mobile Developer (React Native)',
      'TopCV tổ chức Job Fair công nghệ với 50+ công ty tham gia',
      'Sun* Inc tuyển dụng Senior Fullstack Developer',
      'VNPay mở vị trí Security Engineer với lương hấp dẫn',
    ];

    const contents = [
      'FPT Software đang có nhu cầu tuyển dụng 500 lập trình viên Frontend với các công nghệ React, Vue.js, Angular. Yêu cầu: Tốt nghiệp Đại học CNTT, có kinh nghiệm 1-3 năm, lương từ 15-35 triệu/tháng + thưởng.',
      'VNG Corporation cần tuyển Senior Backend Developer cho dự án lớn. Yêu cầu: Kinh nghiệm 3+ năm với Node.js/Spring Boot, có kiến thức về microservices và cloud. Lương: 30-50 triệu + stock options.',
      'Shopee Việt Nam mở cơ hội cho các bạn fresher Frontend Developer. Không yêu cầu kinh nghiệm, sẽ được training 3 tháng. Công nghệ: React, TypeScript, lương khởi điểm 12 triệu/tháng.',
      'Tiki cần tuyển Data Engineer để xử lý big data. Yêu cầu: Kinh nghiệm với Hadoop/Spark, Python, SQL. Lương lên đến 50 triệu/tháng + thưởng performance.',
      'Garena Việt Nam tuyển dụng 20 Game Developer cho các dự án game mobile. Yêu cầu: Kinh nghiệm Unity/Unreal Engine, C#, lương cạnh tranh trong ngành game.',
      'Viettel tuyển dụng DevOps Engineer tại Hà Nội. Yêu cầu: Kinh nghiệm với Docker, Kubernetes, AWS/Azure. Lương: 25-40 triệu/tháng + phúc lợi tốt.',
      'Zalo cần tuyển Mobile Developer sử dụng React Native. Yêu cầu: 2+ năm kinh nghiệm, có portfolio app đã publish. Lương: 20-35 triệu/tháng.',
      'TopCV tổ chức Job Fair công nghệ quy mô lớn với sự tham gia của 50+ công ty CNTT hàng đầu Việt Nam. Cơ hội gặp gỡ trực tiếp, phỏng vấn onsite cho các vị trí developer.',
      'Sun* Inc tuyển dụng Senior Fullstack Developer. Yêu cầu: MERN stack, 4+ năm kinh nghiệm, khả năng làm việc độc lập. Lương: 35-55 triệu/tháng.',
      'VNPay mở vị trí Security Engineer. Yêu cầu: Kinh nghiệm cybersecurity, penetration testing, các chứng chỉ bảo mật. Lương hấp dẫn + thưởng.',
    ];

    const locations = [
      'Hà Nội',
      'TP.HCM',
      'Đà Nẵng',
      'Hải Phòng',
      'Cần Thơ',
      'Hà Nội & TP.HCM',
      'Toàn quốc',
      'Hà Nội',
      'TP.HCM',
      'Hà Nội',
    ];

    const createdAt = new Date(
      Date.now() - Math.floor(Math.random() * 15 * 24 * 60 * 60 * 1000)
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
      newsType: 'recruitment',
      title: titles[i],
      content: contents[i],
      location: locations[i],
      fieldId: field.fieldId,
      topicId: topic?.topicId,
      createdAt,
    } as News;
  });

  const [dataList] = useState<News[]>(mockNewsData);
  const [searchText, setSearchText] = useState('');
  const [fieldFilter, setFieldFilter] = useState<string>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
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
    const matchesLocation =
      locationFilter === 'all' || item.location === locationFilter;

    return matchesSearch && matchesField && matchesTopic && matchesLocation;
  });

  const handleDelete = (newsId: string) => {
    console.log('Delete news:', newsId);
    confirm({
      title: 'Bạn có chắc muốn xóa tin tuyển dụng này?',
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
      <RecruitmentNewsPageHeader />

      <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
        <RecruitmentNewsToolbar
          searchText={searchText}
          onSearchChange={setSearchText}
          fieldFilter={fieldFilter}
          onFieldFilterChange={setFieldFilter}
          topicFilter={topicFilter}
          onTopicFilterChange={setTopicFilter}
          locationFilter={locationFilter}
          onLocationFilterChange={setLocationFilter}
          selectedRowKeys={selectedRowKeys}
          fields={mockFields}
          topics={mockTopics}
        />

        <RecruitmentNewsTable
          dataList={filteredData}
          onPreview={handlePreview}
          onDelete={handleDelete}
          fields={mockFields}
          topics={mockTopics}
        />
      </div>

      <RecruitmentNewsPreviewDrawer
        data={selectedItem}
        onClose={() => setPreviewVisible(false)}
        visible={previewVisible}
        fields={mockFields}
        topics={mockTopics}
      />
    </div>
  );
};

export default RecruitmentNewsManagement;
