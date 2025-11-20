import React, { useMemo, useState, useEffect } from 'react';
import ExamFilter from './ExamFilter';
import { Exam } from '@abc-interview-support-frontend/types';
import { questionService } from '@abc-interview-support-frontend/services';

interface Props {
  exams: Exam[]; // truyền toàn bộ danh sách, component sẽ tự lọc Recruiter
  onEnter?: (id: string) => void; // nút "Vào thi"
  onInfo?: (id: string) => void; // nút "Xem thông tin"
  onResult?: (id: string) => void; // nút "Xem lại kết quả"
  onDetails?: (id: string) => void; // phụ trợ nếu cần
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

const parseJsonArray = (jsonString?: string): string[] => {
  if (!jsonString) return [];
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

// Phân loại trạng thái hiển thị hành động theo thời gian
type RuntimeState = 'UPCOMING' | 'ONGOING' | 'DONE' | 'INACTIVE';

const runtimeStateOf = (ex: Exam, now = new Date()): RuntimeState => {
  const start = ex.startTime ? new Date(ex.startTime) : undefined;
  const end = ex.endTime ? new Date(ex.endTime) : undefined;

  if (ex.status === 'Completed') return 'DONE';
  if (ex.status === 'Inactive') return 'INACTIVE';

  if (start && now < start) return 'UPCOMING';
  if (start && end && now >= start && now <= end) return 'ONGOING';
  if (end && now > end) return 'DONE';

  // Fallback theo status
  return ex.status === 'Active' ? 'ONGOING' : 'UPCOMING';
};

const ScreeningExamTab: React.FC<Props> = ({
  exams,
  onEnter,
  onInfo,
  onResult,
  onDetails,
}) => {
  // 1) Lọc Recruiter
  const recruiterExams = useMemo(
    () => (exams || []).filter((e) => e.examType === 'RECRUITER'),
    [exams]
  );

  // 2) State cho options từ API
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

  // 3) State bộ lọc + phân trang
  const [field, setField] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const [page, setPage] = useState<number>(1); // 1-based
  const [pageSize, setPageSize] = useState<number>(10);

  const resetFilters = () => {
    setField('');
    setTopic('');
    setSearch('');
    setPage(1);
  };

  // 4) Áp dụng lọc
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return recruiterExams.filter((e: any) => {
      if (field && e.position !== field) return false;

      if (topic) {
        const topics = e.topics.map(String);
        if (!topics.includes(topic)) return false;
      }

      if (term) {
        const hay = `${e.id} ${e.title} ${e.position || ''} ${
          e.language || ''
        }`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
  }, [recruiterExams, field, topic, search]);

  // 5) Phân trang client-side
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * pageSize;
  const pageData = filtered.slice(startIdx, startIdx + pageSize);

  // 6) Render
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
        <span aria-hidden>🧪</span>
        <h3
          className="text-heading-2"
          style={{ margin: 0, color: 'var(--color-neutral-800)' }}
        >
          Screening Exam (Recruiter) — {total} mục
        </h3>
      </div>

      {/* Controls dùng lại được */}
      <ExamFilter
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

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={tableShell}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-neutral-50)' }}>
              {[
                'Tên bài kiểm tra',
                'Field',
                'Topic',
                'Loại câu hỏi',
                'Số câu',
                'Thời lượng',
                'Trạng thái',
                'Ngôn ngữ',
                'Hành động',
              ].map((th) => (
                <th
                  key={th}
                  style={{
                    padding: 'var(--spacing-sm)',
                    textAlign:
                      th === 'Tên bài kiểm tra' ||
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
            {pageData.map((ex) => {
              const topics = ex.topics.map(String);
              const qTypes = ex.questionTypes.map(String);
              const rt = runtimeStateOf(ex);

              return (
                <tr
                  key={ex.id}
                  style={{
                    borderBottom: '1px solid var(--color-neutral-200)',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      'var(--color-neutral-50)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = 'transparent')
                  }
                >
                  {/* Tên */}
                  <td style={{ padding: 'var(--spacing-sm)', minWidth: 220 }}>
                    <div
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

                  {/* Field (position) */}
                  <td style={{ padding: 'var(--spacing-sm)' }}>
                    {ex.position || (
                      <span style={{ color: 'var(--color-neutral-400)' }}>
                        —
                      </span>
                    )}
                  </td>

                  {/* Topic */}
                  <td style={{ padding: 'var(--spacing-sm)', minWidth: 220 }}>
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

                  {/* Loại câu hỏi */}
                  <td style={{ padding: 'var(--spacing-sm)', minWidth: 220 }}>
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

                  {/* Số câu */}
                  <td
                    style={{
                      padding: 'var(--spacing-sm)',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {ex.questionCount}
                  </td>

                  {/* Thời lượng */}
                  <td
                    style={{
                      padding: 'var(--spacing-sm)',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {formatDuration(ex.duration)}
                  </td>

                  {/* Bắt đầu */}
                  <td
                    style={{
                      padding: 'var(--spacing-sm)',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      color: 'var(--color-neutral-700)',
                    }}
                  >
                    —
                  </td>

                  {/* Kết thúc */}
                  <td
                    style={{
                      padding: 'var(--spacing-sm)',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      color: 'var(--color-neutral-700)',
                    }}
                  >
                    —
                  </td>

                  {/* Trạng thái hiển thị */}
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

                  {/* Ngôn ngữ */}
                  <td
                    style={{
                      padding: 'var(--spacing-sm)',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {ex.language}
                  </td>

                  {/* Hành động theo mô tả */}
                  <td
                    style={{
                      padding: 'var(--spacing-sm)',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <div style={{ display: 'inline-flex', gap: 8 }}>
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
                          Xem lại kết quả
                        </button>
                      )}
                      {/* phụ: chi tiết */}
                      <button
                        className="btn-outline btn-sm"
                        onClick={() => onDetails?.(ex.id)}
                      >
                        Chi tiết
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {pageData.length === 0 && (
              <tr>
                <td
                  colSpan={9}
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

export default ScreeningExamTab;
