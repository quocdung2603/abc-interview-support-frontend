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
  fontSize: '0.9rem',
};

const badgeBase: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '2px 8px',
  borderRadius: '999px',
  fontSize: '0.75rem',
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
    <section
      className="card-interactive"
      style={{ padding: 'var(--spacing-lg)' }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 'var(--spacing-sm)',
        }}
      >
        <span aria-hidden>📝</span>
        <h3
          className="text-heading-2"
          style={{ margin: 0, color: 'var(--color-neutral-800)' }}
        >
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

      <div style={{ overflowX: 'auto' }}>
        <table style={tableShell}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-neutral-50)' }}>
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
                  style={{
                    padding: 'var(--spacing-sm)',
                    textAlign:
                      th === 'Bài kiểm tra' ||
                        th === 'Field' ||
                        th === 'Topic' ||
                        th === 'Loại câu hỏi'
                        ? 'left'
                        : 'center',
                    borderBottom: '2px solid var(--color-neutral-200)',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
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
                  style={{
                    borderBottom: '1px solid var(--color-neutral-200)',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLTableRowElement>) =>
                  (e.currentTarget.style.backgroundColor =
                    'var(--color-neutral-50)')
                  }
                  onMouseLeave={(e: React.MouseEvent<HTMLTableRowElement>) =>
                    (e.currentTarget.style.backgroundColor = 'transparent')
                  }
                >
                  <td style={{ padding: 'var(--spacing-sm)' }}>
                    <div
                      className="truncate max-w-[200px]"
                      style={{
                        fontWeight: 600,
                        color: 'var(--color-neutral-900)',
                      }}
                    >
                      {ex.title}
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-neutral-500)',
                      }}
                    >
                      ID: {ex.id}
                    </div>
                  </td>
                  <td style={{ padding: 'var(--spacing-sm)', textAlign: 'center' }}>
                    <span
                      className="badge-secondary"
                      style={{
                        background:
                          ex.examType === 'VIRTUAL'
                            ? 'var(--color-primary)'
                            : 'var(--color-accent)',
                        color: '#fff',
                      }}
                    >
                      {ex.examType === 'VIRTUAL' ? 'Phỏng vấn ảo' : 'Kiểm tra sơ loại'}
                    </span>
                  </td>
                  <td style={{ padding: 'var(--spacing-sm)' }}>
                    {ex.position || (
                      <span style={{ color: 'var(--color-neutral-400)' }}>
                        —
                      </span>
                    )}
                  </td>
                  <td
                    className="truncate max-w-[180px]"
                    style={{ padding: 'var(--spacing-sm)' }}
                  >
                    {topics.length ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {topics.map((t) => (
                          <span key={t} style={badgeBase}>
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--color-neutral-400)' }}>
                        —
                      </span>
                    )}
                  </td>
                  <td
                    className="truncate max-w-[180px]"
                    style={{ padding: 'var(--spacing-sm)' }}
                  >
                    {qTypes.length ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {qTypes.map((t) => (
                          <span key={t} style={badgeBase}>
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--color-neutral-400)' }}>
                        —
                      </span>
                    )}
                  </td>
                  <td
                    style={{
                      padding: 'var(--spacing-sm)',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {formatDuration(ex.duration)}
                  </td>
                  <td
                    style={{
                      padding: 'var(--spacing-sm)',
                      textAlign: 'center',
                    }}
                  >
                    {rt === 'UPCOMING' && (
                      <span
                        className="badge-secondary"
                        style={{
                          background: 'var(--color-warning)',
                          color: '#fff',
                        }}
                      >
                        Sắp diễn ra
                      </span>
                    )}
                    {rt === 'ONGOING' && (
                      <span
                        className="badge-secondary"
                        style={{
                          background: 'var(--color-success)',
                          color: '#fff',
                        }}
                      >
                        Đang diễn ra
                      </span>
                    )}
                    {rt === 'DONE' && (
                      <span
                        className="badge-secondary"
                        style={{
                          background: 'var(--color-accent)',
                          color: '#fff',
                        }}
                      >
                        Đã thi
                      </span>
                    )}
                    {rt === 'INACTIVE' && (
                      <span
                        className="badge-secondary"
                        style={{
                          background: 'var(--color-neutral-400)',
                          color: '#fff',
                        }}
                      >
                        Tạm dừng
                      </span>
                    )}
                  </td>
                  <td
                    style={{
                      padding: 'var(--spacing-sm)',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <div style={{ display: 'inline-flex', gap: 8 }}>
                      {ex.examType === 'VIRTUAL' ? (
                        rt === 'ONGOING' ? (
                          <button
                            className="btn-primary btn-sm"
                            onClick={() => onJoin?.(ex.id)}
                          >
                            Tham gia
                          </button>
                        ) : rt === 'DONE' ? (
                          <button
                            className="btn-accent btn-sm"
                            onClick={() => onOpen?.(ex.id)}
                          >
                            Mở
                          </button>
                        ) : (
                          <button
                            className="btn-outline btn-sm"
                            onClick={() => onDetails?.(ex.id)}
                          >
                            Chi tiết
                          </button>
                        )
                      ) : (
                        <>
                          {rt === 'UPCOMING' && (
                            <button
                              className="btn-outline btn-sm"
                              onClick={() => onInfo?.(ex.id)}
                            >
                              Xem thông tin
                            </button>
                          )}
                          {rt === 'ONGOING' && (
                            <button
                              className="btn-primary btn-sm"
                              onClick={() => onEnter?.(ex.id)}
                            >
                              Vào thi
                            </button>
                          )}
                          {rt === 'DONE' && (
                            <button
                              className="btn-accent btn-sm"
                              onClick={() => onResult?.(ex.id)}
                            >
                              Xem kết quả
                            </button>
                          )}
                          <button
                            className="btn-outline btn-sm"
                            onClick={() => onDetails?.(ex.id)}
                          >
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
                  style={{
                    padding: 'var(--spacing-lg)',
                    textAlign: 'center',
                    color: 'var(--color-neutral-500)',
                  }}
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