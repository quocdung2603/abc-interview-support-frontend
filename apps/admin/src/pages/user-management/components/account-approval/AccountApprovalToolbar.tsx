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
  selectedRowKeys: React.Key[];
}

const AccountApprovalToolbar: React.FC<ToolbarProps> = ({
  searchText,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  selectedRowKeys,
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto auto auto',
        gap: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-lg)',
        alignItems: 'center',
      }}
    >
      <Search
        placeholder="Tìm kiếm theo tên công ty, email..."
        allowClear
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{ maxWidth: '300px' }}
      />

      <Select
        placeholder="Trạng thái"
        value={statusFilter}
        onChange={onStatusFilterChange}
        style={{ width: 150 }}
      >
        <Option value="all">Tất cả</Option>
        <Option value="Pending">Đang chờ duyệt</Option>
        <Option value="Verified">Đã xác minh</Option>
        <Option value="Rejected">Đã từ chối</Option>
      </Select>

      <RangePicker
        placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
        style={{ width: 250 }}
      />
    </div>
  );
};

export default AccountApprovalToolbar;
