import React from 'react';
import { Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Field, Topic, Level } from '@abc-interview-support-frontend/types';

const { Option } = Select;
const { Search } = Input;

interface QuestionListToolbarProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  fieldFilter: string;
  onFieldFilterChange: (value: string) => void;
  topicFilter: string;
  onTopicFilterChange: (value: string) => void;
  levelFilter: string;
  onLevelFilterChange: (value: string) => void;
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
    (topic) => fieldFilter === 'all' || topic.fieldId === fieldFilter
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
          <Option value="all">Tất cả</Option>
          {fields.map((field) => (
            <Option key={field.fieldId} value={field.fieldId}>
              {field.fieldName}
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
          disabled={fieldFilter === 'all'}
        >
          <Option value="all">Tất cả</Option>
          {filteredTopics.map((topic) => (
            <Option key={topic.topicId} value={topic.topicId}>
              {topic.topicName}
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
          <Option value="all">Tất cả</Option>
          {levels.map((level) => (
            <Option key={level.levelId} value={level.levelId}>
              {level.levelName}
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
          <Option value="Approved">Đã duyệt</Option>
          <Option value="Pending">Chờ duyệt</Option>
          <Option value="Rejected">Đã từ chối</Option>
        </Select>
      </div>
    </div>
  );
};

export default QuestionListToolbar;
