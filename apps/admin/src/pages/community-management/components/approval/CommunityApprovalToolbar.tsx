import React from 'react';
import { Input, Select, DatePicker } from 'antd';
import { Field, Topic, Level, QuestionType } from '@abc-interview-support-frontend/types';

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
  levelFilter: string;
  onLevelFilterChange: (value: string) => void;
  postTypeFilter: string;
  onPostTypeFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  selectedRowKeys: React.Key[];
  fields: Field[];
  topics: Topic[];
  levels: Level[];
  questionTypes: QuestionType[];
}

const CommunityApprovalToolbar: React.FC<ToolbarProps> = ({
  searchText,
  onSearchChange,
  fieldFilter,
  onFieldFilterChange,
  topicFilter,
  onTopicFilterChange,
  levelFilter,
  onLevelFilterChange,
  postTypeFilter,
  onPostTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  selectedRowKeys,
  fields,
  topics,
  levels,
  questionTypes,
}) => {
  const filteredTopics = topics.filter(
    (topic) => fieldFilter === 'all' || topic.fieldId === Number(fieldFilter)
  );

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto auto auto auto auto auto auto',
        gap: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-lg)',
        alignItems: 'end',
      }}
    >
      <Search
        placeholder="Tìm kiếm theo nội dung câu hỏi..."
        allowClear
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{ maxWidth: '300px' }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>
          Lĩnh vực
        </span>
        <Select
          placeholder="Lĩnh vực"
          value={fieldFilter}
          onChange={onFieldFilterChange}
          style={{ width: 150 }}
          allowClear
        >
          <Option value="all">Tất cả</Option>
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
          style={{ width: 150 }}
          allowClear
          disabled={fieldFilter === 'all'}
        >
          <Option value="all">Tất cả</Option>
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
          style={{ width: 150 }}
          allowClear
        >
          <Option value="all">Tất cả</Option>
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
          style={{ width: 150 }}
          allowClear
        >
          <Option value="all">Tất cả</Option>
          <Option value="DRAFT">Nháp</Option>
          <Option value="PUBLISHED">Đã xuất bản</Option>
          <Option value="LOCKED">Đã khóa</Option>
        </Select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>
          Thời gian
        </span>
        <RangePicker
          placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
          style={{ width: 250 }}
        />
      </div>
    </div>
  );
};

export default CommunityApprovalToolbar;
