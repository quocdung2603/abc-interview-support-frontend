import { Input, Select, Button, Space, DatePicker } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface TrendNewsToolbarProps {
  searchValue: string;
  statusFilter: string;
  categoryFilter: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
  onDateRangeChange: (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  ) => void;
  onResetFilters: () => void;
}

const { RangePicker } = DatePicker;

const TrendNewsToolbar: React.FC<TrendNewsToolbarProps> = ({
  searchValue,
  statusFilter,
  categoryFilter,
  onSearchChange,
  onStatusFilterChange,
  onCategoryFilterChange,
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
          <Select.Option value="published">Đã xuất bản</Select.Option>
          <Select.Option value="draft">Bản nháp</Select.Option>
          <Select.Option value="pending">Chờ duyệt</Select.Option>
          <Select.Option value="archived">Đã lưu trữ</Select.Option>
        </Select>

        <Select
          placeholder="Danh mục"
          value={categoryFilter || undefined}
          onChange={onCategoryFilterChange}
          style={{ width: 180 }}
          allowClear
        >
          <Select.Option value="technology">Công nghệ</Select.Option>
          <Select.Option value="career">Sự nghiệp</Select.Option>
          <Select.Option value="interview">Phỏng vấn</Select.Option>
          <Select.Option value="skills">Kỹ năng</Select.Option>
          <Select.Option value="industry">Ngành nghề</Select.Option>
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
