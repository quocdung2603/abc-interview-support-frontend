import { useState } from 'react';
import {
  StatisticsCards,
  ResultsFilters,
  ResultsTable,
  CandidateDetailDrawer,
  EmptyState,
  NotVerifiedState,
  ResultsPageHeader,
} from './components';
import type {
  ResultsData,
  ExamOption,
  StatisticsData,
  FiltersData,
} from './components/types';

const ResultsPage: React.FC = () => {
  // State management
  const [filters, setFilters] = useState<FiltersData>({
    selectedExam: 'all',
    selectedStatus: 'all',
    searchText: '',
  });
  const [selectedCandidate, setSelectedCandidate] =
    useState<ResultsData | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  // Mock verification state - replace with actual auth context
  const isVerified = true;

  // Mock data
  const examOptions: ExamOption[] = [
    { id: 'all', title: 'Tất cả kỳ thi' },
    { id: '1', title: 'Frontend Developer Q1/2024' },
    { id: '2', title: 'Backend Developer' },
    { id: '3', title: 'Fullstack Developer' },
  ];

  const resultsData: ResultsData[] = [
    {
      id: '1',
      name: 'Nguyễn Văn An',
      email: 'an.nguyen@email.com',
      phone: '0901234567',
      examTitle: 'Frontend Developer Q1/2024',
      score: 85,
      rank: 1,
      duration: 75,
      correctAnswers: 21,
      totalQuestions: 25,
      accuracy: 84,
      submittedAt: '2024-01-20T14:30:00',
      status: 'passed',
      topicScores: [
        { name: 'JavaScript', score: 90 },
        { name: 'React', score: 85 },
        { name: 'HTML/CSS', score: 80 },
      ],
    },
    {
      id: '2',
      name: 'Trần Thị Bình',
      email: 'binh.tran@email.com',
      phone: '0901234568',
      examTitle: 'Frontend Developer Q1/2024',
      score: 78,
      rank: 2,
      duration: 85,
      correctAnswers: 19,
      totalQuestions: 25,
      accuracy: 76,
      submittedAt: '2024-01-20T15:45:00',
      status: 'passed',
      topicScores: [
        { name: 'JavaScript', score: 80 },
        { name: 'React', score: 75 },
        { name: 'HTML/CSS', score: 78 },
      ],
    },
    {
      id: '3',
      name: 'Lê Minh Cường',
      email: 'cuong.le@email.com',
      phone: '0901234569',
      examTitle: 'Frontend Developer Q1/2024',
      score: 65,
      rank: 3,
      duration: 90,
      correctAnswers: 16,
      totalQuestions: 25,
      accuracy: 64,
      submittedAt: '2024-01-20T16:20:00',
      status: 'passed',
      topicScores: [
        { name: 'JavaScript', score: 70 },
        { name: 'React', score: 60 },
        { name: 'HTML/CSS', score: 65 },
      ],
    },
    {
      id: '4',
      name: 'Phạm Thu Dung',
      email: 'dung.pham@email.com',
      phone: '0901234570',
      examTitle: 'Frontend Developer Q1/2024',
      score: 45,
      rank: 4,
      duration: 88,
      correctAnswers: 11,
      totalQuestions: 25,
      accuracy: 44,
      submittedAt: '2024-01-20T17:10:00',
      status: 'failed',
      topicScores: [
        { name: 'JavaScript', score: 50 },
        { name: 'React', score: 40 },
        { name: 'HTML/CSS', score: 45 },
      ],
    },
  ];

  // Statistics calculation
  const statisticsData: StatisticsData = {
    totalCandidates: resultsData.length,
    passedCandidates: resultsData.filter((r) => r.status === 'passed').length,
    averageScore: Math.round(
      resultsData.reduce((sum, r) => sum + r.score, 0) / resultsData.length
    ),
    passRate: Math.round(
      (resultsData.filter((r) => r.status === 'passed').length /
        resultsData.length) *
        100
    ),
  };

  // Filtered data
  const filteredData = resultsData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(filters.searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(filters.searchText.toLowerCase());
    const matchesStatus =
      filters.selectedStatus === 'all' ||
      item.status === filters.selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Handler functions
  const handleViewCandidate = (candidate: ResultsData) => {
    setSelectedCandidate(candidate);
    setDetailVisible(true);
  };

  const handleExportData = () => {
    console.log('Exporting results data...');
  };

  const handleFiltersChange = (key: keyof FiltersData, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleDateRangeChange = (dates: any) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: dates
        ? [dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')]
        : undefined,
    }));
  };

  // Show not verified state
  if (!isVerified) {
    return <NotVerifiedState />;
  }

  return (
    <div className="container-center animate-fade-in-up">
      <ResultsPageHeader onExportData={handleExportData} />

      <div className="page-content">
        <StatisticsCards data={statisticsData} />

        <ResultsFilters
          examOptions={examOptions}
          filters={filters}
          onExamChange={(value) => handleFiltersChange('selectedExam', value)}
          onStatusChange={(value) =>
            handleFiltersChange('selectedStatus', value)
          }
          onSearchChange={(value) => handleFiltersChange('searchText', value)}
          onDateRangeChange={handleDateRangeChange}
        />

        <div className="content-card">
          {filteredData.length > 0 ? (
            <ResultsTable
              data={filteredData}
              onViewCandidate={handleViewCandidate}
            />
          ) : (
            <EmptyState
              title="Chưa có kết quả thi nào"
              description="Kết quả thi sẽ hiển thị sau khi có thí sinh hoàn thành bài thi."
            />
          )}
        </div>
      </div>

      <CandidateDetailDrawer
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
        candidate={selectedCandidate}
      />
    </div>
  );
};

export default ResultsPage;
