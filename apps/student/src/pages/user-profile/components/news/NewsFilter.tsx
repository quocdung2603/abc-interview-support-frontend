import React, { useState } from 'react';
import { Card, Select, Input, Button, Space } from 'antd';
import { FilterOutlined, ClearOutlined } from '@ant-design/icons';
import { Field } from '@abc-interview-support-frontend/types';

const { Option } = Select;

interface NewsFilterProps {
  fields: Field[];
  onFilterChange: (filters: NewsFilters) => void;
}

export interface NewsFilters {
  newsType?: string;
  fieldId?: number;
  title?: string;
}

const NewsFilter: React.FC<NewsFilterProps> = ({
  fields,
  onFilterChange,
}) => {
  const [filters, setFilters] = useState<NewsFilters>({});

  const handleFilterChange = (key: keyof NewsFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {};
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const newsTypeOptions = [
    { value: 'NEWS', label: 'Tin tức' },
    { value: 'ANNOUNCEMENT', label: 'Thông báo' },
  ];

  return (
    <div >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide">
            Loại tin tức
          </label>
          <Select
            placeholder="Chọn loại"
            allowClear
            size="small"
            className="w-full"
            value={filters.newsType}
            onChange={(value) => handleFilterChange('newsType', value)}
          >
            {newsTypeOptions.map((option) => (
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

export default NewsFilter;