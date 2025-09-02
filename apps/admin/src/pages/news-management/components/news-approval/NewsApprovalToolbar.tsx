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
  locationFilter: string;
  onLocationFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  newsTypeFilter: string;
  onNewsTypeFilterChange: (value: string) => void;
  selectedRowKeys: React.Key[];
  fields: Field[];
  topics: Topic[];
}

const NewsApprovalToolbar: React.FC<ToolbarProps> = ({
  searchText,
  onSearchChange,
  fieldFilter,
  onFieldFilterChange,
  topicFilter,
  onTopicFilterChange,
  locationFilter,
  onLocationFilterChange,
  statusFilter,
  onStatusFilterChange,
  newsTypeFilter,
  onNewsTypeFilterChange,
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
        gridTemplateColumns: '1fr auto auto auto auto auto auto auto',
        gap: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-lg)',
        alignItems: 'end',
      }}
    >
      <Search
        placeholder="Tìm kiếm theo tiêu đề, nội dung..."
        allowClear
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{ maxWidth: '300px' }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>
          Loại tin
        </span>
        <Select
          placeholder="Loại tin tức"
          value={newsTypeFilter}
          onChange={onNewsTypeFilterChange}
          style={{ width: 120 }}
          allowClear
        >
          <Option value="all">Tất cả</Option>
          <Option value="trend">Xu hướng</Option>
          <Option value="recruitment">Tuyển dụng</Option>
        </Select>
      </div>

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
          Địa điểm
        </span>
        <Select
          placeholder="Địa điểm"
          value={locationFilter}
          onChange={onLocationFilterChange}
          style={{ width: 120 }}
          allowClear
        >
          <Option value="all">Tất cả</Option>
          <Option value="Hà Nội">Hà Nội</Option>
          <Option value="TP.HCM">TP.HCM</Option>
          <Option value="Đà Nẵng">Đà Nẵng</Option>
          <Option value="Hải Phòng">Hải Phòng</Option>
          <Option value="Cần Thơ">Cần Thơ</Option>
          <Option value="Toàn quốc">Toàn quốc</Option>
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
          <Option value="Pending">Chờ duyệt</Option>
          <Option value="Approve">Đã duyệt</Option>
          <Option value="Reject">Đã từ chối</Option>
        </Select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>
          Thời gian
        </span>
        <RangePicker
          placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
          style={{ width: 230 }}
        />
      </div>
    </div>
  );
};

export default NewsApprovalToolbar;
