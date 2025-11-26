import React from 'react';
import { Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Field, Topic, Level } from '@abc-interview-support-frontend/types';

const { Option } = Select;
const { Search } = Input;

interface QuestionListToolbarProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  fieldFilter: number | undefined;
  onFieldFilterChange: (value: number | undefined) => void;
  topicFilter: number | undefined;
  onTopicFilterChange: (value: number | undefined) => void;
  levelFilter: number | undefined;
  onLevelFilterChange: (value: number | undefined) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  fields: Field[];
  topics: Topic[];
  levels: Level[];
}

const QuestionListToolbar: React.FC<QuestionListToolbarProps> = ({
  searchText,
  onSearchChange,
  fieldFilter,
  onFieldFilterChange,
  topicFilter,
  onTopicFilterChange,
  levelFilter,
  onLevelFilterChange,
  statusFilter,
  onStatusFilterChange,
  fields,
  topics,
  levels,
}) => {
  const filteredTopics = topics.filter(
    (topic) => !fieldFilter || topic.fieldId === fieldFilter
  );

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto auto auto auto',
        gap: '12px',
        marginBottom: '16px',
      }}
    >
      <Search
        placeholder="Tìm kiếm câu hỏi..."
        allowClear
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{ maxWidth: '300px' }}
        prefix={<SearchOutlined />}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>
          Lĩnh vực
        </span>
        <Select
          placeholder="Lĩnh vực"
          value={fieldFilter}
          onChange={onFieldFilterChange}
          style={{ width: 120 }}
          allowClear
        >
          {fields.map((field) => (
            <Option key={field.id} value={field.id}>
              {field.name}
            </Option>
          ))}
        </Select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>
          Chủ đề
        </span>
        <Select
          placeholder="Chủ đề"
          value={topicFilter}
          onChange={onTopicFilterChange}
          style={{ width: 120 }}
          allowClear
          disabled={!fieldFilter}
        >
          {filteredTopics.map((topic) => (
            <Option key={topic.id} value={topic.id}>
              {topic.name}
            </Option>
          ))}
        </Select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>
          Mức độ
        </span>
        <Select
          placeholder="Mức độ"
          value={levelFilter}
          onChange={onLevelFilterChange}
          style={{ width: 120 }}
          allowClear
        >
          {levels.map((level) => (
            <Option key={level.id} value={level.id}>
              {level.name}
            </Option>
          ))}
        </Select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>
          Trạng thái
        </span>
        <Select
          placeholder="Trạng thái"
          value={statusFilter}
          onChange={onStatusFilterChange}
          style={{ width: 120 }}
          allowClear
        >
          <Option value="all">Tất cả</Option>
          <Option value="APPROVED">Đã duyệt</Option>
          <Option value="PENDING">Chờ duyệt</Option>
          <Option value="REJECTED">Đã từ chối</Option>
        </Select>
      </div>
    </div>
  );
};

export default QuestionListToolbar;
