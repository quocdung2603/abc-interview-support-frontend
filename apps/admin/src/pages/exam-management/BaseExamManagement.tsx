import { useState, useEffect, useMemo } from 'react';
import {
  BaseExamPageHeader,
  BaseExamPreviewDrawer,
  BaseExamTable,
  BaseExamToolbar,
} from './components/base-exam';
import { Exam, Field, Level, Topic } from '@abc-interview-support-frontend/types';
import { Dayjs } from 'dayjs';
import { examService, questionService } from '@abc-interview-support-frontend/services';

const BaseExamManagement = () => {
  const [dataList, setDataList] = useState<Exam[]>([]);
  const [previewDrawerVisible, setPreviewDrawerVisible] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [filters, setFilters] = useState<{
    searchText?: string;
    status?: string;
    position?: string;
    fieldId?: number;
    topicIds?: number[];
    levelId?: number;
    dateRange?: [Dayjs, Dayjs];
  }>({});

  const handleViewExam = (exam: Exam) => {
    console.log('Opening preview for base exam:', exam);
    setSelectedExam(exam);
    setPreviewDrawerVisible(true);
  };

  const handleFilterChange = (newFilters: {
    searchText?: string;
    status?: string;
    position?: string;
    fieldId?: number;
    topicIds?: number[];
    levelId?: number;
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

    if (filters.fieldId) {
      filtered = filtered.filter((exam) => exam.fieldId === filters.fieldId);
    }

    if (filters.topicIds && filters.topicIds.length > 0) {
      filtered = filtered.filter((exam) => {
        const examTopicIds = exam.topicIds || [];
        const filterTopicIds = filters.topicIds || [];
        return examTopicIds.some(topicId => filterTopicIds.includes(topicId));
      });
    }

    if (filters.levelId) {
      filtered = filtered.filter((exam) => exam.levelId === filters.levelId);
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
      exams = exams.filter((exam) => exam?.examType === examTypes && exam?.status === 'PUBLISHED');
      console.log('All Exams:', exams);
      setDataList(exams);
    } catch (error) {
      console.error('Error fetching exams:', error);
      setDataList([]);
    }
  }

  const loadFilterData = async () => {
    try {
      const [fieldsRes, topicsRes, levelsRes] = await Promise.all([
        questionService.getAllFields(),
        questionService.getAllTopics(),
        questionService.getAllLevels()
      ]);
      setFields(fieldsRes.content || []);
      setTopics(topicsRes.content || []);
      setLevels(levelsRes.content || []);
    } catch (error) {
      console.error('Error loading filter data:', error);
    }
  }

  useEffect(() => {
    getAllExams("RECRUITER");
    loadFilterData();
  }, [])

  return (
    <div className="container-center animate-fade-in-up">
      <BaseExamPageHeader />
      <div className="card-elevated" style={{ padding: 'var(--spacing-lg)' }}>
        <BaseExamToolbar
          onFilterChange={handleFilterChange}
          fields={fields}
          topics={topics}
          levels={levels}
        />
        <BaseExamTable
          data={filteredExams}
          onView={handleViewExam}
          fields={fields}
          topics={topics}
          levels={levels}
        />
      </div>
      <BaseExamPreviewDrawer
        visible={previewDrawerVisible}
        onClose={() => setPreviewDrawerVisible(false)}
        data={selectedExam}
        fields={fields}
        topics={topics}
        levels={levels}
      />
    </div>
  );
};

export default BaseExamManagement;
