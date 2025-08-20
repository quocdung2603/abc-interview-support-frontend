import React, { useMemo, useState } from 'react';
import ExamFilter from './ExamFilter';
import { Exam } from '@abc-interview-support-frontend/types';
import { truncate } from 'fs';

interface Props {
  exams: Exam[]; // truyền toàn bộ danh sách
  onJoin?: (id: string) => void; // Tham gia
  onOpen?: (id: string) => void; // Mở (kết quả/ghi hình)
  onDetails?: (id: string) => void; // Chi tiết
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

type RuntimeState = 'UPCOMING' | 'ONGOING' | 'DONE' | 'INACTIVE';

const runtimeStateOf = (ex: Exam, now = new Date()): RuntimeState => {
  const start = ex.startTime ? new Date(ex.startTime) : undefined;
  const end = ex.endTime ? new Date(ex.endTime) : undefined;

  if (ex.status === 'Completed') return 'DONE';
  if (ex.status === 'Inactive') return 'INACTIVE';

  if (start && now < start) return 'UPCOMING';
  if (start && end && now >= start && now <= end) return 'ONGOING';
  if (end && now > end) return 'DONE';

  return ex.status === 'Active' ? 'ONGOING' : 'UPCOMING';
};

const VirtualInterviewTab: React.FC<Props> = ({
  exams,
  onJoin,
  onOpen,
  onDetails,
}) => {
  // 1) Lọc Virtual
  const virtualExams = useMemo(
    () => (exams || []).filter((e) => e.examType === 'Virtual'),
    [exams]
  );

  // 2) Options cho bộ lọc dùng lại
  const allFields = useMemo(() => {
    const s = new Set<string>();
    virtualExams.forEach((e) => e.position && s.add(e.position));
    return Array.from(s).sort();
  }, [virtualExams]);

  const allTopics = useMemo(() => {
    const s = new Set<string>();
    virtualExams.forEach((e) =>
      parseJsonArray(e.topics).forEach((t) => t && s.add(t))
    );
    return Array.from(s).sort();
  }, [virtualExams]);

  const allLevels = useMemo(() => {
    const s = new Set<string>();
    virtualExams.forEach((e: any) => {
      if (e.level) s.add(String(e.level));
    });
    return Array.from(s).sort();
  }, [virtualExams]);

  // 3) State bộ lọc + phân trang
  const [field, setField] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const [level, setLevel] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const [page, setPage] = useState<number>(1); // 1-based
  const [pageSize, setPageSize] = useState<number>(10);

  const resetFilters = () => {
    setField('');
    setTopic('');
    setLevel('');
    setSearch('');
    setPage(1);
  };

  // 4) Áp dụng lọc
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return virtualExams.filter((e: any) => {
      if (field && e.position !== field) return false;
      if (topic) {
        const topics = parseJsonArray(e.topics);
        if (!topics.includes(topic)) return false;
      }
      if (level && String(e.level || '') !== level) return false;

      if (term) {
        const hay = `${e.examId} ${e.title} ${e.position || ''} ${
          e.language || ''
        }`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
  }, [virtualExams, field, topic, level, search]);

  // 5) Phân trang
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * pageSize;
  const pageData = filtered.slice(startIdx, startIdx + pageSize);

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
        <span aria-hidden>🎥</span>
        <h3
          className="text-heading-3"
          style={{ margin: 0, color: 'var(--color-neutral-800)' }}
        >
          Virtual Interview — {total} mục
        </h3>
      </div>

      <ExamFilter
        field={field}
        onFieldChange={(v) => {
          setField(v);
          setPage(1);
        }}
        fieldOptions={allFields}
        topic={topic}
        onTopicChange={(v) => {
          setTopic(v);
          setPage(1);
        }}
        topicOptions={allTopics}
        level={level}
        onLevelChange={(v) => {
          setLevel(v);
          setPage(1);
        }}
        levelOptions={allLevels}
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
                'Field',
                'Level',
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
                      th === 'Level' ||
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
            {pageData.map((ex: any) => {
              const topics = parseJsonArray(ex.topics);
              const qTypes = parseJsonArray(ex.questionTypes);
              const rt = runtimeStateOf(ex);

              return (
                <tr
                  key={ex.examId}
                  style={{
                    borderBottom: '1px solid var(--color-neutral-200)',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={(e: any) =>
                    (e.currentTarget.style.backgroundColor =
                      'var(--color-neutral-50)')
                  }
                  onMouseLeave={(e: any) =>
                    (e.currentTarget.style.backgroundColor = 'transparent')
                  }
                >
                  <td style={{ padding: 'var(--spacing-sm)' }}>
                    <div
                      className="truncate max-w-[100px]"
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
                      ID: {ex.examId}
                    </div>
                  </td>
                  <td style={{ padding: 'var(--spacing-sm)' }}>
                    {ex.position || (
                      <span style={{ color: 'var(--color-neutral-400)' }}>
                        —
                      </span>
                    )}
                  </td>
                  <td style={{ padding: 'var(--spacing-sm)' }}>
                    {ex.level || (
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
                        {topics.map((t, i) => (
                          <span key={i} style={badgeBase}>
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
                        {qTypes.map((t, i) => (
                          <span key={i} style={badgeBase}>
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
                      {rt === 'ONGOING' ? (
                        <button
                          className="btn-primary btn-sm"
                          onClick={() => onJoin?.(ex.examId)}
                        >
                          Tham gia
                        </button>
                      ) : rt === 'DONE' ? (
                        <button
                          className="btn-accent btn-sm"
                          onClick={() => onOpen?.(ex.examId)}
                        >
                          Mở
                        </button>
                      ) : (
                        <button
                          className="btn-outline btn-sm"
                          onClick={() => onDetails?.(ex.examId)}
                        >
                          Chi tiết
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {pageData.length === 0 && (
              <tr>
                <td
                  colSpan={12}
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

export default VirtualInterviewTab;
