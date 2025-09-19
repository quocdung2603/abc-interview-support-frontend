import React, { useState } from 'react';
import { Select, DatePicker, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
const { Option } = Select;
const { RangePicker } = DatePicker;

interface MockExamToolbarProps {
  onCreateExam: () => void;
  onFilterChange: (filters: {
    examType?: string;
    status?: string;
    dateRange?: [Date, Date];
  }) => void;
}

const MockExamToolbar: React.FC<MockExamToolbarProps> = ({
  onCreateExam,
  onFilterChange,
}) => {
  const [examTypeFilter, setExamTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);

  const handleExamTypeChange = (value: string) => {
    setExamTypeFilter(value);
    onFilterChange({
      examType: value || undefined,
      status: statusFilter || undefined,
      dateRange: dateRange || undefined,
    });
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    onFilterChange({
      examType: examTypeFilter || undefined,
      status: value || undefined,
      dateRange: dateRange || undefined,
    });
  };

  const handleDateRangeChange = (
    dates: Parameters<React.ComponentProps<typeof RangePicker>['onChange']>[0]
  ) => {
    const dateRange = dates ? [dates[0]?.toDate(), dates[1]?.toDate()] : null;
    setDateRange(dateRange);
    onFilterChange({
      examType: examTypeFilter || undefined,
      status: statusFilter || undefined,
      dateRange: dateRange || undefined,
    });
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto auto auto auto',
        gap: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-lg)',
        alignItems: 'end',
      }}
    >
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onCreateExam}
        style={{ justifySelf: 'start' }}
      >
        Tạo bài kiểm tra mới
      </Button>

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

export default MockExamToolbar;
