import React from 'react';
import { Input, Select, DatePicker, Tooltip } from 'antd';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface JobsToolbarProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  locationFilter: string;
  onLocationFilterChange: (value: string) => void;
  selectedRowKeys: React.Key[];
}

const JobsToolbar: React.FC<JobsToolbarProps> = ({
  searchText,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  locationFilter,
  onLocationFilterChange,
  selectedRowKeys,
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto auto auto auto',
        gap: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-lg)',
        alignItems: 'center',
      }}
    >
      <Search
        placeholder="Tìm kiếm theo tiêu đề, vị trí..."
        allowClear
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{ maxWidth: '300px' }}
      />

      <Select
        placeholder="Trạng thái"
        value={statusFilter}
        onChange={onStatusFilterChange}
        style={{ width: 130 }}
      >
        <Option value="all">Tất cả</Option>
        <Option value="PENDING">Chờ duyệt</Option>
        <Option value="APPROVED">Đã duyệt</Option>
        <Option value="REJECTED">Trả lại</Option>
        <Option value="PUBLISHED">Đã xuất bản</Option>
      </Select>

      <Select
        placeholder="Địa điểm"
        value={locationFilter}
        onChange={onLocationFilterChange}
        style={{ width: 130 }}
      >
        <Option value="all">Tất cả</Option>
        <Option value="Hồ Chí Minh">TP.HCM</Option>
        <Option value="Hà Nội">Hà Nội</Option>
        <Option value="Đà Nẵng">Đà Nẵng</Option>
        <Option value="Remote">Remote</Option>
      </Select>

      <RangePicker style={{ width: 250 }} />
    </div>
  );
};

export default JobsToolbar;
