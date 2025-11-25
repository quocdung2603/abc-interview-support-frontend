import { Input, Select, Button, Space, DatePicker } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface TrendNewsToolbarProps {
  searchValue: string;
  statusFilter: string;
  newsTypeFilter: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onNewsTypeFilterChange: (value: string) => void;
  onDateRangeChange: (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  ) => void;
  onResetFilters: () => void;
}

const { RangePicker } = DatePicker;

const TrendNewsToolbar: React.FC<TrendNewsToolbarProps> = ({
  searchValue,
  statusFilter,
  newsTypeFilter,
  onSearchChange,
  onStatusFilterChange,
  onNewsTypeFilterChange,
  onDateRangeChange,
  onResetFilters,
}) => {
  return (
    <div
      style={{
        background: 'white',
        padding: 'var(--spacing-lg)',
        borderRadius: 'var(--border-radius-lg)',
        marginBottom: 'var(--spacing-xs)',
      }}
    >
      <Space wrap size="middle" style={{ width: '100%' }}>
        <Input
          placeholder="Tìm kiếm theo tiêu đề, nội dung..."
          prefix={<SearchOutlined />}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />

        <Select
          placeholder="Trạng thái"
          value={statusFilter || undefined}
          onChange={onStatusFilterChange}
          style={{ width: 150 }}
          allowClear
        >
          <Select.Option value="PENDING">Chờ duyệt</Select.Option>
          <Select.Option value="APPROVED">Đã duyệt</Select.Option>
          <Select.Option value="REJECTED">Từ chối</Select.Option>
          <Select.Option value="PUBLISHED">Đã xuất bản</Select.Option>
        </Select>

        <Select
          placeholder="Loại tin tức"
          value={newsTypeFilter || undefined}
          onChange={onNewsTypeFilterChange}
          style={{ width: 180 }}
          allowClear
        >
          <Select.Option value="NEWS">Xu hướng</Select.Option>
          <Select.Option value="RECRUITMENT">Tuyển dụng</Select.Option>
        </Select>

        <RangePicker
          placeholder={['Từ ngày', 'Đến ngày']}
          onChange={onDateRangeChange}
          style={{ width: 240 }}
        />

        <Button icon={<FilterOutlined />} onClick={onResetFilters}>
          Xóa bộ lọc
        </Button>
      </Space>
    </div>
  );
};

export default TrendNewsToolbar;
