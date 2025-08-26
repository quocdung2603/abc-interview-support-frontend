import { Card, Space, Select, Input, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
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
}

const ResultsFilters: React.FC<ResultsFiltersProps> = ({
  examOptions,
  filters,
  onExamChange,
  onStatusChange,
  onSearchChange,
  onDateRangeChange,
}) => {
  return (
    <Card style={{ marginBottom: '16px' }}>
      <Space wrap>
        <Select
          style={{ width: 200 }}
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
