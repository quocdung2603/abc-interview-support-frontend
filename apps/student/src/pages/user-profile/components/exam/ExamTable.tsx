import React, { useMemo, useState, useEffect } from 'react';
import { Table, Tag, Button, Tooltip, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import ExamFilter, { ExamFilters } from './ExamFilter';
import { Exam, Field, Topic } from '@abc-interview-support-frontend/types';
import { questionService } from '@abc-interview-support-frontend/services';
import { EyeOutlined, FileDoneOutlined } from '@ant-design/icons';

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
    const parsed: unknown = JSON.parse(jsonString);
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
  const [fieldOptions, setFieldOptions] = useState<Field[]>([]);
  const [topicOptions, setTopicOptions] = useState<Topic[]>([]);

  // Helper function to process API response
  const processResponse = (res: unknown): Field[] | Topic[] => {
    if (!Array.isArray(res)) return [];
    return res.map((item: unknown, index: number) => {
      if (typeof item === 'string') {
        return { id: index + 1, name: item };
      }
      if (item && typeof item === 'object' && 'name' in item) {
        return { id: (item as any).id || index + 1, name: String((item as any).name) };
      }
      return { id: index + 1, name: String(item) };
    });
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        console.log('Fetching options from API...');
        const [fieldsRes, topicsRes] = await Promise.all([
          questionService.getAllFields(),
          questionService.getAllTopics(),
        ]);

        setFieldOptions(processResponse(fieldsRes.content) as Field[]);
        setTopicOptions(processResponse(topicsRes.content) as Topic[]);

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
  const [fieldId, setFieldId] = useState<number | undefined>(undefined);
  const [topicIds, setTopicIds] = useState<number[]>([]);
  const [search, setSearch] = useState<string>('');

  // Áp dụng lọc
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (exams || []).filter((e: Exam) => {
      if (examType && e.examType !== examType) return false;
      if (fieldId && e.fieldId !== fieldId) return false;
      if (topicIds.length > 0) {
        const examTopicIds = parseJsonArray(e.topicIds).map(id => parseInt(id)).filter(id => !isNaN(id));
        const hasMatchingTopic = topicIds.some(topicId => examTopicIds.includes(topicId));
        if (!hasMatchingTopic) return false;
      }

      if (term) {
        const hay = `${e.id} ${e.title} ${e.position || ''} ${e.language || ''
          }`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
  }, [exams, examType, fieldId, topicIds, search]);

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
          <Space size="small">
            {isVirtual ? (
              <>
                {rt === 'ONGOING' && (
                  <Button type="primary" size="small">
                    Thi lại
                  </Button>
                )}
                {rt === 'DONE' && (
                  <>
                    <Tooltip title="Mở kết quả">
                      <Button
                        size="small"
                        icon={<FileDoneOutlined />}
                        onClick={() => onResult?.(record.id)}
                      />
                    </Tooltip>

                    <Tooltip title="Xem chi tiết">
                      <Button
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => onDetails?.(record.id)}
                      />
                    </Tooltip>
                  </>
                )}
                {rt === 'UPCOMING' && (
                  <Tooltip title="Xem chi tiết">
                    <Button
                      icon={<EyeOutlined />}
                      size="small"
                      onClick={() => onDetails?.(record.id)}
                    />
                  </Tooltip>
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
                  <Tooltip title="Mở kết quả">
                    <Button
                      size="small"
                      icon={<FileDoneOutlined />}
                      onClick={() => onResult?.(record.id)}
                    />
                  </Tooltip>
                )}
                <Tooltip title="Xem chi tiết">
                  <Button
                    icon={<EyeOutlined />}
                    size="small"
                    onClick={() => onDetails?.(record.id)}
                  />
                </Tooltip>
              </>
            )}
          </Space>
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
        fields={fieldOptions}
        topics={topicOptions}
        levels={[]}
        onFilterChange={(filters: ExamFilters) => {
          setExamType(filters.examType || '');
          setFieldId(filters.fieldId);
          setTopicIds(filters.topicIds || []);
          setSearch(filters.title || '');
        }}
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