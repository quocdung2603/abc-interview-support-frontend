import { useState, useEffect, useMemo } from 'react';
import {
  MockExamPageHeader,
  MockExamPreviewDrawer,
  MockExamTable,
  MockExamToolbar,
} from './components/mock-exam';
import { Exam } from '@abc-interview-support-frontend/types';
import { Dayjs } from 'dayjs';
import { examService } from '@abc-interview-support-frontend/services';

const MockExamManagement = () => {
  const [dataList, setDataList] = useState<Exam[]>([]);
  const [previewDrawerVisible, setPreviewDrawerVisible] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [filters, setFilters] = useState<{
    searchText?: string;
    status?: string;
    position?: string;
    dateRange?: [Dayjs, Dayjs];
  }>({});

  const handleViewExam = (exam: Exam) => {
    console.log('Opening preview for mock exam:', exam);
    setSelectedExam(exam);
    setPreviewDrawerVisible(true);
  };

  const handleFilterChange = (newFilters: {
    searchText?: string;
    status?: string;
    position?: string;
    dateRange?: [Dayjs, Dayjs];
  }) => {
    setFilters(newFilters);
  };

  const filteredExams = useMemo(() => {
    let filtered = dataList;

    if (filters.searchText) {
      filtered = filtered.filter((exam) =>
        exam.title.toLowerCase().includes(filters.searchText?.toLowerCase() || '')
      );
    }

    if (filters.status) {
      filtered = filtered.filter((exam) => exam.status === filters.status);
    }

    if (filters.position) {
      filtered = filtered.filter((exam) => exam.position === filters.position);
    }

    if (filters.dateRange) {
      const [startDate, endDate] = filters.dateRange;
      filtered = filtered.filter((exam) => {
        const examDate = new Date(exam.createdAt);
        return examDate >= startDate.toDate() && examDate <= endDate.toDate();
      });
    }

    return filtered;
  }, [dataList, filters]);

  const getAllExams = async (examTypes: string) => {
    try {
      const res = await examService.getAllExams();
      console.log(res);
      let exams: Exam[] = (res.content as Exam[]) || [];
      exams = exams.filter((exam) => exam?.examType === examTypes);
      console.log('All Mock Exams:', exams);
      setDataList(exams);
    } catch (error) {
      console.error('Error fetching mock exams:', error);
      setDataList([]);
    }
  }

  useEffect(() => {
    getAllExams("VIRTUAL");
  }, [])

  return (
    <div className="container-center animate-fade-in-up">
      <MockExamPageHeader />
      <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
        <MockExamToolbar onFilterChange={handleFilterChange} />
        <MockExamTable data={filteredExams} onView={handleViewExam} />
      </div>
      <MockExamPreviewDrawer
        visible={previewDrawerVisible}
        onClose={() => setPreviewDrawerVisible(false)}
        data={selectedExam}
      />
    </div>
  );
};

export default MockExamManagement;
