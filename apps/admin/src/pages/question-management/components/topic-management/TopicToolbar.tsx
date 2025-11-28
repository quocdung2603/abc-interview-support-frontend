import React from 'react';
import { Input, Select } from 'antd';
import { Field } from '@abc-interview-support-frontend/types';

const { Search } = Input;
const { Option } = Select;

interface ToolbarProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  selectedRowKeys: React.Key[];
  fields: Field[];
  selectedFieldId: number | undefined;
  onFieldChange: (value: number | undefined) => void;
}

const TopicToolbar: React.FC<ToolbarProps> = ({
  searchText,
  onSearchChange,
  selectedRowKeys,
  fields,
  selectedFieldId,
  onFieldChange,
}) => {

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto auto auto auto auto',
        gap: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-lg)',
        alignItems: 'end',
      }}
    >
      <Search
        placeholder="Tìm kiếm theo tên chủ đề..."
        allowClear
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{ maxWidth: '300px' }}
      />

      <Select
        placeholder="Chọn lĩnh vực"
        allowClear
        value={selectedFieldId}
        onChange={(value) => onFieldChange(value)}
        style={{ minWidth: '200px' }}
      >
        {fields.map((field) => (
          <Option key={field.id} value={field.id}>
            {field.name}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default TopicToolbar;