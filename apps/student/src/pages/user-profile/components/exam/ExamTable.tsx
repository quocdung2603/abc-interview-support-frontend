import React, { useMemo, useState, useEffect } from 'react';
import { Table, Tag, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import ExamFilter from './ExamFilter';
import { Exam } from '@abc-interview-support-frontend/types';
import { questionService } from '@abc-interview-support-frontend/services';

interface Props {
  exams: Exam[];
  onJoin?: (id: number) => void; // Tham gia (Virtual)
  onOpen?: (id: number) => void; // Mở kết quả (Virtual)
  onDetails?: (id: number) => void; // Chi tiết
  onEnter?: (id: number) => void; // Vào thi (Recruiter)
  onInfo?: (id: number) => void; // Xem thông tin (Recruiter)
  onResult?: (id: number) => void; // Xem kết quả (Recruiter)
}

const parseJsonArray = (jsonString?: string | number[]): string[] => {
  if (!jsonString) return [];
  if (Array.isArray(jsonString)) {
    return jsonString.map(String);
  }
  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed)) return parsed.map(String);
    if (parsed && typeof parsed === 'object') return Object.keys(parsed);
    if (typeof parsed === 'string')
      return parsed.split(',').map((s) => s.trim());
    return [];
  } catch {
    return jsonString.split(',').map((s) => s.trim());
  }
};

type RuntimeState = 'UPCOMING' | 'ONGOING' | 'DONE';

const runtimeStateOf = (ex: Exam): RuntimeState => {
  if (ex.status === 'COMPLETED') return 'DONE';
  if (ex.status === 'ONGOING') return 'ONGOING';
  return 'UPCOMING'; // DRAFT or PUBLISHED
};

