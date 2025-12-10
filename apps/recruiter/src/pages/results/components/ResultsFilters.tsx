import { Card, Space, Select, Input, DatePicker, Button } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { ExamOption, FiltersData } from './types';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface ResultsFiltersProps {
  examOptions: ExamOption[];
  filters: FiltersData;
  onExamChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onDateRangeChange: (dates: any) => void;
  onFilter: () => void;
  loading?: boolean;
}

const ResultsFilters: React.FC<ResultsFiltersProps> = ({
  examOptions,
  filters,
  onExamChange,
  onStatusChange,
  onSearchChange,
  onDateRangeChange,
  onFilter,
  loading = false,
}) => {
  return (
    <Card style={{ marginBottom: '16px' }}>
      <Space wrap>
        <Select
          style={{ width: 250 }}
          placeholder="Chọn kỳ thi"
          value={filters.selectedExam}
          onChange={onExamChange}
        >
          {examOptions.map((exam) => (
            <Option key={exam.id} value={exam.id}>
              {exam.title}
            </Option>
          ))}
        </Select>

        <Button
          type="primary"
          icon={<FilterOutlined />}
          onClick={onFilter}
          loading={loading}
          disabled={!filters.selectedExam}
        >
          {loading ? 'Đang lọc...' : 'Lọc'}
        </Button>

        <div style={{ width: '1px', height: '32px', backgroundColor: '#d9d9d9', margin: '0 8px' }} />

        <Select
          style={{ width: 150 }}
          placeholder="Trạng thái"
          value={filters.selectedStatus}
          onChange={onStatusChange}
        >
          <Option value="all">Tất cả</Option>
          <Option value="passed">Đã qua</Option>
          <Option value="failed">Chưa đạt</Option>
        </Select>

        <Input
          placeholder="Tìm kiếm thí sinh..."
          prefix={<SearchOutlined />}
          value={filters.searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ width: 250 }}
        />

        <RangePicker
          placeholder={['Từ ngày', 'Đến ngày']}
          onChange={onDateRangeChange}
        />
      </Space>
    </Card>
  );
};

export default ResultsFilters;
