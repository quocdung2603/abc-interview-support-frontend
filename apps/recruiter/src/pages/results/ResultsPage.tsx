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
import { examService, questionService } from '@abc-interview-support-frontend/services';
import { message } from 'antd';
import * as XLSX from 'xlsx';

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
  const [selectedExamData, setSelectedExamData] = useState<any>(null);

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
      // Fetch exam details
      const examDetails = await examService.getExamById(examId);

      // Fetch additional details for field, topic, level names
      const [allFields, allTopics, allLevels] = await Promise.all([
        questionService.getAllFields(),
        questionService.getAllTopics(),
        questionService.getAllLevels(),
      ]);

      const fields = allFields?.content || [];
      const topics = allTopics?.content || [];
      const levels = allLevels?.content || [];

      // Find names from IDs
      const field = fields.find((f: any) => f.id === examDetails.fieldId);
      const level = levels.find((l: any) => l.id === examDetails.levelId);

      // Handle multiple topics (topicIds is an array)
      const topicIds = examDetails.topicIds || [];
      const topicNames = topicIds
        .map((topicId: number) => {
          const topic = topics.find((t: any) => t.id === topicId);
          return topic?.name;
        })
        .filter((name: string | undefined) => name) // Remove undefined
        .join(', '); // Join with comma

      // Enrich exam data with names
      const enrichedExamData = {
        ...examDetails,
        fieldName: field?.name || 'N/A',
        topicName: topicNames || 'N/A',
        levelName: level?.name || 'N/A',
      };

      setSelectedExamData(enrichedExamData);

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
    if (!hasSearched || !selectedExamData) {
      message.warning('Vui lòng lọc kết quả bài kiểm tra trước khi xuất file');
      return;
    }

    try {
      // Create workbook
      const workbook = XLSX.utils.book_new();

      // Sheet 1: Thông tin bài kiểm tra
      const examInfoData = [
        ['THÔNG TIN BÀI KIỂM TRA'],
        [],
        ['Tên bài kiểm tra:', selectedExamData.title || 'N/A'],
        ['Mô tả:', selectedExamData.description || 'N/A'],
        ['Lĩnh vực:', selectedExamData.fieldName || 'N/A'],
        ['Chủ đề:', selectedExamData.topicName || 'N/A'],
        ['Cấp độ:', selectedExamData.levelName || 'N/A'],
        ['Thời gian làm bài:', `${selectedExamData.duration || 0} phút`],
        ['Số câu hỏi:', selectedExamData.questionCount || 0],
        ['Điểm đạt:', selectedExamData.passingScore || 0],
        ['Ngày tạo:', selectedExamData.createdAt ? new Date(selectedExamData.createdAt).toLocaleDateString('vi-VN') : 'N/A'],
        [],
        ['THỐNG KÊ TỔNG QUAN'],
        [],
        ['Tổng số thí sinh:', statisticsData.totalCandidates],
        ['Số thí sinh đạt:', statisticsData.passedCandidates],
        ['Điểm trung bình:', statisticsData.averageScore],
        ['Tỷ lệ đạt:', `${statisticsData.passRate}%`],
      ];
      const examInfoSheet = XLSX.utils.aoa_to_sheet(examInfoData);

      // Set column widths for exam info sheet
      examInfoSheet['!cols'] = [
        { wch: 25 },
        { wch: 50 }
      ];

      XLSX.utils.book_append_sheet(workbook, examInfoSheet, 'Thông tin bài kiểm tra');

      // Sheet 2: Danh sách kết quả
      const resultsHeaders = [
        'STT',
        'Họ và tên',
        'Email',
        'Điểm số',
        'Xếp hạng',
        'Độ chính xác (%)',
        'Trạng thái',
        'Thời gian nộp bài',
      ];

      const resultsRows = filteredData.map((result, index) => [
        index + 1,
        result.name,
        result.email,
        result.score,
        result.rank,
        result.accuracy,
        result.status === 'passed' ? 'Đạt' : 'Không đạt',
        result.submittedAt ? new Date(result.submittedAt).toLocaleString('vi-VN') : 'N/A',
      ]);

      const resultsData = [resultsHeaders, ...resultsRows];
      const resultsSheet = XLSX.utils.aoa_to_sheet(resultsData);

      // Set column widths for results sheet
      resultsSheet['!cols'] = [
        { wch: 5 },
        { wch: 25 },
        { wch: 30 },
        { wch: 10 },
        { wch: 10 },
        { wch: 15 },
        { wch: 15 },
        { wch: 20 },
      ];

      XLSX.utils.book_append_sheet(workbook, resultsSheet, 'Danh sách kết quả');

      // Sheet 3: Thông tin chi tiết thí sinh
      const candidateInfoHeaders = [
        'STT',
        'ID',
        'Họ và tên',
        'Email',
        'Số điện thoại',
        'Điểm số',
        'Xếp hạng',
        'Số câu đúng',
        'Tổng số câu',
        'Độ chính xác (%)',
        'Thời gian làm bài (phút)',
        'Trạng thái',
        'Thời gian nộp bài',
      ];

      const candidateInfoRows = filteredData.map((candidate, index) => [
        index + 1,
        candidate.id,
        candidate.name,
        candidate.email,
        candidate.phone || 'N/A',
        candidate.score,
        candidate.rank,
        candidate.correctAnswers,
        candidate.totalQuestions,
        candidate.accuracy,
        candidate.duration,
        candidate.status === 'passed' ? 'Đạt' : 'Không đạt',
        candidate.submittedAt ? new Date(candidate.submittedAt).toLocaleString('vi-VN') : 'N/A',
      ]);

      const candidateInfoData = [candidateInfoHeaders, ...candidateInfoRows];
      const candidateInfoSheet = XLSX.utils.aoa_to_sheet(candidateInfoData);

      // Set column widths for candidate info sheet
      candidateInfoSheet['!cols'] = [
        { wch: 5 },
        { wch: 10 },
        { wch: 25 },
        { wch: 30 },
        { wch: 15 },
        { wch: 10 },
        { wch: 10 },
        { wch: 12 },
        { wch: 12 },
        { wch: 15 },
        { wch: 20 },
        { wch: 15 },
        { wch: 20 },
      ];

      XLSX.utils.book_append_sheet(workbook, candidateInfoSheet, 'Thông tin thí sinh');

      // Generate filename with exam title and timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `KetQua_${selectedExamData.title || 'BaiKiemTra'}_${timestamp}.xlsx`;

      // Write file
      XLSX.writeFile(workbook, filename);

      message.success('Đã xuất file thành công!');
    } catch (error) {
      console.error('Error exporting data:', error);
      message.error('Không thể xuất file. Vui lòng thử lại.');
    }
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
      <ResultsPageHeader
        onExportData={handleExportData}
        hasSearched={hasSearched}
      />

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
