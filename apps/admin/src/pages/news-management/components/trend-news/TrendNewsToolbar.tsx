import React from 'react';
import { Input, Select, DatePicker } from 'antd';
import { Field, Topic } from '@abc-interview-support-frontend/types';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface ToolbarProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  fieldFilter: string;
  onFieldFilterChange: (value: string) => void;
  topicFilter: string;
  onTopicFilterChange: (value: string) => void;
  selectedRowKeys: React.Key[];
  fields: Field[];
  topics: Topic[];
}

const TrendNewsToolbar: React.FC<ToolbarProps> = ({
  searchText,
  onSearchChange,
  fieldFilter,
  onFieldFilterChange,
  topicFilter,
  onTopicFilterChange,
  selectedRowKeys,
  fields,
  topics,
}) => {
  const filteredTopics = topics.filter(
    (topic) => fieldFilter === 'all' || topic.fieldId === fieldFilter
  );

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
          <Option key={field.fieldId} value={field.fieldId}>
            {field.fieldName}
          </Option>
        ))}
      </Select>

      <Select
        placeholder="Chủ đề"
        value={topicFilter}
        onChange={onTopicFilterChange}
        style={{ width: 150 }}
        allowClear
        disabled={fieldFilter === 'all'}
      >
        <Option value="all">Tất cả</Option>
        {filteredTopics.map((topic) => (
          <Option key={topic.topicId} value={topic.topicId}>
            {topic.topicName}
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
