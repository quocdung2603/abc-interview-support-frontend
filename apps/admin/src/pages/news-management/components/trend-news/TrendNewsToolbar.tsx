import React from 'react';
import { Input, Select, DatePicker } from 'antd';
import { Field } from '@abc-interview-support-frontend/types';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface ToolbarProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  fieldFilter: string;
  onFieldFilterChange: (value: string) => void;
  selectedRowKeys: React.Key[];
  fields: Field[];
}

const TrendNewsToolbar: React.FC<ToolbarProps> = ({
  searchText,
  onSearchChange,
  fieldFilter,
  onFieldFilterChange,
  selectedRowKeys,
  fields,
}) => {

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto auto',
        gap: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-lg)',
        alignItems: 'center',
      }}
    >
      <Search
        placeholder="Tìm kiếm theo tiêu đề, nội dung..."
        allowClear
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{ maxWidth: '300px' }}
      />

      <Select
        placeholder="Lĩnh vực"
        value={fieldFilter}
        onChange={onFieldFilterChange}
        style={{ width: 150 }}
        allowClear
      >
        <Option value="all">Tất cả</Option>
        {fields.map((field) => (
          <Option key={field.id} value={field.id.toString()}>
            {field.name}
          </Option>
        ))}
      </Select>

      <RangePicker
        placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
        style={{ width: 250 }}
      />
    </div>
  );
};

export default TrendNewsToolbar;