const ExamTable: React.FC<Props> = ({
  exams,
  onJoin,
  onOpen,
  onDetails,
  onEnter,
  onInfo,
  onResult,
}) => {
  // State cho options từ API
  const [fieldOptions, setFieldOptions] = useState<string[]>([]);
  const [topicOptions, setTopicOptions] = useState<string[]>([]);

  // Helper function to process API response
  const processResponse = (res: unknown): string[] => {
    if (!Array.isArray(res)) return [];
    const descriptions = res.map((item: unknown) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object' && 'description' in item) {
        return String((item as { description: unknown }).description);
      }
      return String(item);
    });
    // Remove duplicates
    return [...new Set(descriptions)];
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        console.log('Fetching options from API...');
        const [fieldsRes, topicsRes] = await Promise.all([
          questionService.getAllFields(),
          questionService.getAllTopics(),
        ]);

        setFieldOptions(processResponse(fieldsRes.content));
        setTopicOptions(processResponse(topicsRes.content));

        console.log('Options set successfully');
      } catch (error) {
        console.error('Failed to fetch options:', error);
        // Fallback to empty arrays
      }
    };
    fetchOptions();
  }, []);

  // State bộ lọc
  const [examType, setExamType] = useState<string>('');
  const [field, setField] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const resetFilters = () => {
    setExamType('');
    setField('');
    setTopic('');
    setSearch('');
  };

  // Áp dụng lọc
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (exams || []).filter((e: Exam) => {
      if (examType && e.examType !== examType) return false;
      if (field && e.position !== field) return false;
      if (topic) {
        const topics = parseJsonArray(e.topicIds);
        if (!topics.includes(topic)) return false;
      }

      if (term) {
        const hay = `${e.id} ${e.title} ${e.position || ''} ${e.language || ''
          }`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
  }, [exams, examType, field, topic, search]);

  // Exam type options
  const examTypeOptions = [
    { value: '', label: 'Tất cả loại' },
    { value: 'VIRTUAL', label: 'Phỏng vấn ảo' },
    { value: 'RECRUITER', label: 'Kiểm tra sơ loại' },
  ];

  // Columns configuration
  const columns: ColumnsType<Exam> = [
    {
      title: 'Bài kiểm tra',
      dataIndex: 'title',
      key: 'title',
      width: 250,
      render: (title: string, record: Exam) => (
        <div>
          <div className="font-semibold text-gray-900 truncate max-w-[200px]">
            {title}
          </div>
          <div className="text-xs text-gray-500">ID: {record.id}</div>
        </div>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'examType',
      key: 'examType',
      width: 150,
      align: 'center',
      render: (examType: string) => {
        const isVirtual = examType === 'VIRTUAL';
        const isPractice = examType === 'PRACTICE';
        return (
          <Tag color={isVirtual ? 'blue' : isPractice ? 'cyan' : 'purple'}>
            {isVirtual ? 'Phỏng Vấn Ảo' : isPractice ? 'Luyện Tập' : 'Sơ Loại'}
          </Tag>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      align: 'center',
      render: (_: string, record: Exam) => {
        const rt = runtimeStateOf(record);
        if (rt === 'UPCOMING') {
          return <Tag color="warning">Sắp diễn ra</Tag>;
        }
        if (rt === 'ONGOING') {
          return <Tag color="success">Đang diễn ra</Tag>;
        }
        return <Tag color="purple">Đã thi</Tag>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 250,
      align: 'center',
      render: (_: unknown, record: Exam) => {
        const rt = runtimeStateOf(record);
        const isVirtual = record.examType === 'VIRTUAL';

        return (
          <div className="flex gap-2 justify-center">
            {isVirtual ? (
              <>
                {rt === 'ONGOING' && (
                  <Button type="primary" size="small">
                    Thi lại
                  </Button>
                )}
                {rt === 'DONE' && (
                  <>
                    <Button
                      type="primary"
                      size="small"
                      style={{ backgroundColor: '#9333ea' }}
                      onClick={() => onResult?.(record.id)}
                    >
                      Kết quả
                    </Button>
                    <Button
                      type="link"
                      size="small"
                      onClick={() => onDetails?.(record.id)}
                    >
                      Chi tiết
                    </Button>
                  </>
                )}
                {rt === 'UPCOMING' && (
                  <Button
                    type="link"
                    size="small"
                    onClick={() => onDetails?.(record.id)}
                  >
                    Chi tiết
                  </Button>
                )}
              </>
            ) : (
              <>
                {rt === 'UPCOMING' && (
                  <Button type="link" size="small">
                    Xem thông tin
                  </Button>
                )}
                {rt === 'ONGOING' && (
                  <Button type="primary" size="small">
                    Vào thi
                  </Button>
                )}
                {rt === 'DONE' && (
                  <Button
                    type="primary"
                    size="small"
                    style={{ backgroundColor: '#9333ea' }}
                  >
                    Xem kết quả
                  </Button>
                )}
                <Button type="link" size="small">
                  Chi tiết
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <span aria-hidden className="text-lg">📝</span>
        <h3 className="text-lg font-semibold text-gray-800 m-0">
          Danh sách bài kiểm tra — {filtered.length} mục
        </h3>
      </div>

      <ExamFilter
        examType={examType}
        onExamTypeChange={setExamType}
        examTypeOptions={examTypeOptions}
        field={field}
        onFieldChange={setField}
        fieldOptions={fieldOptions}
        topic={topic}
        onTopicChange={setTopic}
        topicOptions={topicOptions}
        search={search}
        onSearchChange={setSearch}
        onReset={resetFilters}
      />

      <Table
        columns={columns}
        dataSource={filtered}
        rowKey="id"
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} mục`,
          locale: {
            items_per_page: '/ trang',
            jump_to: 'Đến trang',
            page: '',
          },
        }}
        locale={{
          emptyText: (
            <div className="py-8 text-center">
              <span className="text-4xl mb-2 block" role="img" aria-label="empty">
                📝
              </span>
              <p className="text-gray-500">Không có dữ liệu phù hợp bộ lọc.</p>
            </div>
          ),
        }}
        scroll={{ x: 1000 }}
      />
    </section>
  );
};

export default ExamTable;