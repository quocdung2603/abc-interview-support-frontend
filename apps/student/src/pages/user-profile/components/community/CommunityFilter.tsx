import React, { useState } from 'react';
import { Card, Select, Input, Button, Space, Row, Col } from 'antd';
import { FilterOutlined, ClearOutlined } from '@ant-design/icons';
import { Field, Topic, Level } from '@abc-interview-support-frontend/types';

const { Option } = Select;

interface CommunityFilterProps {
  fields: Field[];
  topics: Topic[];
  levels: Level[];
  onFilterChange: (filters: CommunityFilters) => void;
}

export interface CommunityFilters {
  postType?: string;
  fieldId?: number;
  topicId?: number;
  levelId?: number;
  status?: string;
  title?: string;
}

const CommunityFilter: React.FC<CommunityFilterProps> = ({
  fields,
  topics,
  levels,
  onFilterChange,
}) => {
  const [filters, setFilters] = useState<CommunityFilters>({});

  const handleFilterChange = (key: keyof CommunityFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {};
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const postTypeOptions = [
    { value: 'DISCUSSION', label: 'Thảo luận' },
    { value: 'QUESTION', label: 'Câu hỏi' },
  ];

  const statusOptions = [
    { value: 'DRAFT', label: 'Nháp' },
    { value: 'PUBLISHED', label: 'Đã xuất bản' },
    { value: 'LOCKED', label: 'Đã khóa' },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
            Loại bài viết
          </label>
          <Select
            placeholder="Chọn loại"
            allowClear
            size="small"
            className="w-full"
            value={filters.postType}
            onChange={(value) => handleFilterChange('postType', value)}
          >
            {postTypeOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
            Lĩnh vực
          </label>
          <Select
            placeholder="Chọn lĩnh vực"
            allowClear
            size="small"
            className="w-full"
            value={filters.fieldId}
            onChange={(value) => handleFilterChange('fieldId', value)}
          >
            {fields.map((field) => (
              <Option key={field.id} value={field.id}>
                {field.name}
              </Option>
            ))}
          </Select>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
            Chủ đề
          </label>
          <Select
            placeholder="Chọn chủ đề"
            allowClear
            size="small"
            className="w-full"
            value={filters.topicId}
            onChange={(value) => handleFilterChange('topicId', value)}
          >
            {topics.map((topic) => (
              <Option key={topic.id} value={topic.id}>
                {topic.name}
              </Option>
            ))}
          </Select>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
            Cấp độ
          </label>
          <Select
            placeholder="Chọn cấp độ"
            allowClear
            size="small"
            className="w-full"
            value={filters.levelId}
            onChange={(value) => handleFilterChange('levelId', value)}
          >
            {levels.map((level) => (
              <Option key={level.id} value={level.id}>
                {level.name}
              </Option>
            ))}
          </Select>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
            Trạng thái
          </label>
          <Select
            placeholder="Chọn trạng thái"
            allowClear
            size="small"
            className="w-full"
            value={filters.status}
            onChange={(value) => handleFilterChange('status', value)}
          >
            {statusOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
            Tiêu đề
          </label>
          <Input
            placeholder="Tìm kiếm..."
            size="small"
            value={filters.title}
            onChange={(e) => handleFilterChange('title', e.target.value)}
            allowClear
            className="w-full"
          />
        </div>
      </div>

      <div className="flex justify-end mt-4 pt-3 border-t border-gray-100">
        <Button
          type="link"
          size="small"
          icon={<ClearOutlined />}
          onClick={handleClearFilters}
          className="text-gray-500 hover:text-gray-700"
        >
          Xóa bộ lọc
        </Button>
      </div>
    </div>
  );
};

export default CommunityFilter;