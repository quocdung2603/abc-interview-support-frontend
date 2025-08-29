import React from 'react';
import { Input, Select, DatePicker } from 'antd';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface ToolbarProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  rankFilter: string;
  onRankFilterChange: (value: string) => void;
  selectedRowKeys: React.Key[];
}

const UserToolbar: React.FC<ToolbarProps> = ({
  searchText,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  rankFilter,
  onRankFilterChange,
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
        <Option value="Pending">Chưa xác thực</Option>
        <Option value="Verified">Đã xác thực</Option>
        <Option value="Lock">Đã bị khóa</Option>
      </Select>

      <Select
        placeholder="Bậc xếp hạng"
        value={rankFilter}
        onChange={onRankFilterChange}
        style={{ width: 130 }}
      >
        <Option value="all">Tất cả</Option>
        <Option value="Newbie">Newbie</Option>
        <Option value="Learner">Learner</Option>
        <Option value="Contributor">Contributor</Option>
        <Option value="Solver">Solver</Option>
        <Option value="Expert">Expert</Option>
        <Option value="Senior Expert">Senior Expert</Option>
        <Option value="Master">Master</Option>
        <Option value="Legend">Legend</Option>
      </Select>

      <RangePicker style={{ width: 250 }} />
    </div>
  );
};

export default UserToolbar;
