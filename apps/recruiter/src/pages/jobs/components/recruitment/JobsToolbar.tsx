import React from 'react';
import { Input, Select, DatePicker, Button, Tooltip } from 'antd';
import { SendOutlined } from '@ant-design/icons';

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
  isVerified: boolean;
}

const JobsToolbar: React.FC<JobsToolbarProps> = ({
  searchText,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  locationFilter,
  onLocationFilterChange,
  selectedRowKeys,
  isVerified,
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
        <Option value="draft">Bản nháp</Option>
        <Option value="pending">Chờ duyệt</Option>
        <Option value="approved">Đã duyệt</Option>
        <Option value="rejected">Trả lại</Option>
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

      {selectedRowKeys.length > 0 && (
        <Tooltip
          title={
            !isVerified
              ? 'Cần xác thực tài khoản'
              : `Gửi duyệt ${selectedRowKeys.length} bài`
          }
        ></Tooltip>
      )}
    </div>
  );
};

export default JobsToolbar;
