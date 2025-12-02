import React, { useMemo, useState, useEffect } from 'react';
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

const tableShell: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.875rem', // text-sm equivalent
};

const badgeBase: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '2px 8px',
  borderRadius: '999px',
  fontSize: '0.75rem', // text-xs equivalent
  lineHeight: 1.4,
  marginRight: 6,
  marginBottom: 6,
  backgroundColor: 'var(--color-neutral-100)',
  color: 'var(--color-neutral-700)',
};

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

const formatDateTime = (d?: Date) =>
  d
    ? new Date(d).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
    : '—';

const formatDuration = (minutes?: number) => {
  if (!minutes && minutes !== 0) return '—';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

type RuntimeState = 'UPCOMING' | 'ONGOING' | 'DONE' | 'INACTIVE';

const runtimeStateOf = (ex: Exam, now = new Date()): RuntimeState => {
  // Since Exam interface doesn't have startTime/endTime, we'll use status-based logic
  if (ex.status === 'COMPLETED') return 'DONE';
  if (ex.status === 'INACTIVE') return 'INACTIVE';
  if (ex.status === 'ACTIVE') return 'ONGOING';
  return 'UPCOMING'; // DRAFT
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

  // State bộ lọc + phân trang
  const [examType, setExamType] = useState<string>('');
  const [field, setField] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const [page, setPage] = useState<number>(1); // 1-based
  const [pageSize, setPageSize] = useState<number>(10);

  const resetFilters = () => {
    setExamType('');
    setField('');
    setTopic('');
    setSearch('');
    setPage(1);
  };

  // Áp dụng lọc
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (exams || []).filter((e: Exam) => {
      if (examType && e.examType !== examType) return false;
      if (field && e.position !== field) return false;
      if (topic) {
        const topics = parseJsonArray(e.topics);
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

  // Phân trang
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * pageSize;
  const pageData = filtered.slice(startIdx, startIdx + pageSize);

  // Exam type options
  const examTypeOptions = [
    { value: '', label: 'Tất cả loại' },
    { value: 'VIRTUAL', label: 'Phỏng vấn ảo' },
    { value: 'RECRUITER', label: 'Kiểm tra sơ loại' },
  ];

  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <span aria-hidden className="text-lg">📝</span>
        <h3 className="text-lg font-semibold text-gray-800 m-0">
          Danh sách bài kiểm tra — {total} mục
        </h3>
      </div>

      <ExamFilter
        examType={examType}
        onExamTypeChange={(v) => {
          setExamType(v);
          setPage(1);
        }}
        examTypeOptions={examTypeOptions}
        field={field}
        onFieldChange={(v) => {
          setField(v);
          setPage(1);
        }}
        fieldOptions={fieldOptions}
        topic={topic}
        onTopicChange={(v) => {
          setTopic(v);
          setPage(1);
        }}
        topicOptions={topicOptions}
        page={currentPage}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        onReset={resetFilters}
      />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50">
              {[
                'Bài kiểm tra',
                'Loại',
                'Field',
                'Topic',
                'Loại câu hỏi',
                'Thời lượng',
                'Trạng thái',
                'Hành động',
              ].map((th) => (
                <th
                  key={th}
                  className={`px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200 ${
                    th === 'Bài kiểm tra' ||
                    th === 'Field' ||
                    th === 'Topic' ||
                    th === 'Loại câu hỏi'
                      ? 'text-left'
                      : 'text-center'
                  } whitespace-nowrap`}
                >
                  {th}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map((ex: Exam) => {
              const topics = parseJsonArray(ex.topics);
              const qTypes = parseJsonArray(ex.questionTypes);
              const rt = runtimeStateOf(ex);

              return (
                <tr
                  key={ex.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-3 py-2">
                    <div className="font-semibold text-gray-900 truncate max-w-[200px]">
                      {ex.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {ex.id}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      ex.examType === 'VIRTUAL'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {ex.examType === 'VIRTUAL' ? 'Phỏng vấn ảo' : 'Kiểm tra sơ loại'}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-900">
                    {ex.position || (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2 truncate max-w-[180px]">
                    {topics.length ? (
                      <div className="flex flex-wrap">
                        {topics.map((t) => (
                          <span key={t} className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full mr-1 mb-1">
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2 truncate max-w-[180px]">
                    {qTypes.length ? (
                      <div className="flex flex-wrap">
                        {qTypes.map((t) => (
                          <span key={t} className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full mr-1 mb-1">
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-center text-sm text-gray-900 whitespace-nowrap">
                    {formatDuration(ex.duration)}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {rt === 'UPCOMING' && (
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                        Sắp diễn ra
                      </span>
                    )}
                    {rt === 'ONGOING' && (
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Đang diễn ra
                      </span>
                    )}
                    {rt === 'DONE' && (
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                        Đã thi
                      </span>
                    )}
                    {rt === 'INACTIVE' && (
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        Tạm dừng
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-center whitespace-nowrap">
                    <div className="flex gap-2 justify-center">
                      {ex.examType === 'VIRTUAL' ? (
                        rt === 'ONGOING' ? (
                          <button className="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">
                            Tham gia
                          </button>
                        ) : rt === 'DONE' ? (
                          <button className="px-3 py-1 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors">
                            Mở
                          </button>
                        ) : (
                          <button className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors">
                            Chi tiết
                          </button>
                        )
                      ) : (
                        <>
                          {rt === 'UPCOMING' && (
                            <button className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors">
                              Xem thông tin
                            </button>
                          )}
                          {rt === 'ONGOING' && (
                            <button className="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">
                              Vào thi
                            </button>
                          )}
                          {rt === 'DONE' && (
                            <button className="px-3 py-1 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors">
                              Xem kết quả
                            </button>
                          )}
                          <button className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors">
                            Chi tiết
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {pageData.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  Không có dữ liệu phù hợp bộ lọc.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ExamTable;