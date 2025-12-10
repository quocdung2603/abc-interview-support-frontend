import { useState, useEffect } from 'react';
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
import { examService } from '@abc-interview-support-frontend/services';
import { message, Button } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

const ResultsPage: React.FC = () => {
  // State management
  const [filters, setFilters] = useState<FiltersData>({
    selectedExam: '',
    selectedStatus: 'all',
    searchText: '',
  });
  const [selectedCandidate, setSelectedCandidate] =
    useState<ResultsData | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  // New state for API integration
  const [examOptions, setExamOptions] = useState<ExamOption[]>([]);
  const [resultsData, setResultsData] = useState<ResultsData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Mock verification state - replace with actual auth context
  const isVerified = true;

  // Load exam options on component mount
  useEffect(() => {
    const loadExamOptions = async () => {
      try {
        const examsResponse = await examService.getAllExams();
        const exams = examsResponse?.content || [];

        const options: ExamOption[] = [
          { id: '', title: 'Chọn kỳ thi...' },
          ...exams.map((exam: any) => ({
            id: exam.id.toString(),
            title: exam.title,
          })),
        ];

        setExamOptions(options);
      } catch (error) {
        console.error('Error loading exams:', error);
        message.error('Không thể tải danh sách kỳ thi');
      }
    };

    loadExamOptions();
  }, []);

  // Function to fetch exam results
  const fetchExamResults = async (examId: string) => {
    if (!examId) return;

    setLoading(true);
    try {
      const response = await examService.getAllExamResults(examId);
      const rawResults = response?.content || [];

      // Process results: group by userId and take best score
      const userBestResults = new Map<number, any>();

      rawResults.forEach((result: any) => {
        const userId = result.userId;
        const existing = userBestResults.get(userId);

        if (!existing || result.score > existing.score) {
          userBestResults.set(userId, result);
        }
      });

      // Convert to ResultsData format
      const processedResults: ResultsData[] = Array.from(userBestResults.values()).map((result: any, index: number) => ({
        id: result.id.toString(),
        name: `User ${result.userId}`, // TODO: Get actual user name from user service
        email: `user${result.userId}@example.com`, // TODO: Get actual email
        phone: '', // TODO: Get actual phone
        examTitle: `Exam ${result.examId}`, // TODO: Get actual exam title
        score: result.score,
        rank: index + 1,
        duration: 0, // TODO: Calculate duration if available
        correctAnswers: 0, // TODO: Calculate from score if possible
        totalQuestions: 0, // TODO: Get from exam data
        accuracy: result.score, // Assuming score is percentage
        submittedAt: result.completedAt,
        status: result.passStatus ? 'passed' : 'failed',
        topicScores: [], // TODO: Get topic scores if available
      }));

      // Sort by passStatus (true first) then by score descending
      processedResults.sort((a, b) => {
        if (a.status === 'passed' && b.status === 'failed') return -1;
        if (a.status === 'failed' && b.status === 'passed') return 1;
        return b.score - a.score;
      });

      // Update ranks after sorting
      processedResults.forEach((result, index) => {
        result.rank = index + 1;
      });

      setResultsData(processedResults);
      setHasSearched(true);
    } catch (error) {
      console.error('Error fetching exam results:', error);
      message.error('Không thể tải kết quả thi');
    } finally {
      setLoading(false);
    }
  };

  // Statistics calculation
  const statisticsData: StatisticsData = {
    totalCandidates: resultsData.length,
    passedCandidates: resultsData.filter((r) => r.status === 'passed').length,
    averageScore: resultsData.length > 0 ? Math.round(
      resultsData.reduce((sum, r) => sum + r.score, 0) / resultsData.length
    ) : 0,
    passRate: resultsData.length > 0 ? Math.round(
      (resultsData.filter((r) => r.status === 'passed').length /
        resultsData.length) *
      100
    ) : 0,
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

  const handleFilterResults = () => {
    if (!filters.selectedExam) {
      message.warning('Vui lòng chọn kỳ thi trước khi lọc');
      return;
    }
    fetchExamResults(filters.selectedExam);
  };

  // Show not verified state
  if (!isVerified) {
    return <NotVerifiedState />;
  }

  return (
    <div className="container-center animate-fade-in-up">
      <ResultsPageHeader onExportData={handleExportData} />

      <div className="page-content">
        <ResultsFilters
          examOptions={examOptions}
          filters={filters}
          onExamChange={(value) => handleFiltersChange('selectedExam', value)}
          onStatusChange={(value) =>
            handleFiltersChange('selectedStatus', value)
          }
          onSearchChange={(value) => handleFiltersChange('searchText', value)}
          onDateRangeChange={handleDateRangeChange}
          onFilter={handleFilterResults}
          loading={loading}
        />

        {hasSearched && (
          <>
            <StatisticsCards data={statisticsData} />

            <div className="content-card">
              {filteredData.length > 0 ? (
                <ResultsTable
                  data={filteredData}
                  onViewCandidate={handleViewCandidate}
                />
              ) : (
                <EmptyState
                  title="Không tìm thấy kết quả"
                  description="Không có thí sinh nào phù hợp với bộ lọc đã chọn."
                />
              )}
            </div>
          </>
        )}

        {!hasSearched && (
          <div className="content-card">
            <EmptyState
              title="Chọn kỳ thi để xem kết quả"
              description="Vui lòng chọn kỳ thi từ dropdown và nhấn nút 'Lọc' để xem kết quả của các thí sinh."
            />
          </div>
        )}
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
