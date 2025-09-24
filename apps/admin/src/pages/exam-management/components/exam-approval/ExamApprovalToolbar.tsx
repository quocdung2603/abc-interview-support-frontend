import React, { useState } from 'react';
import { Select, DatePicker, Input } from 'antd';
import { Dayjs } from 'dayjs';
const { Option } = Select;
const { RangePicker } = DatePicker;

interface ExamApprovalToolbarProps {
  onFilterChange: (filters: {
    searchText?: string;
    examType?: string;
    status?: string;
    dateRange?: [Date, Date];
  }) => void;
}

const ExamApprovalToolbar: React.FC<ExamApprovalToolbarProps> = ({
  onFilterChange,
}) => {
  const [searchText, setSearchText] = useState<string>('');
  const [examTypeFilter, setExamTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    onFilterChange({
      searchText: value || undefined,
      examType: examTypeFilter || undefined,
      status: statusFilter || undefined,
      dateRange: dateRange
        ? [dateRange[0].toDate(), dateRange[1].toDate()]
        : undefined,
    });
  };

  const handleExamTypeChange = (value: string) => {
    setExamTypeFilter(value);
    onFilterChange({
      searchText: searchText || undefined,
      examType: value || undefined,
      status: statusFilter || undefined,
      dateRange: dateRange
        ? [dateRange[0].toDate(), dateRange[1].toDate()]
        : undefined,
    });
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    onFilterChange({
      searchText: searchText || undefined,
      examType: examTypeFilter || undefined,
      status: value || undefined,
      dateRange: dateRange
        ? [dateRange[0].toDate(), dateRange[1].toDate()]
        : undefined,
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
      examType: examTypeFilter || undefined,
      status: statusFilter || undefined,
      dateRange: validDates
        ? [validDates[0].toDate(), validDates[1].toDate()]
        : undefined,
    });
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr auto auto auto',
        gap: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-lg)',
        alignItems: 'end',
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
          Loại bài kiểm tra
        </span>
        <Select
          placeholder="Tất cả"
          allowClear
          value={examTypeFilter}
          onChange={handleExamTypeChange}
          style={{ minWidth: '140px' }}
        >
          <Option value="Virtual">Bài kiểm tra ảo</Option>
          <Option value="Recruiter">Bài kiểm tra nhà tuyển dụng</Option>
        </Select>
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
          <Option value="Active">Đang hoạt động</Option>
          <Option value="Inactive">Không hoạt động</Option>
          <Option value="Completed">Đã hoàn thành</Option>
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

export default ExamApprovalToolbar;
