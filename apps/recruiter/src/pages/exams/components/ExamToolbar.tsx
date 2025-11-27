import React, { useState } from 'react';
import { Select, DatePicker, Input } from 'antd';
import { Dayjs } from 'dayjs';
import { Field, Level, Topic } from '@abc-interview-support-frontend/types';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface ExamToolbarProps {
  onFilterChange: (filters: {
    searchText?: string;
    status?: string;
    position?: string;
    fieldId?: number;
    topicIds?: number[];
    levelId?: number;
    dateRange?: [Dayjs, Dayjs];
  }) => void;
  fields: Field[];
  topics: Topic[];
  levels: Level[];
}

const ExamToolbar: React.FC<ExamToolbarProps> = ({
  onFilterChange,
  fields,
  topics,
  levels,
}) => {
  const [searchText, setSearchText] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [fieldFilter, setFieldFilter] = useState<number | undefined>(undefined);
  const [topicFilter, setTopicFilter] = useState<number[]>([]);
  const [levelFilter, setLevelFilter] = useState<number | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    onFilterChange({
      searchText: value || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter,
      position: positionFilter === 'all' ? undefined : positionFilter,
      fieldId: fieldFilter,
      topicIds: topicFilter.length > 0 ? topicFilter : undefined,
      levelId: levelFilter,
      dateRange: dateRange || undefined,
    });
  };

  const handleStatusChange = (value = 'all') => {
    setStatusFilter(value);
    onFilterChange({
      searchText: searchText || undefined,
      status: value === 'all' ? undefined : value,
      position: positionFilter === 'all' ? undefined : positionFilter,
      fieldId: fieldFilter,
      topicIds: topicFilter.length > 0 ? topicFilter : undefined,
      levelId: levelFilter,
      dateRange: dateRange || undefined,
    });
  };

  const handlePositionChange = (value = 'all') => {
    setPositionFilter(value);
    onFilterChange({
      searchText: searchText || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter,
      position: value === 'all' ? undefined : value,
      fieldId: fieldFilter,
      topicIds: topicFilter.length > 0 ? topicFilter : undefined,
      levelId: levelFilter,
      dateRange: dateRange || undefined,
    });
  };

  const handleFieldChange = (value: number | undefined) => {
    setFieldFilter(value);
    onFilterChange({
      searchText: searchText || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter,
      position: positionFilter === 'all' ? undefined : positionFilter,
      fieldId: value,
      topicIds: topicFilter.length > 0 ? topicFilter : undefined,
      levelId: levelFilter,
      dateRange: dateRange || undefined,
    });
  };

  const handleTopicChange = (value: number[]) => {
    setTopicFilter(value);
    onFilterChange({
      searchText: searchText || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter,
      position: positionFilter === 'all' ? undefined : positionFilter,
      fieldId: fieldFilter,
      topicIds: value.length > 0 ? value : undefined,
      levelId: levelFilter,
      dateRange: dateRange || undefined,
    });
  };

  const handleLevelChange = (value: number | undefined) => {
    setLevelFilter(value);
    onFilterChange({
      searchText: searchText || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter,
      position: positionFilter === 'all' ? undefined : positionFilter,
      fieldId: fieldFilter,
      topicIds: topicFilter.length > 0 ? topicFilter : undefined,
      levelId: value,
      dateRange: dateRange || undefined,
    });
  };

  const handleDateRangeChange = (
    dates: [Dayjs | null, Dayjs | null] | null,
    dateStrings: [string, string]
  ) => {
    // Convert to [Dayjs, Dayjs] | null if both dates are not null, else null
    const validDates =
      dates?.[0] && dates?.[1]
        ? ([dates[0], dates[1]] as [Dayjs, Dayjs])
        : null;
    setDateRange(validDates);
    onFilterChange({
      searchText: searchText || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter,
      position: positionFilter === 'all' ? undefined : positionFilter,
      fieldId: fieldFilter,
      topicIds: topicFilter.length > 0 ? topicFilter : undefined,
      levelId: levelFilter,
      dateRange: validDates || undefined,
    });
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr auto auto auto auto auto auto',
        gap: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-lg)',
        alignItems: 'end',
        backgroundColor: '#fff',
        padding: '16px',
        borderRadius: '8px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>
          Tìm kiếm bài kiểm tra
        </span>
        <Input
          placeholder="Nhập tiêu đề bài kiểm tra..."
          value={searchText}
          onChange={(e) => handleSearchChange(e.target.value)}
          allowClear
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>
          Trạng thái
        </span>
        <Select
          placeholder="Tất cả"
          allowClear
          value={statusFilter}
          onChange={handleStatusChange}
          style={{ minWidth: '120px' }}
        >
          <Option value="all">Tất cả</Option>
          <Option value="DRAFT">Bản nháp</Option>
          <Option value="ACTIVE">Đang hoạt động</Option>
          <Option value="INACTIVE">Không hoạt động</Option>
          <Option value="COMPLETED">Đã hoàn thành</Option>
        </Select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>
          Vị trí
        </span>
        <Select
          placeholder="Tất cả"
          allowClear
          value={positionFilter}
          onChange={handlePositionChange}
          style={{ minWidth: '140px' }}
        >
          <Option value="all">Tất cả</Option>
          <Option value="Frontend Developer">Frontend Developer</Option>
          <Option value="Backend Developer">Backend Developer</Option>
          <Option value="Fullstack Developer">Fullstack Developer</Option>
          <Option value="DevOps Engineer">DevOps Engineer</Option>
          <Option value="Mobile Developer">Mobile Developer</Option>
          <Option value="Data Analyst">Data Analyst</Option>
          <Option value="QA Engineer">QA Engineer</Option>
          <Option value="Product Manager">Product Manager</Option>
          <Option value="Business Analyst">Business Analyst</Option>
          <Option value="UI/UX Designer">UI/UX Designer</Option>
        </Select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>
          Lĩnh vực
        </span>
        <Select
          placeholder="Tất cả"
          allowClear
          value={fieldFilter}
          onChange={handleFieldChange}
          style={{ minWidth: '120px' }}
        >
          <Option value={undefined}>Tất cả</Option>
          {fields.map((field) => (
            <Option key={field.id} value={field.id}>
              {field.name}
            </Option>
          ))}
        </Select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>
          Chủ đề
        </span>
        <Select
          mode="multiple"
          placeholder="Tất cả"
          allowClear
          value={topicFilter}
          onChange={handleTopicChange}
          style={{ minWidth: '120px' }}
        >
          {topics.map((topic) => (
            <Option key={topic.id} value={topic.id}>
              {topic.name}
            </Option>
          ))}
        </Select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>
          Cấp độ
        </span>
        <Select
          placeholder="Tất cả"
          allowClear
          value={levelFilter}
          onChange={handleLevelChange}
          style={{ minWidth: '120px' }}
        >
          <Option value={undefined}>Tất cả</Option>
          {levels.map((level) => (
            <Option key={level.id} value={level.id}>
              {level.name}
            </Option>
          ))}
        </Select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>
          Ngày tạo
        </span>
        <RangePicker
          placeholder={['Từ ngày', 'Đến ngày']}
          value={dateRange}
          onChange={handleDateRangeChange}
          style={{ minWidth: '200px' }}
        />
      </div>
    </div>
  );
};

export default ExamToolbar;